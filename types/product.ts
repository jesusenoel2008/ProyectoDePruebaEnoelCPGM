export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

/** Fila tal como viene de Supabase (incluye `created_at`, no se muestra en la UI). */
export type ProductRow = {
  id: string;
  name: string;
  description: string;
  /** PostgREST puede devolver `numeric` como string. */
  price: number | string;
  created_at: string;
};
