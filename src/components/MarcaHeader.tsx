import { LOGO_MIRAGE_BLANCO_URL } from "@/data/equipos";

export default function MarcaHeader() {
  return (
    <header className="w-full bg-black text-white overflow-hidden">
      <div className="container py-2 md:py-2.5">
        <div className="flex items-center justify-center">
          <img
            src={LOGO_MIRAGE_BLANCO_URL}
            alt="Mirage logo"
            className="h-6 md:h-7.5 xl:h-8 w-auto object-contain"
            loading="eager"
          />
        </div>
      </div>
      <div className="h-px w-full bg-white/10" />
    </header>
  );
}
