import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

/**
 * Pool de conexiones a PostgreSQL.
 *
 * Se configura con una unica variable DATABASE_URL (formato estandar de
 * Render/Railway). En produccion se activa SSL automaticamente; en local,
 * si la URL apunta a localhost, se desactiva.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "[db] Falta la variable de entorno DATABASE_URL. Copia .env.example a .env y completala."
  );
}

const isLocal =
  connectionString?.includes("localhost") ||
  connectionString?.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  // Render exige SSL para conexiones externas; en local lo desactivamos.
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("[db] Error inesperado en el pool de PostgreSQL:", err.message);
});

/**
 * Helper para ejecutar consultas parametrizadas.
 * Centraliza el acceso a la BD para que los servicios no toquen el pool directamente.
 */
export const query = (text, params) => pool.query(text, params);

export default pool;
