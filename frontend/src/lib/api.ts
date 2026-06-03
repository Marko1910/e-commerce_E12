import type { Product, ProductInput } from "./types";

/**
 * Cliente de la API de productos.
 *
 * Modulo profundo: expone metodos simples (list, get, create, update, remove)
 * y oculta detalles de fetch, parseo de JSON y normalizacion de errores.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

/** Error de API con mensaje legible (incluye detalles de validacion si los hay). */
export class ApiError extends Error {
  status: number;
  details?: { field: string; message: string }[];

  constructor(
    status: number,
    message: string,
    details?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      0,
      "No se pudo conectar con el servidor. Verifica que el backend este activo."
    );
  }

  // 204 sin cuerpo
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = body?.error;
    throw new ApiError(
      res.status,
      err?.message || "Error en la peticion",
      err?.details
    );
  }

  return body as T;
}

export const productsApi = {
  async list(): Promise<Product[]> {
    const body = await request<{ count: number; data: Product[] }>(
      "/api/products"
    );
    return body.data;
  },

  async get(id: number): Promise<Product> {
    const body = await request<{ data: Product }>(`/api/products/${id}`);
    return body.data;
  },

  async create(input: ProductInput): Promise<Product> {
    const body = await request<{ data: Product }>("/api/products", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return body.data;
  },

  async update(id: number, input: Partial<ProductInput>): Promise<Product> {
    const body = await request<{ data: Product }>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return body.data;
  },

  async remove(id: number): Promise<void> {
    await request<{ message: string }>(`/api/products/${id}`, {
      method: "DELETE",
    });
  },
};
