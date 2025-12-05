import { useState } from "react";
import styled from "styled-components";

const LoginSalaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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

function LoginSala({ onEntrarSala, onVoltar }) {
  const [nomeSala, setNomeSala] = useState("");
  const [nicknameSala, setNicknameSala] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sala = nomeSala.trim();
    const nick = nicknameSala.trim();

    if (!sala || !nick) {
      setError("Preencha o nome da sala e seu nickname.");
      return;
    }

    setIsLoading(true);
    onEntrarSala(sala, nick, () => setIsLoading(false));
  };

  const voltandoSala = () => {
    onVoltar();
  };

  return (
    <LoginSalaContainer>
      <h2>Entre em uma sala:</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={nomeSala}
          onChange={(e) => setNomeSala(e.target.value)}
          placeholder="Nome da sala"
          disabled={isLoading}
        />

        <Input
          value={nicknameSala}
          onChange={(e) => setNicknameSala(e.target.value)}
          placeholder="Seu nickname"
          disabled={isLoading}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <Button onClick={voltandoSala} style={{ marginTop: "20px" }}>
        Voltar
      </Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </LoginSalaContainer>
  );
}

export default LoginSala;
