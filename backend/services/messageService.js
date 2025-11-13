/* import { db } from "../config/database.js";

async function getAllMessages() {
  try {
    const mensagens = await db.all("SELECT * FROM mensagens ORDER BY id ASC");
    return mensagens;
  } catch (err) {
    console.error("Erro ao buscar mensagens:", err);
    throw err;
  }
}

async function saveMessage(autor, conteudo) {
  try {
    const data = new Date().toISOString();
    const result = await db.run(
      `INSERT INTO mensagens (autor, conteudo, data) VALUES (?, ?, ?)`,
      [autor, conteudo, data]
    );

    return {
      id: result.lastID,
      autor,
      conteudo,
      data,
    };
  } catch (err) {
    console.error("Erro ao salvar mensagem:", err);
    throw err;
  }
}

export { getAllMessages, saveMessage };
*/
