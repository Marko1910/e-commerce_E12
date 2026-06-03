/** Modelo de producto tal como lo devuelve la API. */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Campos editables al crear o actualizar un producto. */
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
}
