import express from "express";
import { Server } from "socket.io";
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
      `CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      autor TEXT,
      conteudo TEXT,
      data TEXT)`
    );

    app.get("/", (req, res) => {
      res.send("Servidor do Chat Global está rodando.");
    });

    app.get("/mensagens", async (req, res) => {
      try {
        const mensagens = await db.all(
          "SELECT * FROM mensagens ORDER BY id ASC"
        );
        res.json(mensagens);
      } catch (err) {
        res.status(500).json({ error: "Erro ao buscar mensagens" });
      }
    });

    const PORT = process.env.PORT || 3005;
    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}/mensagens`);
    });

    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", async (socket) => {
      console.log("Novo cliente conectado:", socket.id);

      try {
        const historico = await db.all(
          `SELECT * FROM mensagens ORDER BY id ASC`
        );
        socket.emit("historicoMensagens", historico);
      } catch (err) {
        console.error("Erro ao buscar histórico de mensagens:", err);
      }

      socket.on("enviarMensagem", async (mensagem) => {
        try {
          console.log("Mensagem recebida:", mensagem);

          const data = new Date().toISOString();
          const result = await db.run(
            `INSERT INTO mensagens (autor, conteudo, data) VALUES (?, ?, ?)`,
            [mensagem.autor, mensagem.conteudo, data]
          );

          const novaMensagem = {
            id: result.lastID,
            autor: mensagem.autor,
            conteudo: mensagem.conteudo,
            data: data,
          };

          socket.broadcast.emit("mensagemRecebida", novaMensagem);
          socket.emit("mensagemConfirmada", novaMensagem);
        } catch (err) {
          console.error("Erro ao salvar mensagem:", err);
          socket.emit("erro", { message: "Erro ao salvar a mensagem." });
        }
      });

      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
      });
    });
  } catch (err) {
    console.error("Erro ao inicializar o banco de dados:", err);
    process.exit(1);
  }
}

init();
