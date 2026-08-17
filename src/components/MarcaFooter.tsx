import { LOGO_MIRAGE_BLANCO_URL } from "@/data/equipos";

export default function MarcaFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-gray-300 mt-10 md:mt-12">
      <div className="h-px w-full bg-white/10" />
      <div className="container py-5 md:py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="shrink-0">
            <img
              src={LOGO_MIRAGE_BLANCO_URL}
              alt="Mirage logo"
              className="h-7 md:h-8.5 xl:h-9 w-auto object-contain"
            />
          </div>
          <div className="text-center max-w-3xl">
            <p className="text-[12px] md:text-xs text-gray-400 font-small">
              Calculadora de BTUs · Herramienta informativa. El consumo final
              puede variar según condiciones de uso, aislamiento y número de
              personas.
            </p>
          </div>
          <div className="w-full max-w-xl pt-3 border-t border-white/10 text-[11px] md:text-xs text-gray-500 text-center font-normal">
            <span>© {year} Mirage. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
