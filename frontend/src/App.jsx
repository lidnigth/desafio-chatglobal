import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Login from "./components/Login";
import ChatPage from "./pages/ChatPage";

function App() {
  const [mensagens, setMensagens] = useState([]);
  const [nickname, setNickname] = useState(
    () => localStorage.getItem("nickname") || ""
  );
  const [usuariosConectados, setUsuariosConectados] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3005", {
        autoConnect: false,
        reconnection: true,
      });
    }

    const socket = socketRef.current;

    if (nickname && !socket.connected) {socket.connect();}

    socket.off();

    socket.on("connect", () => {
      console.log("Conectado ao servidor de sockets com ID:", socket.id);

      if (nickname) {
        socket.emit("entrarChat", nickname, (resposta) => {
         if (!resposta.sucesso) {
            localStorage.removeItem("nickname");
            setNickname("");
           alert(resposta.mensagem);
          } 
       });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Desconectado:", reason);
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

    return () => {
      socket.off();
    };
  }, [nickname]);

  const handleLogin = (nick, fail) => {
    const socket = socketRef.current;
    if (!socket.connected) socket.connect();

    socket.emit("entrarChat", nick, (resposta) => {
      if (resposta.sucesso) {
        localStorage.setItem("nickname", nick);
        setNickname(nick);
        console.log(`Usuário ${nick} entrou no chat.`);
      } else {
        alert(resposta.mensagem);
        fail();
      }
    });
  };

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
