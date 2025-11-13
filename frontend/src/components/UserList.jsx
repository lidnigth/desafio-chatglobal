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

const UserItem = styled.li`
  background: #0f172a;
  color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #1e293b;
  font-weight: 500;
`;

function UserList({ usuarios }) {
  return (
    <UserListContainer>
      <Title>Usuários Online</Title>
      <h2>({usuarios.length})</h2>
      <ul>
        {usuarios.map((usuario) => (
          <UserItem key={usuario.id}>{usuario.nickname}</UserItem>
        ))}
      </ul>
    </UserListContainer>
  );
}

export default UserList;
