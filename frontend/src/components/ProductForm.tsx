"use client";

import { useEffect, useState } from "react";
import type { Product, ProductInput } from "@/lib/types";
import { ApiError } from "@/lib/api";

interface Props {
  /** Producto a editar; si es null, el formulario crea uno nuevo. */
  product: Product | null;
  onClose: () => void;
  onSubmit: (input: ProductInput) => Promise<void>;
}

type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  image_url: "",
};

export function ProductForm({ product, onClose, onSubmit }: Props) {
  const isEdit = product !== null;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description ?? "",
        price: String(product.price),
        stock: String(product.stock),
        image_url: product.image_url ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const input: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      ...(form.image_url.trim() ? { image_url: form.image_url.trim() } : {}),
    };

    try {
      await onSubmit(input);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) {
          const map: Record<string, string> = {};
          for (const d of err.details) map[d.field] = d.message;
          setFieldErrors(map);
        }
      } else {
        setError("Ocurrio un error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {!isEdit && (
          <p className="mb-4 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
            Si dejas la URL de imagen vacia, se asignara automaticamente desde
            la API externa (Lorem Picsum).
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Nombre"
            error={fieldErrors.name}
            input={
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input"
                placeholder="Ej. Auriculares inalambricos"
              />
            }
          />

          <Field
            label="Descripcion"
            error={fieldErrors.description}
            input={
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="input min-h-20 resize-y"
                placeholder="Detalles del producto"
              />
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Precio (S/)"
              error={fieldErrors.price}
              input={
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className="input"
                  placeholder="0.00"
                />
              }
            />
            <Field
              label="Stock"
              error={fieldErrors.stock}
              input={
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                  className="input"
                  placeholder="0"
                />
              }
            />
          </div>

          <Field
            label="URL de imagen (opcional)"
            error={fieldErrors.image_url}
            input={
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => update("image_url", e.target.value)}
                className="input"
                placeholder="https://..."
              />
            }
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {input}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
