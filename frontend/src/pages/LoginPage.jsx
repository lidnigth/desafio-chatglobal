import styled from "styled-components";
import Login from "../components/Login";

const LoginPageContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: #0f172a;
`;

function LoginPage({ onEntrar, socket }) {
  return (
    <LoginPageContainer>
      <Login onEntrar={onEntrar} socket={socket} />
    </LoginPageContainer>
  );
}

export default LoginPage;
