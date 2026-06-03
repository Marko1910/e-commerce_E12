import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import productRoutes from "./routes/product.routes.js";

/**
 * Construye y configura la aplicacion Express.
 * Separado de server.js para poder testear sin levantar el puerto.
 */
export function createApp() {
  const app = express();

  // --- Middlewares globales ---
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger); // logging de cada request (requisito)

  // --- Healthcheck ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Raiz informativa
  app.get("/", (req, res) => {
    res.json({
      name: "Ecommerce API",
      version: "1.0.0",
      endpoints: [
        "GET    /api/health",
        "GET    /api/products",
        "GET    /api/products/:id",
        "POST   /api/products",
        "PUT    /api/products/:id",
        "DELETE /api/products/:id",
      ],
    });
  });

  // --- Rutas de negocio ---
  app.use("/api/products", productRoutes);

  // --- 404 y manejo central de errores (siempre al final) ---
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
