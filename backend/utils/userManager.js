/* let usuariosConectados = [];

function addUser(socketID, nickname) {
  const novoUsuario = { id: socketID, nickname };
  usuariosConectados.push(novoUsuario);
  return novoUsuario;
}

function removeUser(socketID) {
  const usuario = usuariosConectados.find((u) => u.id === socketID);
  if (usuario) {
    usuariosConectados = usuariosConectados.filter((u) => u.id !== socketID);
  }
  return usuario;
}

function getAllUsers() {
  return usuariosConectados;
}

function isNicknameTaken(nickname) {
  return usuariosConectados.some((u) => u.nickname === nickname);
}

export { addUser, removeUser, getAllUsers, isNicknameTaken };

*/
