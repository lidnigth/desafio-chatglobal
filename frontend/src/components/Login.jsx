import { useState } from "react";
import "./Login.css";

function Login({ socket, onEntrar }) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nick = nickname.trim();
    if (!nick) {
      setError("Por favor, insira um nickname válido.");
      return;
    }

    if (!socket) {
      setError("Socket não está conectado.");
      return;
    }

    setIsLoading(true);
    socket.emit("entrarChat", nick, (resposta) => {
      setIsLoading(false);
      if (resposta && resposta.sucesso) {
        setError("");
        onEntrar(nick);
      } else {
        setError(resposta?.mensagem || "Erro ao entrar no chat.");
      }
    });
  };

  return (
    <div className="login-container">
      <h2>Escolha seu nickname</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Digite seu nickname"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
