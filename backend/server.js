import dotenv from "dotenv";
import { createApp } from "./src/app.js";
import { pool } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor escuchando en http://localhost:${PORT}`);
  console.log(`   Healthcheck: http://localhost:${PORT}/api/health\n`);
});

// Cierre ordenado: libera el pool de conexiones al recibir señales de apagado.
function shutdown(signal) {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(async () => {
    await pool.end();
    console.log("Conexiones cerradas. Adios.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
