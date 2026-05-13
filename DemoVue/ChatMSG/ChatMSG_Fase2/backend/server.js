import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import crypto from "crypto";

const PORT = process.env.PORT || 4001;
const SERVER_NAME = process.env.SERVER_NAME || `Servidor-${PORT}`;
const REDIS_URL = process.env.REDIS_URL;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

if (!REDIS_URL) {
  console.error("ERROR: Falta configurar REDIS_URL en el archivo .env");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
);

const publisher = createClient({
  url: REDIS_URL
});

const subscriber = createClient({
  url: REDIS_URL
});

publisher.on("error", (error) => {
  console.error("Error en Redis publisher:", error.message);
});

subscriber.on("error", (error) => {
  console.error("Error en Redis subscriber:", error.message);
});

await publisher.connect();
await subscriber.connect();

console.log("Redis conectado correctamente");

const clients = new Map();
const CHANNEL = "chatmsg-fase2";

app.get("/", (req, res) => {
  res.json({
    message: "Backend ChatMSG Fase 2 funcionando",
    server: SERVER_NAME,
    port: PORT,
    redis: "activo",
    clientOrigin: CLIENT_ORIGIN
  });
});

app.get("/status", (req, res) => {
  res.json({
    server: SERVER_NAME,
    port: PORT,
    clients: clients.size,
    redis: "conectado"
  });
});

app.post("/login", (req, res) => {
  const username = String(req.body.username || "").trim();

  if (!username) {
    return res.status(400).json({
      error: "El nombre de usuario es obligatorio"
    });
  }

  res.cookie("chat_username", username, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60
  });

  res.json({
    message: "Sesión creada con cookie httpOnly",
    username,
    server: SERVER_NAME
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("chat_username", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.json({
    message: "Sesión cerrada"
  });
});

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .reduce((acc, cookie) => {
      const [key, ...valueParts] = cookie.split("=");

      if (!key) return acc;

      acc[key] = decodeURIComponent(valueParts.join("="));
      return acc;
    }, {});
}

function send(socket, data) {
  if (socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

function sendToLocalClients(data) {
  const message = JSON.stringify(data);

  for (const client of clients.keys()) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}

function sendUsersCount() {
  sendToLocalClients({
    type: "users",
    total: clients.size,
    server: SERVER_NAME
  });
}

await subscriber.subscribe(CHANNEL, (message) => {
  try {
    const data = JSON.parse(message);
    sendToLocalClients(data);
  } catch (error) {
    console.error("Mensaje inválido recibido desde Redis:", error.message);
  }
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket, request) => {
  const cookies = parseCookies(request.headers.cookie || "");
  const username = cookies.chat_username;

  if (!username) {
    send(socket, {
      type: "error",
      text: "No tienes sesión activa. Primero inicia sesión."
    });

    socket.close();
    return;
  }

  const user = {
    id: crypto.randomUUID(),
    username
  };

  clients.set(socket, user);

  send(socket, {
    type: "system",
    text: `Conectado a ${SERVER_NAME}`,
    date: new Date().toISOString(),
    server: SERVER_NAME
  });

  publisher.publish(
    CHANNEL,
    JSON.stringify({
      type: "system",
      text: `${username} se conectó desde ${SERVER_NAME}`,
      date: new Date().toISOString(),
      server: SERVER_NAME
    })
  );

  sendUsersCount();

  socket.on("message", async (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());

      if (data.type !== "message") return;

      const text = String(data.text || "").trim();

      if (!text) return;

      const chatMessage = {
        type: "message",
        id: crypto.randomUUID(),
        username,
        text,
        date: new Date().toISOString(),
        server: SERVER_NAME
      };

      await publisher.publish(CHANNEL, JSON.stringify(chatMessage));
    } catch (error) {
      send(socket, {
        type: "error",
        text: "Mensaje inválido"
      });
    }
  });

  socket.on("close", async () => {
    clients.delete(socket);

    await publisher.publish(
      CHANNEL,
      JSON.stringify({
        type: "system",
        text: `${username} salió de ${SERVER_NAME}`,
        date: new Date().toISOString(),
        server: SERVER_NAME
      })
    );

    sendUsersCount();
  });
});

server.listen(PORT, () => {
  console.log(`${SERVER_NAME} ejecutándose en http://localhost:${PORT}`);
});