import { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  margin-top: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #1e293b;
  color: #e2e8f0;

  &:focus {
    outline: 2px solid #38bdf8;
  }
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 10px 15px;
  border: none;
  background: #38bdf8;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #0ea5e9;
  }
`;

function MessageFormSala({ onEnviar }) {
  const [conteudo, setConteudo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!conteudo.trim()) return;

    onEnviar(conteudo);
    setConteudo("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder="Mensagem na sala"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
      />
      <Button type="submit">Enviar</Button>
    </Form>
  );
}

export default MessageFormSala;
