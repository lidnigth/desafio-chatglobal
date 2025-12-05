import styled from "styled-components";

const UserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h2`
  color: #e2e8f0;
  font-size: 1.5rem;
  margin-bottom: 10px;
  text-align: center;
`;

const Count = styled.h3`
  color: #94a3b8;
  text-align: center;
  margin: -8px 0 10px 0;
  font-weight: 400;
`;

const UserItem = styled.li`
  background: #0f172a;
  color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #1e293b;
  font-weight: 500;
`;

function UserListSala({ usuarios }) {
  return (
    <UserListContainer>
      <Title>Usuários na Sala</Title>
      <Count>({usuarios.length})</Count>
      <ul>
        {usuarios.map((usuario) => (
          <UserItem key={usuario.id}>{usuario.nickname}</UserItem>
        ))}
      </ul>
    </UserListContainer>
  );
}

export default UserListSala;
