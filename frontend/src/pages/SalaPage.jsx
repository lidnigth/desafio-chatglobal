import styled from "styled-components";
import MessageListSala from "../components/MessageListSala";
import MessageFormSala from "../components/MessageFormSala";
import UserListSala from "../components/UserListSala";

const SalaContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #0f172a;
  color: #e2e8f0;
  font-family: "Inter", sans-serif;
`;

const SalaMain = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid #1e293b;
`;

const SalaSidebar = styled.div`
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

const LeaveButton = styled.button`
  margin-top: 15px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  background: #ef4444;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

function SalaPage({
  sala,
  nickname,
  mensagens,
  usuarios,
  onEnviar,
  onVoltar,
}) {
  return (
    <SalaContainer>
      {/* MAIN */}
      <SalaMain>
        <Title>Sala: {sala}</Title>
        <MessageListSala mensagens={mensagens} />
        <MessageFormSala onEnviar={onEnviar} />
      </SalaMain>

      {/* SIDEBAR */}
      <SalaSidebar>
        <UserListSala usuarios={usuarios} />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <LeaveButton onClick={onVoltar}>Sair da Sala</LeaveButton>
        </div>
      </SalaSidebar>
    </SalaContainer>
  );
}

export default SalaPage;
