import styled from "styled-components";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import UserList from "../components/UserList";

const ChatPageContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #0f172a;
  color: #e2e8f0;
  font-family: "Inter", sans-serif;
`;

const ChatMain = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid #1e293b;
  padding: 20px;
`;

const ChatSidebar = styled.div`
  flex: 1;
  padding: 20px;
  background: #1e293b;
  overflow-y: auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 15px;
  color: #38bdf8;
`;

function ChatPage({ mensagens, onEnviar, usuarios, nickname }) {
  return (
    <ChatPageContainer>
      <ChatMain>
        <Title>Chat Global</Title>
        <MessageList mensagens={mensagens} />
        <MessageForm onEnviar={(conteudo) => onEnviar(nickname, conteudo)} />
      </ChatMain>
      <ChatSidebar>
        <UserList usuarios={usuarios} />
      </ChatSidebar>
    </ChatPageContainer>
  );
}

export default ChatPage;
