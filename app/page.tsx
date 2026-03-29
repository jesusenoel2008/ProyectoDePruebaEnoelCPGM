import { ProductCatalog } from "@/components/ProductCatalog";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-100 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white/80 px-4 py-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Gestión de productos
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Formulario de alta a la izquierda; listado actual a la derecha.
          </p>
        </div>
      </header>
      <ProductCatalog />
      <footer className="border-t border-zinc-200 bg-white/80 px-4 py-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 md:px-6">
        <div className="mx-auto max-w-6xl py-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sepulveda Olvera Jesus Enoel 6CPGM
          </p>
        </div>
      </footer>
    </div>
    
  );
}
