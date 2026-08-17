import { MapPin, Ruler, Maximize2, ThermometerSun, Zap, Check, X, ChevronDown } from "lucide-react";
import { useCotizadorStore } from "../store/useCotizadorStore";
import { ZONAS_CLIMATICAS } from "../data/zonas";
import { getCapacidadesDisponibles } from "../data/equipos";
import { formatearBTU } from "../utils/calculos";
import type { ZonaId } from "../types/catalogo";

export default function CalculadoraBTU() {
  const zonaId = useCotizadorStore((s) => s.zonaId);
  const largoM = useCotizadorStore((s) => s.largoM);
  const anchoM = useCotizadorStore((s) => s.anchoM);
  const capacidadSeleccionadaBTU = useCotizadorStore(
    (s) => s.capacidadSeleccionadaBTU,
  );
  const setZonaId = useCotizadorStore((s) => s.setZonaId);
  const setLargo = useCotizadorStore((s) => s.setLargo);
  const setAncho = useCotizadorStore((s) => s.setAncho);
  const setCapacidadSeleccionadaBTU = useCotizadorStore(
    (s) => s.setCapacidadSeleccionadaBTU,
  );
  const getArea = useCotizadorStore((s) => s.getArea);
  const getBTUVisual = useCotizadorStore((s) => s.getBTUVisual);
  const getBTUZona = useCotizadorStore((s) => s.getBTUZona);
  const getCargaZonaActual = useCotizadorStore((s) => s.getCargaZonaActual);
  const getCapacidadRecomendada = useCotizadorStore(
    (s) => s.getCapacidadRecomendada,
  );

  const area = getArea();
  const btuVisual = getBTUVisual();
  const btuZona = getBTUZona();
  const cargaZona = getCargaZonaActual();
  const capacidadRecomendada = getCapacidadRecomendada();
  const capacidades = getCapacidadesDisponibles();
  const zonaActiva = ZONAS_CLIMATICAS.find((z) => z.id === zonaId) ?? ZONAS_CLIMATICAS[0];

  const estadoCobertura =
    capacidadSeleccionadaBTU >= btuVisual && btuVisual > 0
      ? "ok"
      : btuVisual === 0
        ? "idle"
        : "falta";

  return (
    <section className="relative w-full h-full">
      <div className="mb-2.5 md:mb-3">
        <div className="inline-flex items-center gap-1.5 bg-mirage-red/10 text-mirage-red border border-mirage-red/20 rounded-full mb-1 text-[10px] py-0.5 px-2 font-bold">
          <ThermometerSun className="w-3 h-3" />
          1 · Calcula tu necesidad
        </div>
        <h2 className="text-xl md:text-2xl font-black text-mirage-black tracking-tight leading-tight mt-0">
          Calcula los <span className="text-mirage-red">BTUs</span> que necesitas
        </h2>
        <p className="text-xs md:text-sm text-gray-600 mt-0.5">
          Elige tu zona geográfica y las dimensiones de tu espacio.
        </p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-soft border border-gray-100 p-2.5 md:p-3.5">
        <div className="grid grid-cols-12 gap-2.5 md:gap-3">
          <div className="col-span-12 md:col-span-5 space-y-2.5 md:space-y-3">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-mirage-red" />
                Zona Geográfica
              </label>
              <div className="relative">
                <select
                  value={zonaId}
                  onChange={(e) => setZonaId(Number(e.target.value) as ZonaId)}
                  className="w-full appearance-none bg-white border border-gray-200 hover:border-mirage-red/40 focus:outline-none focus:ring-2 focus:ring-mirage-red/30 focus:border-mirage-red rounded-xl md:rounded-2xl px-3 py-2.5 pr-10 text-[12px] md:text-sm font-semibold text-gray-900 transition-all cursor-pointer shadow-sm"
                >
                  {ZONAS_CLIMATICAS.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nombre} — {z.referencia} · {z.cargaBTUxM2} BTU/m²
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 16, height: 16 }} />
              </div>
              <div className="mt-1.5 px-2.5 py-1.5 rounded-lg md:rounded-xl bg-mirage-red/5 border border-mirage-red/15">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-mirage-red/80">
                    Carga de zona
                  </div>
                  <div className="text-xs font-black text-mirage-red tabular-nums">
                    {zonaActiva.cargaBTUxM2} BTU/m²
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-mirage-red" />
                Capacidad para comparar
              </label>
              <div className="flex flex-wrap gap-1.5">
                {capacidades.map((c) => {
                  const active = c === capacidadSeleccionadaBTU;
                  const recomendado = c === capacidadRecomendada;
                  return (
                    <button
                      key={c}
                      onClick={() => setCapacidadSeleccionadaBTU(c)}
                      className={
                        "relative px-2.5 py-1.5 rounded-lg md:rounded-xl text-[11px] font-bold transition-all duration-150 border " +
                        (active
                          ? c >= btuVisual
                            ? "bg-[#bbf7d0] text-[#166534] border-[#86efac] shadow-sm"
                            : "bg-mirage-red text-white border-mirage-red shadow-sm"
                          : recomendado
                            ? "bg-mirage-red/5 border-mirage-red/60 text-mirage-red hover:bg-mirage-red/10"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100")
                      }
                    >
                      {formatearBTU(c)}
                      {recomendado && !active && (
                        <span className="absolute -top-1.5 -right-1.5 text-[8px] px-1 py-0 rounded-full bg-mirage-red text-white font-bold">
                          S
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 mb-1.5">
              <Ruler className="w-3.5 h-3.5 text-mirage-red" />
              Dimensiones (metros cuadrados)
            </label>
            <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50/60 via-white to-gray-50/80 border border-blue-100/50 p-2.5 md:p-3.5 shadow-[0_10px_30px_-24px_rgba(30,64,175,0.4)]">
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-2 md:mb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Largo
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={largoM || ""}
                    onChange={(e) => setLargo(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-500 rounded-xl md:rounded-2xl px-3 py-2.5 md:px-4 md:py-3 text-base md:text-lg font-black text-gray-900 bg-white transition-all tabular-nums shadow-sm placeholder:font-normal placeholder:text-xs"
                    placeholder="Ej. 5"
                  />
                  <div className="text-[10px] font-semibold text-gray-400 mt-0.5 ml-1">
                    metros
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Ancho
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={anchoM || ""}
                    onChange={(e) => setAncho(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-500 rounded-xl md:rounded-2xl px-3 py-2.5 md:px-4 md:py-3 text-base md:text-lg font-black text-gray-900 bg-white transition-all tabular-nums shadow-sm placeholder:font-normal placeholder:text-xs"
                    placeholder="Ej. 4"
                  />
                  <div className="text-[10px] font-semibold text-gray-400 mt-0.5 ml-1">
                    metros
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2 md:p-3 rounded-lg md:rounded-xl bg-white border border-blue-100/50">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-[0_10px_22px_-14px_rgba(30,64,175,0.7)]">
                  <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500">
                    Área del espacio
                  </div>
                  <div className="flex items-baseline gap-1 md:gap-1.5">
                    <div className="text-xl md:text-2xl font-black tabular-nums tracking-tight text-gray-900 leading-none">
                      {area.toFixed(1)}
                    </div>
                    <div className="text-xs md:text-sm font-bold text-blue-600">
                      m²
                    </div>
                  </div>
                </div>
                <div className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-md md:rounded-lg bg-gray-100 text-gray-500 text-[10px] md:text-[11px] font-bold shrink-0">
                  <span className="tabular-nums">{largoM || 0}</span>
                  <span>×</span>
                  <span className="tabular-nums">{anchoM || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2.5 md:mt-3.5 space-y-2 md:space-y-2.5">
          <div className="rounded-xl md:rounded-2xl p-2.5 md:p-3.5 bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#0b1120] text-white border border-white/5 relative overflow-hidden shadow-[0_10px_30px_-20px_rgba(0,0,0,0.7)]">
            <div
              className="absolute -right-8 -top-8 w-28 h-28 md:w-32 md:h-32 rounded-full opacity-25 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #FF0004, transparent 70%)",
              }}
            />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 items-center">
              <div>
                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-semibold uppercase tracking-widest">
                  <Maximize2 className="w-3 h-3" />
                  Área calculada
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <div className="text-xl md:text-2xl font-black tracking-tight text-white tabular-nums leading-none">
                    {area.toFixed(1)}
                  </div>
                  <div className="text-[10px] font-semibold text-gray-400">m²</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                  Base 1k BTU/m²
                </div>
                <div className="text-base md:text-lg font-extrabold text-white tabular-nums leading-none">
                  {btuVisual.toLocaleString()}{" "}
                  <span className="text-[10px] font-semibold text-gray-400">
                    BTU
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                  Ajuste Zona ({cargaZona})
                </div>
                <div className="text-base md:text-lg font-extrabold text-mirage-red tabular-nums leading-none">
                  {btuZona.toLocaleString()}{" "}
                  <span className="text-[10px] font-semibold text-gray-400">
                    BTU
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              "rounded-xl md:rounded-2xl p-2 md:p-3 border-l-4 shadow-soft " +
              (estadoCobertura === "ok"
                ? "border-l-[#86efac] bg-[#f0fdf4]"
                : estadoCobertura === "falta"
                  ? "border-l-[#fca5a5] bg-[#fef2f2]"
                  : "border-l-gray-300 bg-gray-50")
            }
          >
            <div className="flex items-start gap-2 md:gap-2.5">
              <div
                className={
                  "w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 " +
                  (estadoCobertura === "ok"
                    ? "bg-[#86efac] text-[#166534]"
                    : estadoCobertura === "falta"
                      ? "bg-mirage-red text-white"
                      : "bg-gray-400 text-white")
                }
              >
                {estadoCobertura === "ok" ? (
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                ) : estadoCobertura === "falta" ? (
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                ) : (
                  <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] md:text-xs font-bold text-gray-900 leading-tight">
                  Seleccionada:{" "}
                  <span className="text-mirage-red">
                    {capacidadSeleccionadaBTU.toLocaleString()} BTU
                  </span>
                </div>
                {estadoCobertura === "idle" ? (
                  <div className="text-[10px] md:text-[11px] text-gray-500 mt-0.5 font-medium">
                    Ingresa dimensiones para comparar.
                  </div>
                ) : estadoCobertura === "ok" ? (
                  <div className="text-[10px] md:text-[11px] text-[#166534] mt-0.5 font-semibold leading-snug">
                    ✓ Cubre {btuVisual.toLocaleString()} BTU con reserva.
                  </div>
                ) : (
                  <div className="text-[10px] md:text-[11px] text-[#991b1b] mt-0.5 font-semibold leading-snug">
                    ✗ Faltan {(btuVisual - capacidadSeleccionadaBTU).toLocaleString()} BTU.
                  </div>
                )}
                {capacidadRecomendada &&
                  estadoCobertura !== "ok" &&
                  btuVisual > 0 && (
                    <div className="text-[10px] md:text-[11px] text-gray-600 mt-0.5 font-medium">
                      💡 Mínimo sugerido:{" "}
                      {capacidadRecomendada.toLocaleString()} BTU.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
