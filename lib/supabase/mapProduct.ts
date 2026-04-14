import type { Product, ProductRow } from "@/types/product";

function parsePrice(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = Number.parseFloat(value);
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

/** Convierte una fila de Supabase al tipo que usa la UI (sin `created_at`). */
export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: parsePrice(row.price),
  };
}
