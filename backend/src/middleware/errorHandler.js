/**
 * Error de aplicacion con codigo HTTP asociado.
 * Permite a los servicios lanzar errores semanticos (404, 409, etc.)
 * que el manejador central traduce a respuestas HTTP.
 */
export class AppError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Manejador de errores centralizado (debe registrarse al final de la cadena
 * de middlewares). Convierte cualquier error en una respuesta JSON consistente.
 */
// eslint-disable-next-line no-unused-vars -- Express identifica el handler de error por sus 4 parametros.
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    error: {
      message: err.message || "Error interno del servidor",
      ...(err.details ? { details: err.details } : {}),
      status: statusCode,
    },
  });
}
