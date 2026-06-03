"use client";

import { useCallback, useEffect, useState } from "react";
import { productsApi, ApiError } from "@/lib/api";
import type { Product, ProductInput } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario modal: false = cerrado, null = crear, Product = editar.
  const [formTarget, setFormTarget] = useState<Product | null | false>(false);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await productsApi.list());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudieron cargar los productos."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(input: ProductInput) {
    if (formTarget) {
      const updated = await productsApi.update(formTarget.id, input);
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    } else {
      const created = await productsApi.create(input);
      setProducts((prev) => [created, ...prev]);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await productsApi.remove(deleting.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleting.id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo eliminar el producto."
      );
    } finally {
      setDeleting(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            🛍️ Catalogo de productos
          </h1>
          <p className="mt-1 text-slate-500">
            {products.length} producto{products.length !== 1 && "s"} en tienda
          </p>
        </div>
        <button
          onClick={() => setFormTarget(null)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          + Nuevo producto
        </button>
      </header>

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-red-700">
          <span>{error}</span>
          <button
            onClick={load}
            className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : products.length === 0 && !error ? (
        <EmptyState onCreate={() => setFormTarget(null)} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(p) => setFormTarget(p)}
              onDelete={(p) => setDeleting(p)}
            />
          ))}
        </div>
      )}

      {formTarget !== false && (
        <ProductForm
          product={formTarget}
          onClose={() => setFormTarget(false)}
          onSubmit={handleSubmit}
        />
      )}

      {deleting && (
        <ConfirmDialog
          name={deleting.name}
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
        />
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
      <p className="text-lg font-medium text-slate-600">Aun no hay productos</p>
      <p className="mb-4 text-slate-400">Crea el primero para empezar.</p>
      <button
        onClick={onCreate}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
      >
        + Nuevo producto
      </button>
    </div>
  );
}

function ConfirmDialog({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-800">Eliminar producto</h3>
        <p className="mt-2 text-sm text-slate-500">
          Seguro que deseas eliminar <strong>{name}</strong>? Esta accion no se
          puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
