import { useEffect, useRef, useState } from "react";
import "./App.css";

const SERVERS = {
  server1: {
    name: "Servidor 1",
    api: "http://localhost:4001",
    ws: "ws://localhost:4001"
  },
  server2: {
    name: "Servidor 2",
    api: "http://localhost:4002",
    ws: "ws://localhost:4002"
  },
  server3: {
    name: "Servidor 3",
    api: "http://localhost:4003",
    ws: "ws://localhost:4003"
  }
};

export default function App() {
  const [selectedServer, setSelectedServer] = useState("server1");
  const [tempUsername, setTempUsername] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [usersOnline, setUsersOnline] = useState(0);
  const [currentServer, setCurrentServer] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  async function loginAndConnect() {
    const cleanUsername = tempUsername.trim();

    if (!cleanUsername) {
      alert("Escribe tu nombre de usuario");
      return;
    }

    const server = SERVERS[selectedServer];

    try {
      const response = await fetch(`${server.api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username: cleanUsername
        })
      });

      if (!response.ok) {
        alert("No se pudo iniciar sesión");
        return;
      }

      const socket = new WebSocket(server.ws);

      socket.onopen = () => {
        socketRef.current = socket;
        setUsername(cleanUsername);
        setConnected(true);
        setCurrentServer(server.name);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (
          data.type === "message" ||
          data.type === "system" ||
          data.type === "error"
        ) {
          setMessages((previous) => [...previous, data]);
        }

        if (data.type === "users") {
          setUsersOnline(data.total);
        }
      };

      socket.onclose = () => {
        socketRef.current = null;
      };

      socket.onerror = () => {
        alert("Error en la conexión WebSocket");
      };
    } catch (error) {
      alert("No se pudo conectar con el backend");
    }
  }

  function sendMessage(event) {
    event.preventDefault();

    const cleanText = text.trim();

    if (!cleanText || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "message",
        text: cleanText
      })
    );

    setText("");
  }

  async function disconnect() {
    const server = SERVERS[selectedServer];

    socketRef.current?.close();
    socketRef.current = null;

    await fetch(`${server.api}/logout`, {
      method: "POST",
      credentials: "include"
    });

    setConnected(false);
    setMessages([]);
    setText("");
    setUsername("");
    setUsersOnline(0);
    setCurrentServer("");
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      socketRef.current?.close();
    };
  }, []);

  if (!connected) {
    return (
      <main className="page">
        <section className="card login-card">
          <h1>ChatMSG Fase 2</h1>
          <p>React + Express + WebSockets + Redis + cookies httpOnly.</p>

          <label>Servidor backend</label>

          <select
            value={selectedServer}
            onChange={(event) => setSelectedServer(event.target.value)}
          >
            <option value="server1">Servidor 1 - Puerto 4001</option>
            <option value="server2">Servidor 2 - Puerto 4002</option>
            <option value="server3">Servidor 3 - Puerto 4003</option>
          </select>

          <input
            type="text"
            placeholder="Nombre de usuario"
            value={tempUsername}
            onChange={(event) => setTempUsername(event.target.value)}
          />

          <button onClick={loginAndConnect}>Entrar al chat</button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card chat-card">
        <header className="chat-header">
          <div>
            <h1>ChatMSG Fase 2</h1>
            <p>Usuario: {username}</p>
            <p>Servidor local: {currentServer}</p>
            <p>Usuarios en este servidor: {usersOnline}</p>
          </div>

          <button className="danger-button" onClick={disconnect}>
            Salir
          </button>
        </header>

        <section className="messages">
          {messages.map((message, index) => (
            <article
              key={message.id || index}
              className={
                message.type === "message" ? "message" : "system-message"
              }
            >
              {message.type === "message" ? (
                <>
                  <strong>{message.username}</strong>
                  <p>{message.text}</p>
                  <span>
                    {new Date(message.date).toLocaleTimeString()} |{" "}
                    {message.server}
                  </span>
                </>
              ) : (
                <p>{message.text}</p>
              )}
            </article>
          ))}

          <div ref={bottomRef}></div>
        </section>

        <form className="message-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />

          <button type="submit">Enviar</button>
        </form>
      </section>
    </main>
  );
}