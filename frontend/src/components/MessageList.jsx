function MessageList({ mensagens }) {
  return (
    <ul>
      {mensagens.map((mensagem) => (
        <li key={mensagem.id}>
          <strong>{mensagem.autor}:</strong> {mensagem.conteudo}{" "}
          <em>({new Date(mensagem.data).toLocaleString()})</em>
        </li>
      ))}
    </ul>
  );
}

export default MessageList;
