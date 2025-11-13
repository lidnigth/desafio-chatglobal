/* import { Server } from "socket.io";
import { getAllMessages } from "../services/messageService.js";
import { registerChatHandlers } from "./handlers/chatHandler.js";
import { registerMessageHandlers } from "./handlers/messageHandler.js";

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("Novo cliente conectado:", socket.id);

    try {
      const historico = await getAllMessages();
      socket.emit("historicoMensagens", historico);
    } catch (err) {
      console.error("Erro ao buscar histórico de mensagens:", err);
    }

    registerChatHandlers(io, socket);
    registerMessageHandlers(io, socket);
  });

  return io;
}

export { setupSocketIO };
*/
