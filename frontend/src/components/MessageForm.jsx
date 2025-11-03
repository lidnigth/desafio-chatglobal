import { useState } from "react";

function MessageForm({ onEnviar }) {
  const [autor, setAutor] = useState("");
  const [conteudo, setConteudo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!autor.trim() || !conteudo.trim()) return;
    onEnviar(autor, conteudo);
    setConteudo("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Seu nome"
        value={autor}
        onChange={(e) => {
          e.preventDefault();
          setAutor(e.target.value);
        }}
      />
      <input
        placeholder="Sua mensagem"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default MessageForm;
