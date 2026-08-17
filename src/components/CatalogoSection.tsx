import { useState } from "react";
import { BookOpen, FlameKindling, Sparkles } from "lucide-react";
import { getSeriesPorLinea } from "../data/equipos";
import SerieCard from "./SerieCard";
import { useCotizadorStore } from "@/store/useCotizadorStore";
import type { LineaEquipo } from "../types/catalogo";

export default function CatalogoSection() {
  const [tabActiva, setTabActiva] = useState<LineaEquipo>("Inverter");
  const compararLista = useCotizadorStore((s) => s.compararLista);

  const series = getSeriesPorLinea(tabActiva);
  const otras = getSeriesPorLinea(
    tabActiva === "Inverter" ? "Convencional" : "Inverter",
  );

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container">
        <div className="mb-5 md:mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 text-mirage-red text-[11px] md:text-xs font-bold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              3 · Cat&aacute;logo de equipos
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 text-[10px] md:text-[11px] font-semibold text-gray-600 border border-gray-200">
              <span className="w-4 h-4 rounded-sm bg-gray-900 text-white text-[9px] font-bold flex items-center justify-center">
                {compararLista[0] ? "A" : "-"}
              </span>
              <span className="text-gray-400 font-bold">/</span>
              <span className="w-4 h-4 rounded-sm bg-mirage-red text-white text-[9px] font-bold flex items-center justify-center">
                {compararLista[1] ? "B" : "-"}
              </span>
              <span className="ml-1">
                {compararLista.length}/2 VS
              </span>
            </div>
          </div>
          <h2 className="text-lg md:text-2xl xl:text-[28px] font-bold text-gray-900 tracking-tight leading-tight">
            Equipos <span className="text-mirage-red font-black">Mirage</span>
          </h2>
          <p className="text-[12px] md:text-[13px] text-gray-500 mt-1 max-w-3xl font-medium">
            Series convencionales e inverter · Toca <span className="font-semibold text-gray-700">VS</span> en cualquier ficha para agregar la capacidad al comparador energ&eacute;tico.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-5">
          <div className="inline-flex p-1 rounded-lg bg-gray-100 w-fit">
            <button
              onClick={() => setTabActiva("Inverter")}
              className={
                "flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12px] md:text-sm font-semibold transition-all duration-150 " +
                (tabActiva === "Inverter"
                  ? "bg-white text-mirage-red shadow-sm"
                  : "text-gray-600 hover:text-gray-900")
              }
            >
              <Sparkles className="w-4 h-4" strokeWidth={2} />
              Inverter
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-200 text-gray-600 font-semibold">
                {getSeriesPorLinea("Inverter").length}
              </span>
            </button>
            <button
              onClick={() => setTabActiva("Convencional")}
              className={
                "flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12px] md:text-sm font-semibold transition-all duration-150 " +
                (tabActiva === "Convencional"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900")
              }
            >
              <FlameKindling className="w-4 h-4" strokeWidth={2} />
              Convencional
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-200 text-gray-600 font-semibold">
                {getSeriesPorLinea("Convencional").length}
              </span>
            </button>
          </div>
          <div className="text-[11px] md:text-[12px] text-gray-500 font-medium max-w-md">
            Selecciona una capacidad para proyectar su cobertura en el simulador.
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {series.map((serie) => (
            <SerieCard key={serie.id} serie={serie} />
          ))}
        </div>

        {otras.length > 0 && (
          <div className="mt-6 md:mt-8 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <h3 className="text-[13px] md:text-sm font-semibold text-gray-800">
                También te puede interesar ·{" "}
                <span className="text-gray-500 font-medium">
                  Línea {tabActiva === "Inverter" ? "Convencional" : "Inverter"}
                </span>
              </h3>
              <div className="h-px bg-gray-100 flex-1" />
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {otras.map((serie) => (
                <SerieCard key={serie.id} serie={serie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
