"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { createBrowserClient, PRODUCTS_TABLE } from "@/lib/supabase/client";
import { rowToProduct } from "@/lib/supabase/mapProduct";

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setPriceInput("");
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setListLoading(true);
      setListError(null);
      try {
        const supabase = createBrowserClient();
        const { data, error: fetchError } = await supabase
          .from(PRODUCTS_TABLE)
          .select("id, name, description, price, created_at")
          .order("created_at", { ascending: false });

        if (fetchError) {
          setListError(fetchError.message);
          return;
        }
        if (!cancelled && data) {
          setProducts(data.map((row) => rowToProduct(row)));
        }
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "No se pudo conectar con Supabase.";
        if (!cancelled) setListError(message);
      } finally {
        if (!cancelled) setListLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const price = Number.parseFloat(priceInput.replace(",", "."));

    if (!trimmedName) {
      setError("El nombre del producto es obligatorio.");
      return;
    }
    if (!trimmedDescription) {
      setError("La descripción es obligatoria.");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      setError("Ingresá un precio válido (número mayor o igual a 0).");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const supabase = createBrowserClient();
      const { data, error: insertError } = await supabase
        .from(PRODUCTS_TABLE)
        .insert({
          name: trimmedName,
          description: trimmedDescription,
          price,
        })
        .select("id, name, description, price, created_at")
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }
      if (data) {
        setProducts((prev) => [rowToProduct(data), ...prev]);
        resetForm();
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Error al guardar el producto.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 md:px-6 lg:flex-row lg:gap-10">
      <section className="w-full lg:w-1/2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Alta de producto
          </h2>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            Completá los datos y agregá el producto al listado.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="product-name"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Nombre del producto
              </label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                disabled={submitting}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="Ej: Auriculares Bluetooth"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="product-description"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Detalle o descripción
              </label>
              <textarea
                id="product-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={submitting}
                className="resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="Características, modelo, garantía…"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="product-price"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Valor o precio
              </label>
              <input
                id="product-price"
                type="text"
                inputMode="decimal"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                disabled={submitting}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
                placeholder="0,00"
              />
            </div>

            {error ? (
              <p
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-zinc-100"
            >
              {submitting ? "Guardando…" : "Agregar producto"}
            </button>
          </form>
        </div>
      </section>

      <section className="w-full lg:w-1/2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Productos dados de alta
          </h2>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {listLoading
              ? "Cargando lista…"
              : products.length === 0
                ? "Todavía no hay productos. Agregá el primero con el formulario."
                : `${products.length} producto${products.length === 1 ? "" : "s"} en la lista.`}
          </p>

          {listError ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {listError}
            </p>
          ) : listLoading ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white/60 py-12 text-center dark:border-zinc-700 dark:bg-zinc-950/60">
              <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
                Cargando productos…
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white/60 py-12 text-center dark:border-zinc-700 dark:bg-zinc-950/60">
              <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
                El listado aparecerá aquí cuando cargues productos.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {products.map((product) => (
                <li key={product.id}>
                  <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                        {product.name}
                      </h3>
                      <span className="text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                        {priceFormatter.format(product.price)}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {product.description}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
