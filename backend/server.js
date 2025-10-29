import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(express.json());

let db;
async function init() {
  try {
    db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    await db.run(
      `CREATE TABLE IF NOT EXISTS mensagens (id INTEGER PRIMARY KEY AUTOINCREMENT, autor TEXT, conteudo TEXT, data TEXT)`
    );

    const PORT = process.env.PORT || 3005;
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}/mensagens`);
    });
  } catch (err) {
    console.error("Erro ao inicializar o banco de dados:", err);
  }
}

init();

app.get("/mensagens", async (req, res) => {
  const mensagens = await db.all("SELECT * FROM mensagens");
  res.json(mensagens);
});

app.post("/mensagens", async (req, res) => {
  const { autor, conteudo } = req.body;
  const data = new Date().toISOString();
  const result = await db.run(
    "INSERT INTO mensagens (autor, conteudo, data) VALUES (?, ?, ?)",
    [autor, conteudo, data]
  );
  res.json({ id: result.lastID, autor, conteudo, data });
});

app.delete("/mensagens/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("DELETE FROM mensagens WHERE id = ?", [id]);
  res.status(204).end();
});
