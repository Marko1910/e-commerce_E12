"use client";

import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url || "https://picsum.photos/600/400"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            outOfStock
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {outOfStock ? "Sin stock" : `Stock: ${product.stock}`}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-800">
          {product.name}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm text-slate-500">
          {product.description || "Sin descripcion"}
        </p>
        <p className="text-2xl font-bold text-indigo-600">
          {currency.format(product.price)}
        </p>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
