import * as productService from "../services/product.service.js";

/**
 * Controladores de productos.
 * Capa delgada: traduce HTTP <-> servicio. Sin logica de negocio.
 * Los errores se propagan a next() para el manejador central.
 */

export async function list(req, res, next) {
  try {
    const products = await productService.listProducts();
    res.json({ count: products.length, data: products });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.json({ message: "Producto eliminado", data: product });
  } catch (err) {
    next(err);
  }
}
