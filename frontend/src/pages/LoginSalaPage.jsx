import styled from "styled-components";
import LoginSala from "../components/LoginSala";

const LoginSalaPageContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #e2e8f0;
  align-items: center;
`;

function LoginSalaPage({ onEntrarSala, onVoltar, socket }) {
  return (
    <LoginSalaPageContainer>
      <LoginSala onEntrarSala={onEntrarSala} onVoltar={onVoltar} socket={socket} />
    </LoginSalaPageContainer>
  );
}

export default LoginSalaPage;
