import { useState } from "react";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #e2e8f0;
`;

const Input = styled.input`
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  margin-top: 10px;
  width: 200px;
  background-color: #334155;
  color: white;

  &:focus {
    outline: 2px solid #38bdf8;
  }
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  background: #38bdf8;
  color: #0f172a;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #0ea5e9;
  }
`;

const ErrorMessage = styled.p`
  color: #f87171;
  margin-top: 10px;
`;

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

    setIsLoading(true);
    onEntrar(nick, () => {
      setIsLoading(false);
    });
  };

  return (
    <LoginContainer>
      <h2>Escolha seu nickname</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Digite seu nickname"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </LoginContainer>
  );
}

export default Login;
