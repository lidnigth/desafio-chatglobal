/* import { saveMessage } from "../../services/messageService.js";

export function registerMessageHandlers(io, socket) {
  socket.on("enviarMensagem", async (mensagem) => {
    try {
      console.log("Mensagem recebida:", mensagem);

      const novaMensagem = await saveMessage(mensagem.autor, mensagem.conteudo);

      socket.broadcast.emit("mensagemRecebida", novaMensagem);
      socket.emit("mensagemConfirmada", novaMensagem);
    } catch (err) {
      console.error("Erro ao salvar mensagem:", err);
      socket.emit("erro", { message: "Erro ao salvar a mensagem." });
    }
  });
}
*/
