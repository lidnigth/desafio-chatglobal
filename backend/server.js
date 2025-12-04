import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// BANCO DE DADOS (better-sqlite3)
// ================================
const db = new Database("./database.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS mensagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    autor TEXT,
    conteudo TEXT,
    data TEXT,
    para TEXT
  )
`);

// ================================
// ROTAS HTTP
// ================================
app.get("/", (req, res) => {
  res.send("Servidor do Chat Global está rodando.");
});

app.get("/mensagens", (req, res) => {
  try {
    const mensagens = db
      .prepare("SELECT * FROM mensagens ORDER BY id ASC")
      .all();
    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
});

// ================================
// SOCKET.IO
// ================================
const PORT = process.env.PORT || 3005;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let usuariosConectados = [];
let salas = {};
// ex: salas = {"sala1": {usuarios: [socked.id, ...], mensagens: [{id, autor, conteudo, data, para?}, ...]}}

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);
  // ============================
  // HISTORICO INICIAL (msgs publicas)
  // ============================
  try {
    const historicoPublico = db
      .prepare("SELECT * FROM mensagens WHERE para IS NULL ORDER BY id ASC")
      .all();
    socket.emit("historicoMensagens", historicoPublico);
  } catch (err) {
    console.error("Erro ao carregar histórico:", err);
  }

  // ============================
  // ENTRAR NO CHAT
  // ============================
  socket.on("entrarChat", (nickname, callback) => {
    const nickEmUso = usuariosConectados.some(
      (user) => user.nickname === nickname
    );

    if (nickEmUso) {
      callback({ sucesso: false, mensagem: "Nickname já está em uso." });
      return;
    }

    const existente = usuariosConectados.find((u) => u.nickname === nickname);

    if (existente) {
      const socketAindaAtivo = io.sockets.sockets.has(existente.id);
      if (!socketAindaAtivo) {
        usuariosConectados = usuariosConectados.filter(
          (u) => u.nickname !== nickname
        );
        console.log(`Removido ghost de nick ${nickname}`);
      } else {
        callback({ sucesso: false, mensagem: "Nickname já está em uso." });
        return;
      }
    }

    const novoUsuario = { id: socket.id, nickname };
    usuariosConectados.push(novoUsuario);

    console.log(`Usuário ${nickname} entrou no chat.`);
    io.emit("usuariosAtualizados", usuariosConectados);
    io.emit("mensagemSistema", `${nickname} entrou no chat.`);

    try {
      const historicoCompleto = db
        .prepare(
          "SELECT * FROM mensagens WHERE para IS NULL OR para = ? OR autor = ? ORDER BY id ASC"
        )
        .all(nickname, nickname);

      socket.emit("historicoMensagens", historicoCompleto);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    }

    callback({ sucesso: true });
  });

  // ============================
  // ENTRAR EM SALA
  // ============================
  socket.on("entrarSala", (nomeSala, nickname, callback) => {
    try {
      if (!salas[nomeSala]) {
        salas[nomeSala] = { usuarios: [], mensagens: [] };
      }
      
      const nickExiste = salas[nomeSala].usuarios.some(
        (u) => u.nickname === nickname
      );

      if (nickExiste) {
        return callback({ sucesso: false, mensagem: "Nickname já está em uso na sala." });
      }

      salas[nomeSala].usuarios.push({id: socket.id, nickname});

      socket.join(nomeSala);

      socket.emit("historicoMensagensSala", salas[nomeSala].mensagens);

      socket.to(nomeSala).emit("mensagemSistema", `${nickname} entrou na sala ${nomeSala}}`);

      callback({ sucesso: true });
    } catch (err) {
      console.error("Erro ao entrar na sala:", err);
      callback({ sucesso: false, mensagem: "Erro ao entrar na sala." });
    }
  });

  // ============================
  // DESCONECTAR
  // ============================
  socket.on("disconnect", () => {
    const usuario = usuariosConectados.find((user) => user.id === socket.id);

    if (usuario) {
      usuariosConectados = usuariosConectados.filter(
        (user) => user.id !== socket.id
      );

      console.log(`Usuário ${usuario.nickname} saiu do chat.`);
      io.emit("usuariosAtualizados", usuariosConectados);
      io.emit("mensagemSistema", `${usuario.nickname} saiu do chat.`);

      Object.keys(salas).forEach((nomeSala) => {
        const antes = salas[nomeSala].usuarios.length;

        salas[nomeSala].usuarios = salas[nomeSala].usuarios.filter(
          (u) => u.id !== socket.id
        );

        const depois = salas[nomeSala].usuarios.length;

        if (antes !== depois) {
          io.to(nomeSala).emit("mensagemSistema", `${usuario?.nickname || "Alguém"} saiu da sala ${nomeSala}}`);
        }
      });
    }
  });

  // ============================
  // ENVIAR MENSAGEM
  // ============================
  socket.on("enviarMensagem", (mensagem) => {
    try {
      const data = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO mensagens (autor, conteudo, data)
        VALUES (?, ?, ?)
      `);

      const result = stmt.run(mensagem.autor, mensagem.conteudo, data);

      const novaMensagem = {
        id: result.lastInsertRowid,
        autor: mensagem.autor,
        conteudo: mensagem.conteudo,
        data,
      };

      socket.broadcast.emit("mensagemRecebida", novaMensagem);
      socket.emit("mensagemConfirmada", novaMensagem);
    } catch (err) {
      console.error("Erro ao salvar mensagem:", err);
      socket.emit("erro", { message: "Erro ao salvar mensagem." });
    }
  });

  // ============================
  // ENVIAR MENSAGEM PARA SALA
  // ============================
  socket.on("enviarMensagemSala", (nomeSala, mensagem) => {
    try {
      if (!salas[nomeSala]) {
        socket.emit("erro", { message: "Sala não encontrada." });
        return;
      }
      const data = new Date().toISOString();
      const novaMensagem = {
        id: Date.now(),
        autor: mensagem.autor,
        conteudo: mensagem.conteudo,
        data,
        para: mensagem.para || null,
      };

      salas[nomeSala].mensagens.push(novaMensagem);

      io.to(nomeSala).emit("mensagemRecebidaSala", novaMensagem);
    } catch (err) {
      console.error("Erro ao enviar mensagem para sala:", err);
      socket.emit("erro", { message: "Erro ao enviar mensagem para sala." });
    }
  });

  // ============================
  // ENVIAR SUSSURRO
  // ============================
  socket.on("enviarSussurro", (mensagem, destinatarioNick) => {
    try {
      const usuarioDestino = usuariosConectados.find(
        (user) => user.nickname === destinatarioNick
      );

      if (!usuarioDestino) {
        socket.emit("erro", { message: "Destinatário não encontrado." });
        return;
      }

      const data = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO mensagens (autor, conteudo, data, para)
        VALUES (?, ?, ?, ?)
      `);

      const result = stmt.run(
        mensagem.autor,
        mensagem.conteudo,
        data,
        destinatarioNick
      );

      const novoSussurro = {
        id: result.lastInsertRowid,
        autor: mensagem.autor,
        conteudo: mensagem.conteudo,
        data,
        para: destinatarioNick,
      };

      io.to(usuarioDestino.id).emit("sussurroRecebido", novoSussurro);
      socket.emit("sussurroConfirmado", novoSussurro);
    } catch (err) {
      console.error("Erro ao salvar sussurro:", err);
      socket.emit("erro", { message: "Erro ao salvar sussurro." });
    }
  });
});
