import { AppError } from "./errorHandler.js";

/**
 * Crea un middleware que valida una parte del request (body, params o query)
 * contra un esquema Joi. Si falla, lanza un AppError 400 con el detalle de
 * todos los campos invalidos.
 *
 * Uso: router.post("/", validate(createProductSchema), controller.create)
 */
export function validate(schema, property = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // reporta todos los errores, no solo el primero
      stripUnknown: true, // elimina campos no declarados en el esquema
      convert: true, // convierte tipos cuando es seguro (ej. "10" -> 10)
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return next(new AppError(400, "Datos de entrada invalidos", details));
    }

    // Reemplaza con el valor saneado/convertido.
    req[property] = value;
    next();
  };
}
