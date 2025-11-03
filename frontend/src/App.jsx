import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";

const API_URL = "http://localhost:3005/mensagens";
const socket = io("http://localhost:3005");

function App() {
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMensagens(data))
      .catch((err) => console.error("Erro ao buscar mensagens:", err));
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado ao servidor de sockets com ID:", socket.id);
    });

    socket.on("mensagemRecebida", (mensagem) => {
      console.log("Mensagem recebida via socket:", mensagem);
      setMensagens((prev) => {
        if (prev.find((msg) => msg.id === mensagem.id)) return prev;
        return [...prev, mensagem];
      });
    });

    return () => {
      socket.off("connect");
      socket.off("mensagemRecebida");
    };
  }, []);

  const enviarMensagem = async (autor, conteudo) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ autor, conteudo }),
    });
    const novaMensagem = await res.json();
    setMensagens([...mensagens, novaMensagem]);

    socket.emit("enviarMensagem", novaMensagem);
  };

  return (
    <div>
      <h1>Chat Global</h1>
      <MessageList mensagens={mensagens} />
      <MessageForm onEnviar={enviarMensagem} />
    </div>
  );
}

export default App;
