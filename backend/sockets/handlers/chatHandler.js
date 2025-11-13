/* import * as userManager from "../../utils/userManager.js";

function registerChatHandlers(io, socket) {
  socket.on("entrarChat", (nickname, callback) => {
    if (userManager.isNicknameTaken(nickname)) {
      callback({ sucesso: false, mensagem: "Nickname já está em uso." });
      return;
    }

    userManager.addUser(socket.id, nickname);
    console.log(`Usuário ${nickname} entrou no chat.`);

    io.emit("usuariosAtualizados", userManager.getAllUsers());
    io.emit("mensagemSistema", `${nickname} entrou no chat.`);
    callback({ sucesso: true });
  });

  socket.on("disconnect", () => {
    const usuario = userManager.removeUser(socket.id);
    if (usuario) {
      io.emit("usuariosAtualizados", userManager.getAllUsers());
      console.log("Usuários conectados:", userManager.getAllUsers())
      io.emit("mensagemSistema", `${usuario.nickname} saiu do chat.`);
    }
  });
}

export { registerChatHandlers };
*/
