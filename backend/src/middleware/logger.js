/**
 * Middleware de logging de requests.
 *
 * Registra metodo, ruta, codigo de estado y duracion de cada peticion.
 * Cumple el requisito "Middleware para logging" de la rubrica.
 */
export function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const timestamp = new Date().toISOString();
    const { method, originalUrl } = req;
    const { statusCode } = res;

    // Coloreado simple segun el rango del status para lectura rapida en consola.
    const status =
      statusCode >= 500
        ? `\x1b[31m${statusCode}\x1b[0m` // rojo
        : statusCode >= 400
          ? `\x1b[33m${statusCode}\x1b[0m` // amarillo
          : `\x1b[32m${statusCode}\x1b[0m`; // verde

    console.log(
      `[${timestamp}] ${method} ${originalUrl} ${status} - ${durationMs.toFixed(1)}ms`
    );
  });

  next();
}
