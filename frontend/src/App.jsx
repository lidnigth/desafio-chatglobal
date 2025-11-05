import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";

function App() {
  const [mensagens, setMensagens] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3005");
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Conectado ao servidor de sockets com ID:", socket.id);
    });

    socket.on("historicoMensagens", (mensagem) => {
      setMensagens(mensagem);
    });

    socket.on("mensagemRecebida", (mensagem) => {
      console.log("Mensagem recebida via socket:", mensagem);
      setMensagens((prev) => [...prev, mensagem]);
    });

    socket.on("mensagemConfirmada", (mensagem) => {
      console.log("Mensagem confirmada pelo servidor:", mensagem);
      setMensagens((prev) => [...prev, mensagem]);
    });

    socket.on("disconnect", () => {
      console.log("Desconectado do servidor");
    });

    return () => {
      socket.off("connect");
      socket.off("historicoMensagens");
      socket.off("mensagemRecebida");
      socket.off("mensagemConfirmada");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const enviarMensagem = (autor, conteudo) => {
    if (!conteudo.trim()) return;

    const mensagem = { autor, conteudo };
    const socket = socketRef.current;
    if (!socket) {
      console.error("Socket não está conectado");
      return;
    }
    socket.emit("enviarMensagem", mensagem);
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
