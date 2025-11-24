import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Login from "./components/Login";
import ChatPage from "./pages/ChatPage";

function App() {
  const [mensagens, setMensagens] = useState([]);
  const [nickname, setNickname] = useState("");
  const [usuariosConectados, setUsuariosConectados] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3005");
    }

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

    socket.on("usuariosAtualizados", (usuarios) => {
      setUsuariosConectados(usuarios);
    });

    socket.on("mensagemSistema", (mensagem) => {
      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now(),
          autor: "Sistema",
          conteudo: mensagem,
          data: new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("historicoMensagens");
      socket.off("mensagemRecebida");
      socket.off("mensagemConfirmada");
      socket.off("usuariosAtualizados");
      socket.off("mensagemSistema");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const enviarMensagem = (autor, conteudo) => {
    if (!conteudo.trim()) return;

    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      console.error("Socket não está conectado");
      return;
    }
    const mensagem = { autor: nickname, conteudo };
    socket.emit("enviarMensagem", mensagem);
  };

  if (!nickname) {
    return (
      <Login
        socket={socketRef.current}
        onEntrar={(nick) => setNickname(nick)}
      />
    );
  }

  return (
    <ChatPage
      mensagens={mensagens}
      onEnviar={enviarMensagem}
      usuarios={usuariosConectados}
      nickname={nickname}
    />
  );
}

export default App;
