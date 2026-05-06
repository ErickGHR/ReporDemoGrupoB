import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [usersOnline, setUsersOnline] = useState(0);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  function connect() {
    const cleanUsername = tempUsername.trim();

    if (!cleanUsername) {
      alert("Escribe tu nombre");
      return;
    }

    const socket = new WebSocket("ws://localhost:4000");

    socket.onopen = () => {
      socketRef.current = socket;
      setUsername(cleanUsername);
      setConnected(true);

      socket.send(
        JSON.stringify({
          type: "join",
          username: cleanUsername
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message" || data.type === "system" || data.type === "error") {
        setMessages((previous) => [...previous, data]);
      }

      if (data.type === "users") {
        setUsersOnline(data.total);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      socketRef.current = null;
    };

    socket.onerror = () => {
      alert("No se pudo conectar con el backend");
    };
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

  function disconnect() {
    socketRef.current?.close();
    socketRef.current = null;
    setConnected(false);
    setMessages([]);
    setUsersOnline(0);
    setUsername("");
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
          <h1>ChatMSG Fase 1</h1>
          <p>Chat en tiempo real con React, Express y WebSockets.</p>

          <input
            type="text"
            placeholder="Nombre de usuario"
            value={tempUsername}
            onChange={(event) => setTempUsername(event.target.value)}
          />

          <button onClick={connect}>Entrar al chat</button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card chat-card">
        <header className="chat-header">
          <div>
            <h1>ChatMSG Fase 1</h1>
            <p>Usuario: {username}</p>
            <p>Usuarios conectados: {usersOnline}</p>
          </div>

          <button className="danger-button" onClick={disconnect}>
            Salir
          </button>
        </header>

        <section className="messages">
          {messages.map((message, index) => (
            <article
              key={message.id || index}
              className={message.type === "message" ? "message" : "system-message"}
            >
              {message.type === "message" ? (
                <>
                  <strong>{message.username}</strong>
                  <p>{message.text}</p>
                  <span>{new Date(message.date).toLocaleTimeString()}</span>
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

