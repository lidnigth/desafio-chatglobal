/* import { getAllMessages as serviceGetAllMessages } from "../services/messageService.js";

async function getRootPage(req, res) {
  res.send("Servidor do Chat Global está rodando.");
}

async function getAllMensagens(req, res) {
  try {
    const mensagens = await serviceGetAllMessages();
    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
}

export { getRootPage, getAllMensagens };
*/
