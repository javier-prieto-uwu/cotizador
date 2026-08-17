import { Check, Zap, Sparkles, Star, CheckCircle2, ArrowRightLeft } from "lucide-react";
import type { SerieEquipo, VarianteEquipo, Voltaje } from "@/types/catalogo";
import VarianteSelector from "./VarianteSelector";
import FichaTecnica from "./FichaTecnica";
import { useCotizadorStore } from "@/store/useCotizadorStore";
import { formatearBTU } from "@/utils/calculos";

interface Props {
  serie: SerieEquipo;
}

const getSeerNumber = (serie: SerieEquipo): number => {
  const first = serie.variantes[0];
  if (!first) return 0;
  return typeof first.seer === "number"
    ? first.seer
    : Number(String(first.seer).replace(/[^0-9.]/g, "")) || 0;
};

export default function SerieCard({ serie }: Props) {
  const capacidadSeleccionadaBTU = useCotizadorStore(
    (s) => s.capacidadSeleccionadaBTU,
  );
  const getBTUZona = useCotizadorStore((s) => s.getBTUZona);
  const varianteActivaId = useCotizadorStore(
    (s) => s.varianteActivaPorSerie[serie.id],
  );
  const toggleComparar = useCotizadorStore((s) => s.toggleComparar);
  const estaEnComparar = useCotizadorStore((s) => s.estaEnComparar);
  const compararLista = useCotizadorStore((s) => s.compararLista);

  const btuNecesarios = getBTUZona();
  const serieSeer = getSeerNumber(serie);

  const varianteActiva: VarianteEquipo =
    serie.variantes.find((v) => v.id === varianteActivaId) ??
    serie.variantes.find(
      (v) => v.btu === capacidadSeleccionadaBTU && v.voltaje === (110 as Voltaje),
    ) ??
    serie.variantes[0];

  const coberturaCubre = varianteActiva.btu >= btuNecesarios;
  const diffBTU = varianteActiva.btu - btuNecesarios;
  const seleccionada = varianteActiva.btu === capacidadSeleccionadaBTU;
  const enVS = estaEnComparar(varianteActiva.id);
  const posicionVS = compararLista.indexOf(varianteActiva.id);

  return (
    <article
      className={
        "group relative bg-white rounded-xl transition-all duration-300 hover:shadow-[0_8px_24px_-20px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 overflow-hidden border " +
        (seleccionada
          ? "border-mirage-red shadow-[0_0_0_2px_rgba(255,0,4,0.1)]"
          : "border-gray-200")
      }
    >
      <div className="bg-gray-900 text-white overflow-hidden">
        <div className="relative grid md:grid-cols-[160px_1fr] items-stretch">
          <div className="relative bg-white flex items-center justify-center p-4 md:p-5 border-b md:border-b-0 md:border-r border-white/10">
            {serie.imagenUrl ? (
              <img
                src={serie.imagenUrl}
                alt={`Equipo ${serie.nombre}`}
                className="relative w-full h-auto max-h-[150px] object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Zap className="w-10 h-10 opacity-40" />
              </div>
            )}
          </div>

          <div className="relative p-4 md:p-5 space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {serie.linea === "Inverter" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-mirage-red/90 text-white text-[11px] font-semibold">
                  <Zap className="w-3 h-3" strokeWidth={2} />
                  Inverter
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3" strokeWidth={2} />
                  Convencional
                </span>
              )}
              {coberturaCubre ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/90 text-white text-[11px] font-semibold">
                  <Check className="w-3 h-3" strokeWidth={3} />
                  Cubre
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/90 text-white text-[11px] font-semibold">
                  No cubre
                </span>
              )}
              {serieSeer >= 22 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-mirage-red/20 text-mirage-red text-[11px] font-semibold border border-mirage-red/25">
                  <Star className="w-3 h-3" strokeWidth={2} />
                  Alta ef.
                </span>
              ) : null}
            </div>

            <div>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight leading-tight text-white">
                {serie.nombre}
              </h3>
              <p className="text-[12px] md:text-[13px] font-medium text-white/70 mt-1 leading-snug">
                {serie.tagline}
              </p>
            </div>

            <ul className="space-y-0.5">
              {serie.funcionesDestacadas.slice(0, 2).map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-[11px] md:text-[12px] font-medium text-white/80"
                >
                  <CheckCircle2 className="mt-0.5 text-mirage-red shrink-0" style={{ width: 16, height: 16 }} strokeWidth={2} />
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5 space-y-3.5 md:space-y-4.5">
        <div>
          <VarianteSelector serie={serie} />
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 md:mb-3.5">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
              Ficha técnica
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-end">
              <button
                type="button"
                onClick={() => toggleComparar(varianteActiva.id)}
                className={
                  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] md:text-xs font-semibold transition-all border " +
                  (enVS
                    ? posicionVS === 0
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-mirage-red text-white border-mirage-red"
                    : "bg-white text-gray-700 border-gray-200 hover:border-mirage-red/40 hover:text-mirage-red")
                }
                title={
                  enVS
                    ? "Quitar de la comparativa VS"
                    : "Añadir a comparativa energética VS"
                }
              >
                <ArrowRightLeft className="w-3.5 h-3.5" strokeWidth={2.2} />
                {enVS ? `VS · ${posicionVS === 0 ? "A" : "B"}` : "VS"}
                {!enVS && compararLista.length >= 2 && (
                  <span className="text-[9px] ml-0.5 opacity-75">
                    (reemplaza)
                  </span>
                )}
              </button>
              {seleccionada && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-mirage-red text-white text-[11px] md:text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Seleccionado
                </div>
              )}
            </div>
          </div>

          <div
            className={
              "mb-3 md:mb-4 rounded-lg p-3 md:p-3.5 border flex items-center justify-between gap-3 " +
              (coberturaCubre
                ? "bg-emerald-50/70 border-emerald-100"
                : "bg-red-50/70 border-red-100")
            }
          >
            <div>
              <div
                className={
                  "text-[10px] uppercase tracking-wider font-semibold mb-0.5 " +
                  (coberturaCubre ? "text-emerald-700" : "text-red-700")
                }
              >
                vs Requerimiento
              </div>
              <div
                className={
                  "text-sm md:text-[15px] font-semibold " +
                  (coberturaCubre ? "text-emerald-800" : "text-red-800")
                }
              >
                {formatearBTU(varianteActiva.btu)} BTU ·{" "}
                {String(varianteActiva.voltaje)}V
              </div>
            </div>
            <div
              className={
                "text-right " +
                (coberturaCubre ? "text-emerald-700" : "text-red-700")
              }
            >
              <div className="text-lg md:text-xl font-bold tabular-nums tracking-tight leading-none">
                {diffBTU >= 0 ? "+" : ""}
                {diffBTU.toLocaleString()}
                <span className="text-[10px] md:text-[11px] ml-0.5 font-medium"> BTU</span>
              </div>
            </div>
          </div>

          <FichaTecnica variante={varianteActiva} />
        </div>
      </div>
    </article>
  );
}
