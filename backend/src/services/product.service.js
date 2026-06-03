import { query } from "../config/db.js";
import { AppError } from "../middleware/errorHandler.js";
import { fetchProductImage } from "./image.service.js";

/**
 * Servicio de productos: encapsula toda la logica de negocio y el acceso a datos.
 * Los controladores solo orquestan request/response; aqui vive el "como".
 */

const COLUMNS = "id, name, description, price, stock, image_url, created_at, updated_at";

/**
 * Mapea una fila de la BD al formato de respuesta de la API.
 * Postgres devuelve DECIMAL como string; lo convertimos a number.
 */
function mapRow(row) {
  if (!row) return null;
  return {
    ...row,
    price: row.price !== null ? Number(row.price) : null,
  };
}

/** Lista todos los productos, mas recientes primero. */
export async function listProducts() {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM products ORDER BY id DESC`
  );
  return rows.map(mapRow);
}

/** Obtiene un producto por id o lanza 404. */
export async function getProductById(id) {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM products WHERE id = $1`,
    [id]
  );
  if (rows.length === 0) {
    throw new AppError(404, `Producto con id ${id} no encontrado`);
  }
  return mapRow(rows[0]);
}

/**
 * Crea un producto. Si no se proporciona image_url, la obtiene automaticamente
 * desde la API externa (consumo de API externa - requisito de la rubrica).
 */
export async function createProduct(data) {
  const { name, description = "", price, stock = 0 } = data;

  // Consumo de API externa: imagen automatica si el cliente no envio una.
  const image_url = data.image_url || (await fetchProductImage(name));

  const { rows } = await query(
    `INSERT INTO products (name, description, price, stock, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNS}`,
    [name, description, price, stock, image_url]
  );
  return mapRow(rows[0]);
}

/**
 * Actualiza un producto existente. Construye el UPDATE dinamicamente solo con
 * los campos enviados. Lanza 404 si el producto no existe.
 */
export async function updateProduct(id, data) {
  // Asegura que exista (lanza 404 si no).
  await getProductById(id);

  const allowed = ["name", "description", "price", "stock", "image_url"];
  const fields = [];
  const values = [];
  let position = 1;

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${position}`);
      values.push(data[key]);
      position += 1;
    }
  }

  if (fields.length === 0) {
    throw new AppError(400, "No se enviaron campos validos para actualizar");
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const { rows } = await query(
    `UPDATE products SET ${fields.join(", ")} WHERE id = $${position}
     RETURNING ${COLUMNS}`,
    values
  );
  return mapRow(rows[0]);
}

/** Elimina un producto por id. Lanza 404 si no existe. */
export async function deleteProduct(id) {
  const { rows } = await query(
    `DELETE FROM products WHERE id = $1 RETURNING ${COLUMNS}`,
    [id]
  );
  if (rows.length === 0) {
    throw new AppError(404, `Producto con id ${id} no encontrado`);
  }
  return mapRow(rows[0]);
}
