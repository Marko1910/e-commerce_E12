import { AppError } from "./errorHandler.js";

/**
 * Middleware para rutas no encontradas. Se registra despues de todas las rutas
 * y delega en el manejador central de errores con un 404.
 */
export function notFound(req, res, next) {
  next(new AppError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}
