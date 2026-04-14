import { createClient } from "@supabase/supabase-js";

/** Nombre de la tabla en Supabase (ajustá si la tuya se llama distinto). */
export const PRODUCTS_TABLE = "products";

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Definí NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
    );
  }

  return createClient(url, anonKey);
}
