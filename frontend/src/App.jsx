import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Login from "./components/Login";
import ChatPage from "./pages/ChatPage";
import LoginSalaPage from "./pages/LoginSalaPage";
import SalaPage from "./pages/SalaPage";

function App() {
  const [mensagens, setMensagens] = useState([]);
  const [nickname, setNickname] = useState(
    () => localStorage.getItem("nickname") || ""
  );
  const [usuariosConectados, setUsuariosConectados] = useState([]);

  const [salaAtual, setSalaAtual] = useState("");
  const [nicknameSala, setNicknameSala] = useState("");
  const [mensagensSala, setMensagensSala] = useState([]);
  const [usuariosSala, setUsuariosSala] = useState([]);

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

    socket.on("historicoMensagensSala", (historico) => {
      setMensagensSala(historico);
    });

    socket.on("mensagemRecebidaSala", (mensagem) => {
      setMensagensSala((prev) => [...prev, mensagem]);
    });

    socket.on("usuariosAtualizadosSala", (usuarios) => {
      setUsuariosSala(usuarios);
    });

    socket.on("mensagemSistemaSala", (mensagem) => {
      setMensagensSala((prev) => [
        ...prev, 
        {
        id: Date.now(),
        autor: "Sistema",
        conteudo: mensagem,
        data: new Date().toISOString(),
        }
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

  const entrarSala = (nomeSala, nick, fail) => {
    const socket = socketRef.current;
    if (!socket.connected) socket.connect();

    socket.emit("entrarSala", nomeSala, nick, (resposta) => {
      if (resposta.sucesso) {
        setSalaAtual(nomeSala);
        setNicknameSala(nick);
        console.log(`Entrou na sala ${nomeSala} como ${nick}`);
        setMensagensSala([]);
      } else {
        alert(resposta.mensagem);
        fail();
      }
    });
  };
  
  const sairSala = () => {
  const socket = socketRef.current;

  if (!socket || !salaAtual || !nicknameSala) {
    setSalaAtual("");
    setNicknameSala("");
    setMensagensSala([]);
    setUsuariosSala([]);
    return;
  }

  socket.emit("sairSala", salaAtual, nicknameSala, (resposta) => {
    if (!resposta?.sucesso) {
      console.warn("Falha ao sair da sala:", resposta?.mensagem);
    }

    setSalaAtual("");
    setNicknameSala("");
    setMensagensSala([]);
    setUsuariosSala([]);
  });
};

  const enviarMensagemSala = (conteudo) => {
    if (!conteudo.trim() || !salaAtual) return;

    const socket = socketRef.current;

    socket.emit("enviarMensagemSala", salaAtual, {
      autor: nicknameSala,
      conteudo,
    });
  };

  const handleLogout = () => {
    const socket = socketRef.current;
    localStorage.removeItem("nickname");
    setNickname("");
    if (socket) socket.disconnect();
  };
  
  if (salaAtual === "LOGIN_SALA") {
    return (
      <LoginSalaPage
        onEntrarSala={entrarSala}
        onVoltar={() => setSalaAtual("")}
      />
    );
  }

  if (salaAtual && salaAtual !== "LOGIN_SALA") {
    return (
      <SalaPage
        sala={salaAtual}
        nickname={nicknameSala}
        mensagens={mensagensSala}
        usuarios={usuariosSala}
        onEnviar={enviarMensagemSala}
        onVoltar={sairSala}
      />
    );
  }

  if (!nickname) {
    return (
      <Login
      onEntrar={handleLogin}
      onEntrarSala={() => setSalaAtual("LOGIN_SALA")}
      />
    );
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
