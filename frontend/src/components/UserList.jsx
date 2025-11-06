function UserList({ usuarios }) {
  return (
    <div className="users-list">
      <h3>Usuários Online ({usuarios.length})</h3>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>{usuario.nickname}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
