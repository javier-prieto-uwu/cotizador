import { useMemo } from "react";
import { Grid3x3, Layers } from "lucide-react";
import { useCotizadorStore } from "../store/useCotizadorStore";
import { construirGridCeldas, formatearBTU } from "../utils/calculos";
import type { TipoCelda } from "../utils/calculos";
import { CELDA_BTUS } from "../data/zonas";

const paletaCelda: Record<
  TipoCelda,
  { bg: string; border: string; text: string; label: string }
> = {
  blue: {
    bg: "bg-[#bfdbfe]",
    border: "border-[#93c5fd]",
    text: "text-[#1e40af]",
    label: "Cubierto",
  },
  green: {
    bg: "bg-[#bbf7d0]",
    border: "border-[#86efac]",
    text: "text-[#166534]",
    label: "Reserva",
  },
  red: {
    bg: "bg-[#fecaca]",
    border: "border-[#fca5a5]",
    text: "text-[#991b1b]",
    label: "Faltante",
  },
  empty: {
    bg: "bg-[#f3f4f6]",
    border: "border-[#e5e7eb]",
    text: "text-[#9ca3af]",
    label: "Sin uso",
  },
};

export default function SimuladorCobertura() {
  const getBTUVisual = useCotizadorStore((s) => s.getBTUVisual);
  const capacidadSeleccionadaBTU = useCotizadorStore(
    (s) => s.capacidadSeleccionadaBTU,
  );

  const btuRequeridos = getBTUVisual();
  const btuEquipo = capacidadSeleccionadaBTU;

  const celdas = useMemo(
    () =>
      construirGridCeldas({
        btuRequeridos,
        btuEquipoSeleccionado: btuEquipo,
      }),
    [btuRequeridos, btuEquipo],
  );

  const totalCeldas = celdas.length;
  const cols = Math.max(1, Math.ceil(Math.sqrt(Math.max(totalCeldas, 1))));

  const tamCelda = (() => {
    if (cols >= 10) return 20;
    if (cols >= 8) return 24;
    if (cols >= 6) return 30;
    if (cols >= 4) return 36;
    return 46;
  })();
  const mostrarNumero = tamCelda >= 28;
  const tamFuente = tamCelda >= 36 ? 12 : tamCelda >= 30 ? 10 : tamCelda >= 24 ? 9 : 8;

  const celdasPadded = useMemo(() => {
    if (totalCeldas === 0) return [] as (typeof celdas[number] | null)[];
    const filas = Math.ceil(totalCeldas / cols);
    const totalGrid = filas * cols;
    const padded: (typeof celdas[number] | null)[] = [...celdas];
    while (padded.length < totalGrid) padded.push(null);
    return padded;
  }, [celdas, cols, totalCeldas]);

  const resumen = useMemo(() => {
    const counts = { blue: 0, green: 0, red: 0, empty: 0 } as Record<
      TipoCelda,
      number
    >;
    for (const c of celdas) counts[c.tipo]++;
    return counts;
  }, [celdas]);

  const diferencia = btuEquipo - btuRequeridos;

  return (
    <section className="relative w-full h-full">
      <div className="mb-2.5 md:mb-3">
        <div className="inline-flex items-center gap-1.5 bg-white border border-blue-500/30 text-blue-700 rounded-full mb-1 text-[10px] py-0.5 px-2 font-bold">
          <Layers className="w-3 h-3" />
          2 · Visualizador
        </div>
        <h2 className="text-xl md:text-2xl font-black text-mirage-black tracking-tight leading-tight mt-0">
          Simulador <span className="text-mirage-red">Gráfico</span>
        </h2>
        <p className="text-xs md:text-sm text-gray-600 mt-0.5">
          Cada celda = {CELDA_BTUS.toLocaleString()} BTUs.
        </p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-soft border border-gray-100 p-2.5 md:p-3.5">
        <div className="grid grid-cols-4 gap-1.5 mb-2.5 md:mb-3">
          {(["blue", "green", "red", "empty"] as TipoCelda[]).map((k) => (
            <div
              key={k}
              className="flex items-center gap-1.5 p-2 rounded-lg md:rounded-xl bg-gray-50/70 border border-gray-100"
            >
              <div
                className={
                  "w-3 h-3 rounded-sm border " +
                  paletaCelda[k].bg +
                  " " +
                  paletaCelda[k].border
                }
              />
              <div className="min-w-0 flex-1 leading-tight">
                <div
                  className={
                    "text-[10px] font-bold truncate " + paletaCelda[k].text
                  }
                >
                  {paletaCelda[k].label}
                </div>
                <div className="text-[10px] font-semibold text-gray-500 leading-none mt-0.5">
                  {resumen[k]}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2.5 md:gap-3 items-start">
          <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-xl md:rounded-2xl border border-gray-100 p-2 md:p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-gray-800 text-[11px] font-bold">
                <Grid3x3 className="w-3.5 h-3.5 text-mirage-red" />
                Cuadrícula BTU
              </div>
              <div className="text-[10px] font-semibold text-gray-500">
                1 celda = {formatearBTU(CELDA_BTUS)} BTU
              </div>
            </div>

            {celdas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center text-gray-400 bg-gray-50/60 rounded-lg">
                <Grid3x3 className="w-5 h-5 mb-0.5 opacity-40" />
                <div className="text-[10px] font-semibold text-gray-500">
                  Ingresa dimensiones
                </div>
              </div>
            ) : (
              <div
                className="inline-grid gap-[2px] md:gap-[3px] animate-fade-in mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${cols}, ${tamCelda}px)`,
                }}
              >
                {celdasPadded.map((celda, i) => {
                  if (!celda) {
                    return (
                      <div
                        key={"pad-" + i}
                        className="rounded-sm opacity-0 pointer-events-none"
                        style={{ width: tamCelda, height: tamCelda }}
                      />
                    );
                  }
                  const p = paletaCelda[celda.tipo];
                  return (
                    <div
                      key={i}
                      className={
                        "group relative rounded-sm md:rounded border transition-all duration-150 hover:scale-[1.2] hover:z-10 hover:shadow-md " +
                        p.bg +
                        " " +
                        p.border
                      }
                      style={{ width: tamCelda, height: tamCelda }}
                      title={`Rango ${i * CELDA_BTUS} - ${(i + 1) * CELDA_BTUS} BTU · ${p.label}`}
                    >
                      {mostrarNumero && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={
                              "font-black tracking-tight opacity-90 tabular-nums leading-none " +
                              p.text
                            }
                            style={{ fontSize: tamFuente }}
                          >
                            {i + 1}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2 md:space-y-2.5">
            <div className="rounded-xl md:rounded-2xl bg-gray-50/60 border border-gray-100 p-2 md:p-3">
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-2">
                MÉTRICAS
              </div>
              <div className="space-y-2">
                <div className="rounded-lg md:rounded-xl bg-white border border-gray-100 p-2 md:p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                      Requerimiento
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base md:text-lg font-black text-gray-900 tabular-nums tracking-tight leading-none">
                        {btuRequeridos.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500">
                        BTU
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg md:rounded-xl bg-white border border-mirage-red/20 p-2 md:p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                      Capacidad
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base md:text-lg font-black text-mirage-red tabular-nums tracking-tight leading-none">
                        {btuEquipo.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500">
                        BTU
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "rounded-lg md:rounded-xl bg-white border p-2 md:p-3 " +
                    (diferencia >= 0 ? "border-[#86efac]" : "border-[#fca5a5]")
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                      Diferencia
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span
                        className={
                          "text-base md:text-lg font-black tabular-nums tracking-tight leading-none " +
                          (diferencia >= 0 ? "text-[#166534]" : "text-[#991b1b]")
                        }
                      >
                        {diferencia >= 0 ? "+" : ""}
                        {diferencia.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500">
                        BTU
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
