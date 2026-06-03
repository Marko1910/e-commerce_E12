import Joi from "joi";

/**
 * Esquemas Joi para validar la entrada de los endpoints de productos.
 */

// Validacion del parametro :id de la ruta.
export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "El id debe ser un numero",
    "number.integer": "El id debe ser un entero",
    "number.positive": "El id debe ser positivo",
    "any.required": "El id es obligatorio",
  }),
});

// Validacion para crear un producto (POST).
// image_url es opcional: si no se envia, el backend la obtiene de la API externa.
export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre es obligatorio",
  }),
  description: Joi.string().trim().allow("").max(2000).default(""),
  price: Joi.number().precision(2).min(0).required().messages({
    "number.base": "El precio debe ser un numero",
    "number.min": "El precio no puede ser negativo",
    "any.required": "El precio es obligatorio",
  }),
  stock: Joi.number().integer().min(0).default(0).messages({
    "number.base": "El stock debe ser un numero entero",
    "number.min": "El stock no puede ser negativo",
  }),
  image_url: Joi.string().uri().allow("", null).optional().messages({
    "string.uri": "image_url debe ser una URL valida",
  }),
});

// Validacion para actualizar (PUT). Todos los campos opcionales, pero al menos uno.
export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150),
  description: Joi.string().trim().allow("").max(2000),
  price: Joi.number().precision(2).min(0),
  stock: Joi.number().integer().min(0),
  image_url: Joi.string().uri().allow("", null),
})
  .min(1)
  .messages({
    "object.min": "Debe enviar al menos un campo para actualizar",
  });
