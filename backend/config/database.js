/* import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

export async function initializeDatabase() {
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

  return db;
}

export { db };

*/
