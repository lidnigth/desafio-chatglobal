import styled from "styled-components";

const MessageListContainer = styled.div`
  flex: 1;
  background: #0f172a;
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
  border: 1px solid #1e293b;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 3px;
  }
`;

const MessageItem = styled.li`
  margin-bottom: 10px;
  list-style: none;
  padding: 10px;
  border-radius: 6px;
  background: ${({ $isSystem }) => ($isSystem ? "#1e293b" : "#0f172a")};
  border-left: 4px solid
    ${({ $isSystem }) => ($isSystem ? "#38bdf8" : "#22d3ee")};
`;

const Author = styled.strong`
  color: #38bdf8;
  font-weight: 600;
  margin-right: 8px;
`;

const Content = styled.span`
  color: #e2e8f0;
`;

const DateInfo = styled.em`
  color: #94a3b8;
  font-size: 0.85rem;
  margin-left: 10px;
`;

function MessageListSala({ mensagens }) {
  return (
    <MessageListContainer>
      {mensagens.map((mensagem, index) => (
        <MessageItem
          key={index}
          $isSystem={mensagem.autor === "Sistema"}
        >
          <Author>{mensagem.autor}:</Author>{" "}
          <Content>{mensagem.conteudo}</Content>
          <DateInfo>
            ({new Date(mensagem.data).toLocaleString()})
          </DateInfo>
        </MessageItem>
      ))}
    </MessageListContainer>
  );
}

export default MessageListSala;
