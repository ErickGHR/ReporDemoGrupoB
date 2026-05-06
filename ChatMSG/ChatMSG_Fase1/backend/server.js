import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import crypto from "crypto";

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Map();

app.get("/", (req, res) => {
  res.json({
    message: "Backend ChatMSG Fase 1 funcionando",
    websocket: "ws://localhost:4000"
  });
});

function send(socket, data) {
  if (socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

function broadcast(data) {
  const message = JSON.stringify(data);

  for (const client of clients.keys()) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}

function sendUsersCount() {
  broadcast({
    type: "users",
    total: clients.size
  });
}

wss.on("connection", (socket) => {
  const user = {
    id: crypto.randomUUID(),
    username: "Invitado"
  };

  clients.set(socket, user);

  send(socket, {
    type: "system",
    text: "Conectado al chat",
    date: new Date().toISOString()
  });

  sendUsersCount();

  socket.on("message", (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());

      if (data.type === "join") {
        const username = String(data.username || "").trim();

        if (!username) {
          send(socket, {
            type: "error",
            text: "El nombre de usuario no puede estar vacío"
          });

          return;
        }

        user.username = username;

        broadcast({
          type: "system",
          text: `${user.username} entró al chat`,
          date: new Date().toISOString()
        });

        return;
      }

      if (data.type === "message") {
        const text = String(data.text || "").trim();

        if (!text) return;

        broadcast({
          type: "message",
          id: crypto.randomUUID(),
          username: user.username,
          text,
          date: new Date().toISOString()
        });
      }
    } catch (error) {
      send(socket, {
        type: "error",
        text: "Mensaje inválido"
      });
    }
  });

  socket.on("close", () => {
    const disconnectedUser = clients.get(socket);

    clients.delete(socket);

    if (disconnectedUser) {
      broadcast({
        type: "system",
        text: `${disconnectedUser.username} salió del chat`,
        date: new Date().toISOString()
      });
    }

    sendUsersCount();
  });
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});