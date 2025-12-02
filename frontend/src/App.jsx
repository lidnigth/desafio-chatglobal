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
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3005", { autoConnect: false });
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

    socket.on("sussurroRecebido", (mensagem) => {
      console.log("Sussurro recebido via socket:", mensagem);
      setMensagens((prev) => [...prev, mensagem]);
    });

    socket.on("sussurroConfirmado", (mensagem) => {
      console.log("Sussurro confirmado pelo servidor:", mensagem);
      setMensagens((prev) => [...prev, mensagem]);
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
    
    socket.on("disconnect", (reason) => {
      console.log("Desconectado do servidor", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("historicoMensagens");
      socket.off("mensagemRecebida");
      socket.off("mensagemConfirmada");
      socket.off("sussurroRecebido");
      socket.off("sussurroConfirmado");
      socket.off("usuariosAtualizados");
      socket.off("mensagemSistema");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  const handleLogin = (nick) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.connect();

    socket.once("connect", () => {
      socket.emit("entrarChat", nick, (resposta) => {
        if (resposta && resposta.sucesso) {
          localStorage.setItem("nickname", nick);
          setNickname(nick);
          console.log("Entrou no chat com sucesso");
        } else {
          console.warn("Não foi possível entrar no chat:", resposta?.mensagem);
          alert(resposta?.mensagem || "Erro ao entrar no chat.");
        }
      });
    })
  }

  useEffect(() => {
    const savedNick = localStorage.getItem("nickname");
    const socket = socketRef.current;
    if (!savedNick || !socket) return;

    const tentarEntrar = () => {
      socket.emit("entrarChat", savedNick, (resposta) => {
        if (resposta?.sucesso) {
          setNickname(savedNick);
        } else {
          console.warn(
            "Não foi possível restaurar sessão:",
            resposta?.mensagem
          );
          localStorage.removeItem("nickname");
          setNickname("");
        }
      });
    };
      
    if (socket.connected) {
      tentarEntrar();
    } else {
      socket.once("connect", tentarEntrar);
    }
     return () => {
       socket.off("connect", tentarEntrar);
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

  const enviarSussurro = (autor, conteudo, destinatarioNick) => {
    if (!conteudo.trim() || !destinatarioNick.trim()) return;

    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      console.error("Socket não está conectado");
      return;
    }

    const sussurro = { autor: nickname, conteudo, para: destinatarioNick };
    socket.emit("enviarSussurro", sussurro, destinatarioNick);
  };

  const handleLogout = () => {
    const socket = socketRef.current;
    localStorage.removeItem("nickname");
    setNickname("");
    if (socket) socket.disconnect();
  };

  if (!nickname) {
    return <Login onEntrar={handleLogin} />;
  }

  return (
    <ChatPage
      mensagens={mensagens}
      onEnviar={enviarMensagem}
      onEnviarSussurro={enviarSussurro}
      usuarios={usuariosConectados}
      nickname={nickname}
      onLogout={handleLogout}
    />
  );
}

export default App;
