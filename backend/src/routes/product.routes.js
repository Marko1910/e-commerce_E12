import { Router } from "express";
import * as controller from "../controllers/product.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  idParamSchema,
} from "../validators/product.schema.js";

const router = Router();

// GET /api/products - listar todos
router.get("/", controller.list);

// GET /api/products/:id - obtener por id
router.get("/:id", validate(idParamSchema, "params"), controller.getById);

// POST /api/products - crear (imagen automatica via API externa)
router.post("/", validate(createProductSchema), controller.create);

// PUT /api/products/:id - actualizar
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateProductSchema),
  controller.update
);

// DELETE /api/products/:id - eliminar
router.delete("/:id", validate(idParamSchema, "params"), controller.remove);

export default router;
