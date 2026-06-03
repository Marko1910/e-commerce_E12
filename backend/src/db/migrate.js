import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "../config/db.js";

/**
 * Script de migracion: crea la tabla `products` ejecutando schema.sql.
 * Se ejecuta con `npm run migrate`.
 */
const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  try {
    const sql = await readFile(join(__dirname, "schema.sql"), "utf-8");
    await pool.query(sql);
    console.log("✅ Migracion completada: tabla 'products' lista.");
  } catch (err) {
    console.error("❌ Error en la migracion:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
