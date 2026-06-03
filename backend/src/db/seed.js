import { pool } from "../config/db.js";
import { createProduct } from "../services/product.service.js";

/**
 * Carga datos de ejemplo. Cada producto obtiene su imagen automaticamente
 * desde la API externa (Lorem Picsum). Se ejecuta con `npm run seed`.
 */
const sampleProducts = [
  {
    name: "Laptop Pro 15",
    description: "Portatil de 15 pulgadas, 16GB RAM, SSD 512GB.",
    price: 3499.9,
    stock: 12,
  },
  {
    name: "Auriculares Inalambricos",
    description: "Cancelacion activa de ruido y 30h de bateria.",
    price: 299.5,
    stock: 50,
  },
  {
    name: "Teclado Mecanico RGB",
    description: "Switches rojos, retroiluminacion RGB personalizable.",
    price: 189.0,
    stock: 30,
  },
  {
    name: "Mouse Ergonomico",
    description: "Sensor de 16000 DPI, diseno ergonomico.",
    price: 129.99,
    stock: 40,
  },
  {
    name: "Monitor 27 4K",
    description: "Panel IPS 4K UHD con 99% sRGB.",
    price: 1299.0,
    stock: 8,
  },
];

async function seed() {
  try {
    console.log("Sembrando productos de ejemplo...");
    for (const product of sampleProducts) {
      const created = await createProduct(product);
      console.log(`  ✓ ${created.name} (id ${created.id})`);
    }
    console.log("✅ Seed completado.");
  } catch (err) {
    console.error("❌ Error en el seed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
