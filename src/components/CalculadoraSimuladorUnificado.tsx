import { useMemo, useState } from "react";
import {
  MapPin,
  Ruler,
  Maximize2,
  ThermometerSun,
  Zap,
  Check,
  X,
  ChevronDown,
  Grid3x3,
  BarChart3,
  Thermometer,
  Gauge,
  BookOpen,
} from "lucide-react";
import { useCotizadorStore } from "@/store/useCotizadorStore";
import { ZONAS_CLIMATICAS, CELDA_BTUS } from "@/data/zonas";
import { getCapacidadesDisponibles } from "@/data/equipos";
import {
  construirGridCeldas,
  formatearBTU,
} from "@/utils/calculos";
import type { TipoCelda } from "@/utils/calculos";
import type { ZonaId } from "@/types/catalogo";

const paletaCelda: Record<
  TipoCelda,
  { bg: string; border: string; text: string; label: string }
> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    label: "Cubierto",
  },
  green: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    label: "Reserva",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    label: "Faltante",
  },
  empty: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-500",
    label: "Sin uso",
  },
};

const FUENTES_IMG_URL =
  "https://i.imgur.com/U9nybzd.jpeg";

export default function CalculadoraSimuladorUnificado() {
  const [verFuentes, setVerFuentes] = useState(false);
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
  const zonaActiva =
    ZONAS_CLIMATICAS.find((z) => z.id === zonaId) ?? ZONAS_CLIMATICAS[0];
  const diferencia = capacidadSeleccionadaBTU - btuVisual;
  const btuHolgura20 = Math.round(btuVisual * 1.2);

  const estadoCobertura =
    capacidadSeleccionadaBTU >= btuVisual && btuVisual > 0
      ? "ok"
      : btuVisual === 0
        ? "idle"
        : "falta";

  const celdas = useMemo(
    () =>
      construirGridCeldas({
        btuRequeridos: btuVisual,
        btuEquipoSeleccionado: capacidadSeleccionadaBTU,
      }),
    [btuVisual, capacidadSeleccionadaBTU],
  );
  const totalCeldas = celdas.length;
  const cols = Math.max(1, Math.ceil(Math.sqrt(Math.max(totalCeldas, 1))));
  const tamCelda = (() => {
    if (cols >= 12) return 22;
    if (cols >= 9) return 26;
    if (cols >= 7) return 30;
    if (cols >= 5) return 36;
    if (cols >= 3) return 44;
    return 52;
  })();
  const mostrarNumero = tamCelda >= 28;
  const tamFuente =
    tamCelda >= 44
      ? 13
      : tamCelda >= 36
        ? 12
        : tamCelda >= 30
          ? 11
          : tamCelda >= 26
            ? 10
            : 9;
  const celdasPadded = useMemo(() => {
    if (totalCeldas === 0)
      return [] as (typeof celdas[number] | null)[];
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

  return (
    <section className="relative w-full">
      <div className="mb-5 md:mb-6">
        <div className="inline-flex items-center gap-1.5 text-mirage-red text-[11px] md:text-xs font-bold tracking-wider uppercase mb-1.5">
          <ThermometerSun className="w-3.5 h-3.5" />
          Calculadora BTU Minisplit
        </div>
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <h2 className="text-lg md:text-2xl xl:text-[28px] font-bold text-gray-900 tracking-tight leading-tight">
              Calcula los <span className="text-mirage-red font-black">BTUs</span> y visualiza la cobertura
            </h2>
            <p className="text-[12px] md:text-[13px] text-gray-500 mt-1 md:mt-1.5 max-w-3xl font-medium">
              Ingresa tu zona geogr&aacute;fica y las medidas. Selecciona la capacidad del equipo Mirage y compara la cobertura gr&aacute;ficamente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVerFuentes(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-[11px] md:text-xs font-semibold text-gray-600 hover:text-mirage-red hover:border-mirage-red/40 hover:bg-mirage-red/[0.03] transition-colors shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
            Ver fuentes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 md:p-6 space-y-5 md:space-y-6">
        {/* BLOQUE 1: DATOS */}
        <div>
          <div className="flex items-center gap-2.5 mb-4 md:mb-5">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-gray-900 text-white flex items-center justify-center font-bold text-[11px] md:text-xs shrink-0">
              1
            </div>
            <div className="text-[13px] md:text-sm font-bold text-gray-800 tracking-tight">
              Datos de tu espacio
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* ZONA */}
            <div className="col-span-12 md:col-span-5 space-y-3 md:space-y-3.5">
              <label className="flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-gray-700">
                <MapPin className="w-4 h-4 text-mirage-red" strokeWidth={2} />
                Zona geogr&aacute;fica
              </label>
              <div className="relative">
                <select
                  value={zonaId}
                  onChange={(e) =>
                    setZonaId(Number(e.target.value) as ZonaId)
                  }
                  className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 rounded-lg px-4 py-3 pr-12 text-[14px] md:text-sm font-medium text-gray-800 transition-all cursor-pointer"
                >
                  {ZONAS_CLIMATICAS.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nombre} · {z.referencia}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  style={{ width: 18, height: 18 }}
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-md bg-white border border-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                  <Gauge className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <div className="flex flex-col leading-tight flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Carga de enfriamiento
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-gray-900 tabular-nums leading-none">
                      {zonaActiva.cargaBTUxM2}
                    </span>
                    <span className="text-[11px] font-medium text-gray-500">
                      BTU/m²
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] leading-snug text-gray-500 font-normal px-0.5">
                Ajuste la capacidad seg&uacute;n el clima de tu regi&oacute;n para un consumo equilibrado.
              </p>
            </div>

            {/* DIMENSIONES */}
            <div className="col-span-12 md:col-span-7 space-y-3 md:space-y-3.5">
              <label className="flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-gray-700">
                <Ruler className="w-4 h-4 text-mirage-red" strokeWidth={2} />
                Medidas del cuarto
              </label>

              <div className="grid grid-cols-12 gap-3 md:gap-4 items-stretch">
                <div className="col-span-4">
                  <div className="rounded-lg bg-white border border-gray-200 p-3 md:p-4 flex flex-col h-full justify-between">
                    <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Largo
                    </div>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={largoM || ""}
                      onChange={(e) =>
                        setLargo(parseFloat(e.target.value) || 0)
                      }
                      className="w-full border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 rounded-md px-3 py-2.5 text-xl font-bold text-gray-900 bg-gray-50/60 transition-all tabular-nums placeholder:font-normal placeholder:text-sm placeholder:text-gray-400"
                      placeholder="0"
                    />
                    <div className="text-[11px] font-medium text-gray-400 mt-1.5">
                      metros
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="rounded-lg bg-white border border-gray-200 p-3 md:p-4 flex flex-col h-full justify-between">
                    <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Ancho
                    </div>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={anchoM || ""}
                      onChange={(e) =>
                        setAncho(parseFloat(e.target.value) || 0)
                      }
                      className="w-full border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 rounded-md px-3 py-2.5 text-xl font-bold text-gray-900 bg-gray-50/60 transition-all tabular-nums placeholder:font-normal placeholder:text-sm placeholder:text-gray-400"
                      placeholder="0"
                    />
                    <div className="text-[11px] font-medium text-gray-400 mt-1.5">
                      metros
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="rounded-lg bg-gray-900 border border-gray-900/90 p-3 md:p-4 flex flex-col h-full justify-between text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                        <Maximize2 className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold text-white/80">
                        &Aacute;rea total
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[26px] md:text-[30px] font-bold tabular-nums tracking-tight text-white leading-none">
                          {area.toFixed(1)}
                        </span>
                        <span className="text-sm font-semibold text-white/70">
                          m²
                        </span>
                      </div>
                      <div className="text-[10px] md:text-[11px] font-medium text-white/60 mt-0.5">
                        {area > 0
                          ? `${zonaActiva.nombre} aplica el factor`
                          : "Ingresa las medidas"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gray-100" />

        {/* BLOQUE 2: RESULTADOS */}
        <div>
          <div className="flex items-center gap-2.5 mb-4 md:mb-5">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-mirage-red text-white flex items-center justify-center font-bold text-[11px] md:text-xs shrink-0">
              2
            </div>
            <div className="text-[13px] md:text-sm font-bold text-gray-800 tracking-tight">
              Resultado &amp; cobertura
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* COLUMNA IZQ 6/12 */}
            <div className="col-span-12 lg:col-span-6 space-y-3.5 md:space-y-4.5">
              {/* BTU Banner */}
              <div className="rounded-xl p-4 md:p-5 bg-gray-50 border border-gray-200">
                <div className="grid grid-cols-3 gap-3 md:gap-5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                      <Maximize2 className="w-3 h-3" strokeWidth={2} />
                      Espacio
                    </div>
                    <div className="flex items-baseline gap-1">
                      <div className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 tabular-nums leading-none">
                        {area.toFixed(1)}
                      </div>
                      <div className="text-[11px] font-medium text-gray-500">
                        m²
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                      Base est&aacute;ndar
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg md:text-xl font-bold text-gray-900 tabular-nums leading-none">
                        {btuVisual.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-medium text-gray-500">
                        BTU
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      1,000 BTU/m²
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                      Ajuste {zonaActiva.nombre}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg md:text-xl font-bold text-mirage-red tabular-nums leading-none">
                        {btuZona.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-medium text-gray-500">
                        BTU
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Factor {zonaActiva.cargaBTUxM2 / 1000}x clima
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacidad */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-4.5">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-gray-700">
                    <Zap className="w-4 h-4 text-mirage-red" strokeWidth={2} />
                    Capacidad del equipo
                  </label>
                  {capacidadRecomendada && btuVisual > 0 && (
                    <div className="text-[11px] font-medium text-gray-600">
                      Sugerido:{" "}
                      <span className="font-bold text-mirage-red">
                        {formatearBTU(capacidadRecomendada)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2 md:gap-2.5">
                  {capacidades.map((c) => {
                    const active = c === capacidadSeleccionadaBTU;
                    return (
                      <button
                        key={c}
                        onClick={() => setCapacidadSeleccionadaBTU(c)}
                        className={
                          "relative py-2.5 md:py-3 rounded-lg text-[12px] md:text-sm font-semibold transition-all duration-150 border " +
                          (active
                            ? c >= btuVisual
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                              : "bg-mirage-red text-white border-mirage-red shadow-sm"
                            : c === capacidadRecomendada
                              ? "bg-white border-mirage-red/30 text-mirage-red hover:bg-mirage-red/[0.03]"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300")
                        }
                      >
                        {formatearBTU(c)}
                        {c === capacidadRecomendada && !active && (
                          <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1.5 py-0.5 rounded-sm bg-mirage-red text-white font-bold">
                            MIN
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estado Cobertura */}
              <div
                className={
                  "rounded-xl p-4 border " +
                  (estadoCobertura === "ok"
                    ? "border-emerald-100 bg-emerald-50/60"
                    : estadoCobertura === "falta"
                      ? "border-red-100 bg-red-50/60"
                      : "border-gray-200 bg-gray-50/70")
                }
              >
                <div className="flex items-start gap-3 md:gap-3.5">
                  <div
                    className={
                      "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 " +
                      (estadoCobertura === "ok"
                        ? "bg-emerald-100 text-emerald-700"
                        : estadoCobertura === "falta"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-600")
                    }
                  >
                    {estadoCobertura === "ok" ? (
                      <Check className="w-4.5 h-4.5" strokeWidth={2.5} />
                    ) : estadoCobertura === "falta" ? (
                      <X className="w-4.5 h-4.5" strokeWidth={2.5} />
                    ) : (
                      <Thermometer className="w-4.5 h-4.5" strokeWidth={2} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] md:text-[14px] font-semibold text-gray-900 leading-tight">
                      Equipo seleccionado:{" "}
                      <span className="text-mirage-red font-bold">
                        {capacidadSeleccionadaBTU.toLocaleString()} BTU
                      </span>
                    </div>
                    {estadoCobertura === "idle" ? (
                      <div className="text-[12px] text-gray-500 mt-1 font-medium">
                        Ingresa dimensiones para ver la cobertura.
                      </div>
                    ) : estadoCobertura === "ok" ? (
                      <div className="text-[12px] md:text-[13px] text-emerald-700 mt-1 font-medium leading-snug">
                        Cubre los {btuVisual.toLocaleString()} BTU necesarios, con reserva de capacidad.
                      </div>
                    ) : (
                      <div className="text-[12px] md:text-[13px] text-red-700 mt-1 font-medium leading-snug">
                        Faltan{" "}
                        <span className="font-bold">
                          {(btuVisual - capacidadSeleccionadaBTU).toLocaleString()}
                        </span>{" "}
                        BTU para cubrir el espacio.
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-0.5">
                      <div className="text-[11px] font-medium text-gray-600 leading-snug">
                        Mirage recomienda sumar{" "}
                        <span className="text-gray-800 font-bold">
                          20% de holgura
                        </span>{" "}
                        y elegir la capacidad superior inmediata.
                      </div>
                      {btuVisual > 0 && (
                        <div className="text-[11px] font-medium text-gray-600">
                          Con holgura:{" "}
                          <span className="font-bold text-gray-800 tabular-nums">
                            {btuHolgura20.toLocaleString()} BTU
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DER 6/12 */}
            <div className="col-span-12 lg:col-span-6 space-y-3.5 md:space-y-4.5">
              {/* Leyenda */}
              <div className="rounded-xl bg-gray-50/60 border border-gray-200 p-3 md:p-3.5">
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {(["blue", "green", "red", "empty"] as TipoCelda[]).map(
                    (k) => (
                      <div
                        key={k}
                        className="flex items-center gap-2 p-2 rounded-md bg-white border border-gray-100"
                      >
                        <div
                          className={
                            "w-3.5 h-3.5 rounded-sm border " +
                            paletaCelda[k].bg +
                            " " +
                            paletaCelda[k].border
                          }
                        />
                        <div className="min-w-0 flex-1 leading-tight">
                          <div
                            className={
                              "text-[11px] font-semibold truncate " +
                              paletaCelda[k].text
                            }
                          >
                            {paletaCelda[k].label}
                          </div>
                          <div className="text-[10px] font-medium text-gray-500 leading-none mt-0.5">
                            {resumen[k]} celdas
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-3 md:gap-4 items-stretch">
                {/* CUADRÍCULA BTU */}
                <div className="rounded-xl bg-white border border-gray-200 p-3 md:p-4 flex-1 min-w-0 w-full flex flex-col">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2 text-gray-800 text-[12px] md:text-[13px] font-semibold">
                      <Grid3x3 className="w-4 h-4 text-mirage-red" strokeWidth={2} />
                      Cuadr&iacute;cula BTU
                    </div>
                    <div className="text-[10px] md:text-[11px] font-medium text-gray-500">
                      1 celda = {formatearBTU(CELDA_BTUS)} BTU
                    </div>
                  </div>

                  {celdas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-10 md:py-14 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <Grid3x3 className="w-7 h-7 md:w-8 md:h-8 mb-1.5 text-gray-300" strokeWidth={1.8} />
                      <div className="text-[12px] font-medium text-gray-500">
                        Medidas pendientes
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        La gr&aacute;fica se dibuja aqu&iacute;
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center flex-1 py-1.5 md:py-2">
                      <div
                        className="inline-grid gap-[2px] md:gap-[3px]"
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
                                style={{
                                  width: tamCelda,
                                  height: tamCelda,
                                }}
                              />
                            );
                          }
                          const p = paletaCelda[celda.tipo];
                          return (
                            <div
                              key={i}
                              className={
                                "relative rounded-sm border transition-colors " +
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
                                      "font-semibold tabular-nums leading-none " +
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
                    </div>
                  )}
                </div>

                {/* MÉTRICAS */}
                <div className="space-y-2.5 md:space-y-3 flex-1 min-w-0 flex flex-col justify-between">
                  <div className="rounded-xl bg-white border border-gray-200 p-3 md:p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2.5 md:mb-3">
                      <BarChart3 className="w-4 h-4 text-gray-400" strokeWidth={2} />
                      <div className="text-[11px] md:text-[12px] uppercase tracking-wider font-semibold text-gray-500">
                        M&eacute;tricas
                      </div>
                    </div>
                    <div className="space-y-2 md:space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="rounded-md bg-gray-50 border border-gray-100 p-3 md:p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                            Requerimiento
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg md:text-xl font-bold text-gray-900 tabular-nums tracking-tight leading-none">
                              {btuVisual.toLocaleString()}
                            </span>
                            <span className="text-[11px] font-medium text-gray-500">
                              BTU
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md bg-mirage-red/[0.04] border border-mirage-red/20 p-3 md:p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-mirage-red/80 font-semibold">
                            Capacidad
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg md:text-xl font-bold text-mirage-red tabular-nums tracking-tight leading-none">
                              {capacidadSeleccionadaBTU.toLocaleString()}
                            </span>
                            <span className="text-[11px] font-medium text-mirage-red/70">
                              BTU
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "rounded-md border p-3 md:p-3.5 " +
                          (diferencia >= 0
                            ? "bg-emerald-50/60 border-emerald-100"
                            : "bg-red-50/60 border-red-100")
                        }
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                            Diferencia
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span
                              className={
                                "text-lg md:text-xl font-bold tabular-nums tracking-tight leading-none " +
                                (diferencia >= 0
                                  ? "text-emerald-700"
                                  : "text-red-700")
                              }
                            >
                              {diferencia >= 0 ? "+" : ""}
                              {diferencia.toLocaleString()}
                            </span>
                            <span className="text-[11px] font-medium text-gray-500">
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
          </div>
        </div>
      </div>

      {/* Modal Fuentes */}
      {verFuentes ? (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setVerFuentes(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Fuentes tabla BTU Mirage"
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 md:px-5 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-4 h-4 text-mirage-red shrink-0" strokeWidth={2} />
                <div className="text-[13px] md:text-sm font-bold text-gray-900 truncate">
                  Fuente · Tabla de BTUs Mirage
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerFuentes(false)}
                className="w-8 h-8 rounded-md border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 inline-flex items-center justify-center transition-colors shrink-0"
                aria-label="Cerrar fuentes"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
            <div className="overflow-auto bg-gray-100 p-2 md:p-3">
              <div className="bg-white rounded-lg p-2 md:p-3 border border-gray-200 shadow-inner">
                <img
                  src={FUENTES_IMG_URL}
                  alt="Tabla BTU Mirage · fuente original"
                  className="w-full h-auto rounded-md block"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
