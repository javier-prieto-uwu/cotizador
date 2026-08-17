import { useMemo } from "react";
import {
  Zap,
  Leaf,
  DollarSign,
  Calendar,
  Clock,
  ArrowRightLeft,
  X,
  Trophy,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useCotizadorStore, type ParComparar } from "@/store/useCotizadorStore";
import { findVarianteById } from "@/data/equipos";
import type { VarianteEquipo } from "@/types/catalogo";

const num = (v: number | string): number =>
  typeof v === "number" ? v : Number(String(v).replace(/[^0-9.]/g, "")) || 0;

const pctAhorro = (ahorro: string): number => {
  const parts = String(ahorro).match(/([0-9.]+)/g);
  if (!parts || parts.length === 0) return 0;
  return Math.max(...parts.map((n) => Number(n)));
};

const formatMXN = (n: number): string =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

const formatMXN2 = (n: number): string =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(n);

type Costos = {
  kWh: number;
  hora: number;
  dia: number;
  mes: number;
  anio: number;
  ahorroPct: number;
};

const calcularCostos = (
  v: VarianteEquipo,
  precioKWh: number,
  horasDia: number,
  diasMes: number,
): Costos => {
  const consumoW = num(v.consumoWatts);
  const kWh = consumoW / 1000;
  const hora = kWh * precioKWh;
  const dia = hora * horasDia;
  const mes = dia * diasMes;
  const anio = mes * 12;
  return {
    kWh,
    hora,
    dia,
    mes,
    anio,
    ahorroPct: pctAhorro(v.ahorro),
  };
};

interface SlotProps {
  par: ParComparar;
  letra: "A" | "B";
  onQuitar?: () => void;
}

function ComparativaSlot({ par, letra, onQuitar }: SlotProps) {
  if (!par) {
    return (
      <div className="flex-1 min-w-0 flex flex-col rounded-xl border-2 border-dashed border-gray-200 p-4 md:p-5 bg-gray-50/40">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 font-bold flex items-center justify-center shrink-0">
            {letra}
          </div>
          <div className="text-[12px] md:text-[13px] font-semibold text-gray-500">
            Equipo {letra}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center py-5 md:py-7 flex-1 gap-1.5">
          <Plus className="w-7 h-7 md:w-8 md:h-8 text-gray-300" strokeWidth={1.5} />
          <div className="text-[12px] md:text-[13px] font-semibold text-gray-500">
            A&uacute;n sin equipo
          </div>
          <div className="text-[10px] md:text-[11px] font-medium text-gray-400 max-w-[85%] leading-snug">
            Ve al cat&aacute;logo y agrega un aire con el bot&oacute;n{" "}
            <span className="font-semibold text-mirage-red">VS</span>
          </div>
        </div>
      </div>
    );
  }

  const { serie, variante } = par;
  return (
    <div className="flex-1 min-w-0 flex flex-col rounded-xl border border-gray-200 p-4 md:p-5 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 mb-3 justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={
              "w-9 h-9 rounded-lg font-bold flex items-center justify-center shrink-0 " +
              (letra === "A"
                ? "bg-gray-900 text-white"
                : "bg-mirage-red text-white")
            }
          >
            {letra}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              {serie.linea}
            </div>
            <div className="text-[14px] md:text-[15px] font-bold text-gray-900 truncate leading-tight">
              {serie.nombre}
            </div>
          </div>
        </div>
        {onQuitar && (
          <button
            type="button"
            onClick={onQuitar}
            className="w-8 h-8 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center shrink-0"
            title="Quitar de comparativa"
          >
            <X className="w-4 h-4" strokeWidth={2.2} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-[70px_1fr] gap-3 items-center mb-3 min-h-[80px]">
        {serie.imagenUrl ? (
          <div className="w-[70px] h-[70px] rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
            <img
              src={serie.imagenUrl}
              alt={serie.nombre}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-[70px] h-[70px] rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
            <Zap className="w-7 h-7 text-gray-300" />
          </div>
        )}
        <div className="space-y-0.5 min-w-0">
          <div className="text-[11px] font-medium text-gray-500">
            Capacidad · Voltaje
          </div>
          <div className="text-[15px] md:text-[17px] font-bold text-gray-900 leading-tight">
            {variante.btu.toLocaleString()} BTU
            <span className="text-gray-400 font-semibold mx-1">/</span>
            {String(variante.voltaje)}V
          </div>
          <div className="text-[11px] font-medium text-gray-500">
            SEER: <span className="font-bold text-gray-700">{variante.seer}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-gray-50 border border-gray-100 p-2.5">
          <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
            Consumo
          </div>
          <div className="text-[13px] font-bold text-gray-900 tabular-nums leading-tight">
            {num(variante.consumoWatts).toLocaleString()}{" "}
            <span className="text-[10px] font-medium text-gray-500">W</span>
          </div>
        </div>
        <div className="rounded-md bg-mirage-red/[0.05] border border-mirage-red/15 p-2.5">
          <div className="text-[9px] font-semibold uppercase tracking-wider text-mirage-red/70 mb-0.5">
            Ahorro
          </div>
          <div className="text-[13px] font-bold text-mirage-red tabular-nums leading-tight">
            Hasta {pctAhorro(variante.ahorro)}%
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilaProps {
  label: string;
  icon?: React.ReactNode;
  a: React.ReactNode;
  b: React.ReactNode;
  diff?: React.ReactNode;
  resaltar?: boolean;
}
function Fila({ label, icon, a, b, diff, resaltar }: FilaProps) {
  return (
    <div
      className={
        "grid grid-cols-12 items-center px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-100 last:border-b-0 " +
        (resaltar ? "bg-gray-50/70" : "")
      }
    >
      <div className="col-span-4 md:col-span-3 flex items-center gap-2 min-w-0">
        {icon}
        <div className="text-[11px] md:text-[12px] font-semibold text-gray-600 truncate">
          {label}
        </div>
      </div>
      <div className="col-span-3 md:col-span-3 flex items-center justify-end text-[13px] md:text-sm font-bold text-gray-900 tabular-nums min-w-0 pr-1">
        {a}
      </div>
      <div className="col-span-3 md:col-span-3 flex items-center justify-end text-[13px] md:text-sm font-bold text-gray-900 tabular-nums min-w-0 pr-1">
        {b}
      </div>
      <div className="col-span-2 md:col-span-3 flex items-center justify-end min-w-0 pl-2 md:pl-3">
        {diff}
      </div>
    </div>
  );
}

export default function ComparativaVS() {
  const compararLista = useCotizadorStore((s) => s.compararLista);
  const precioLuzMXN = useCotizadorStore((s) => s.precioLuzMXN);
  const horasUsoDiario = useCotizadorStore((s) => s.horasUsoDiario);
  const diasUsoMes = useCotizadorStore((s) => s.diasUsoMes);
  const setPrecioLuzMXN = useCotizadorStore((s) => s.setPrecioLuzMXN);
  const setHorasUsoDiario = useCotizadorStore((s) => s.setHorasUsoDiario);
  const setDiasUsoMes = useCotizadorStore((s) => s.setDiasUsoMes);
  const quitarComparar = useCotizadorStore((s) => s.quitarComparar);
  const limpiarComparar = useCotizadorStore((s) => s.limpiarComparar);

  const pares: ParComparar[] = useMemo(
    () => compararLista.map((id) => findVarianteById(id) ?? null),
    [compararLista],
  );
  const [parA, parB] = [pares[0], pares[1]];
  const llenos = !!parA && !!parB;
  const costosA = useMemo(
    () =>
      parA
        ? calcularCostos(parA.variante, precioLuzMXN, horasUsoDiario, diasUsoMes)
        : null,
    [parA, precioLuzMXN, horasUsoDiario, diasUsoMes],
  );
  const costosB = useMemo(
    () =>
      parB
        ? calcularCostos(parB.variante, precioLuzMXN, horasUsoDiario, diasUsoMes)
        : null,
    [parB, precioLuzMXN, horasUsoDiario, diasUsoMes],
  );

  const { ganador, ahorroAnual } = useMemo(() => {
    if (!costosA || !costosB || !llenos)
      return { ganador: null as "A" | "B" | null, ahorroAnual: 0 };
    if (costosA.anio < costosB.anio) {
      return { ganador: "A" as const, ahorroAnual: costosB.anio - costosA.anio };
    }
    if (costosB.anio < costosA.anio) {
      return { ganador: "B" as const, ahorroAnual: costosA.anio - costosB.anio };
    }
    return { ganador: null, ahorroAnual: 0 };
  }, [costosA, costosB, llenos]);

  return (
    <section className="bg-white border-y border-gray-100">
      <div className="container py-6 md:py-8">
        <div className="mb-4 md:mb-5">
          <div className="inline-flex items-center gap-1.5 text-gray-900 text-[11px] md:text-xs font-bold tracking-wider uppercase mb-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-mirage-red" strokeWidth={2.2} />
            2 · Comparativa energ&eacute;tica VS
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-2xl xl:text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                Compara consumo y costo real
              </h2>
              <p className="text-[12px] md:text-[13px] text-gray-500 mt-0.5 max-w-3xl font-medium">
                Agrega 2 equipos desde el cat&aacute;logo. Calcula autom&aacute;ticamente el costo mensual
                y anual con el precio real de la luz en tu zona.
              </p>
            </div>
            {compararLista.length > 0 && (
              <button
                type="button"
                onClick={limpiarComparar}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] md:text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Configuración precio luz + uso */}
        <div className="grid grid-cols-12 gap-3 md:gap-4 mb-5 md:mb-6">
          <div className="col-span-12 md:col-span-4 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 md:p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-600">
              <DollarSign className="w-4 h-4 text-mirage-red" strokeWidth={2.2} />
              Precio de la luz (CFE)
            </div>
            <div className="flex items-baseline gap-1.5">
              <input
                type="number"
                min={0.01}
                step={0.05}
                value={precioLuzMXN}
                onChange={(e) =>
                  setPrecioLuzMXN(parseFloat(e.target.value) || 0)
                }
                className="w-full max-w-[140px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 rounded-md px-3 py-2.5 text-[18px] md:text-[22px] font-bold text-gray-900 bg-white transition-all tabular-nums"
              />
              <div className="text-[12px] font-semibold text-gray-500">
                MXN / kWh
              </div>
            </div>
            <div className="text-[10px] md:text-[11px] font-medium text-gray-500 leading-snug">
              Precio promedio residencial en M&eacute;xico: $3.5 - $4.2. Ajusta seg&uacute;n tu recibo.
            </div>
          </div>

          <div className="col-span-6 md:col-span-4 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 md:p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-600">
              <Clock className="w-4 h-4 text-mirage-red" strokeWidth={2.2} />
              Horas de uso diario
            </div>
            <div className="flex items-baseline gap-1.5">
              <input
                type="number"
                min={1}
                max={24}
                step={1}
                value={horasUsoDiario}
                onChange={(e) =>
                  setHorasUsoDiario(parseInt(e.target.value, 10) || 8)
                }
                className="w-full max-w-[100px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 rounded-md px-3 py-2.5 text-[18px] md:text-[22px] font-bold text-gray-900 bg-white transition-all tabular-nums"
              />
              <div className="text-[12px] font-semibold text-gray-500">
                hrs / d&iacute;a
              </div>
            </div>
            <div className="text-[10px] md:text-[11px] font-medium text-gray-500 leading-snug">
              Tiempo encendido al d&iacute;a (noche completa: 8h, verano prolongado: 12h).
            </div>
          </div>

          <div className="col-span-6 md:col-span-4 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 md:p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-600">
              <Calendar className="w-4 h-4 text-mirage-red" strokeWidth={2.2} />
              D&iacute;as de uso al mes
            </div>
            <div className="flex items-baseline gap-1.5">
              <input
                type="number"
                min={1}
                max={31}
                step={1}
                value={diasUsoMes}
                onChange={(e) =>
                  setDiasUsoMes(parseInt(e.target.value, 10) || 30)
                }
                className="w-full max-w-[100px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 rounded-md px-3 py-2.5 text-[18px] md:text-[22px] font-bold text-gray-900 bg-white transition-all tabular-nums"
              />
              <div className="text-[12px] font-semibold text-gray-500">
                d&iacute;as
              </div>
            </div>
            <div className="text-[10px] md:text-[11px] font-medium text-gray-500 leading-snug">
              Uso estacional (20 d&iacute;as) o diario todo el mes (30 d&iacute;as).
            </div>
          </div>
        </div>

        {/* Slots A + B */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-stretch gap-3 md:gap-4 mb-5 md:mb-6">
          <ComparativaSlot
            par={parA}
            letra="A"
            onQuitar={parA ? () => quitarComparar(parA.variante.id) : undefined}
          />
          <div className="flex md:flex-col items-center justify-center py-1 md:py-0">
            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-sm shrink-0">
              <ArrowRightLeft className="w-5 h-5" strokeWidth={2.2} />
            </div>
          </div>
          <ComparativaSlot
            par={parB}
            letra="B"
            onQuitar={parB ? () => quitarComparar(parB.variante.id) : undefined}
          />
        </div>

        {/* Tabla comparativa */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <div className="grid grid-cols-12 items-center px-3 md:px-4 py-3 md:py-3.5 bg-gray-50 border-b border-gray-100">
            <div className="col-span-4 md:col-span-3" />
            <div className="col-span-3 md:col-span-3 flex items-center justify-end gap-2 pr-1 min-w-0">
              <div className="w-6 h-6 rounded bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                A
              </div>
              <div className="text-[11px] md:text-[12px] font-semibold text-gray-700 truncate">
                {parA ? parA.serie.nombre : "Equipo A"}
              </div>
            </div>
            <div className="col-span-3 md:col-span-3 flex items-center justify-end gap-2 pr-1 min-w-0">
              <div className="w-6 h-6 rounded bg-mirage-red text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                B
              </div>
              <div className="text-[11px] md:text-[12px] font-semibold text-gray-700 truncate">
                {parB ? parB.serie.nombre : "Equipo B"}
              </div>
            </div>
            <div className="col-span-2 md:col-span-3 pl-2 md:pl-3 flex items-center justify-end min-w-0">
              <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                VS
              </span>
            </div>
          </div>

          <div>
            <Fila
              label="Consumo energético"
              icon={
                <Zap className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />
              }
              a={
                costosA ? (
                  <span>
                    {num(parA!.variante.consumoWatts).toLocaleString()}
                    <span className="text-[10px] text-gray-400 font-medium ml-0.5">
                      W
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
              b={
                costosB ? (
                  <span>
                    {num(parB!.variante.consumoWatts).toLocaleString()}
                    <span className="text-[10px] text-gray-400 font-medium ml-0.5">
                      W
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
              diff={
                costosA && costosB ? (
                  <span className="text-[11px] font-semibold text-gray-500 tabular-nums">
                    {(num(parA!.variante.consumoWatts) -
                      num(parB!.variante.consumoWatts)).toLocaleString()}{" "}
                    W
                  </span>
                ) : null
              }
            />
            <Fila
              label="Eficiencia SEER"
              icon={
                <Leaf className="w-4 h-4 text-mirage-red/70 shrink-0" strokeWidth={2} />
              }
              a={
                parA ? (
                  <span className="text-mirage-red font-black">
                    {parA.variante.seer}
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
              b={
                parB ? (
                  <span className="text-mirage-red font-black">
                    {parB.variante.seer}
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
            />
            <Fila
              label="Ahorro energético"
              icon={
                <Leaf className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2} />
              }
              a={
                costosA ? (
                  <span className="text-emerald-700">
                    Hasta {costosA.ahorroPct}%
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
              b={
                costosB ? (
                  <span className="text-emerald-700">
                    Hasta {costosB.ahorroPct}%
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
              diff={
                costosA && costosB ? (
                  <span className="text-[11px] font-semibold text-emerald-700 tabular-nums">
                    {costosA.ahorroPct - costosB.ahorroPct >= 0 ? "+" : ""}
                    {costosA.ahorroPct - costosB.ahorroPct} pts
                  </span>
                ) : null
              }
            />
            <Fila
              label="Costo por hora"
              icon={
                <Clock className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />
              }
              a={costosA ? formatMXN2(costosA.hora) : <span className="text-gray-300">—</span>}
              b={costosB ? formatMXN2(costosB.hora) : <span className="text-gray-300">—</span>}
            />
            <Fila
              label="Costo diario"
              icon={
                <Zap className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />
              }
              a={costosA ? formatMXN(costosA.dia) : <span className="text-gray-300">—</span>}
              b={costosB ? formatMXN(costosB.dia) : <span className="text-gray-300">—</span>}
            />
            <Fila
              label="Costo mensual"
              icon={
                <DollarSign className="w-4 h-4 text-gray-600 shrink-0" strokeWidth={2.2} />
              }
              resaltar
              a={
                costosA ? (
                  <span
                    className={
                      "px-2 py-1 rounded-md " +
                      (ganador === "A"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "text-gray-900")
                    }
                  >
                    {formatMXN(costosA.mes)}
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
              b={
                costosB ? (
                  <span
                    className={
                      "px-2 py-1 rounded-md " +
                      (ganador === "B"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "text-gray-900")
                    }
                  >
                    {formatMXN(costosB.mes)}
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
            />
            <Fila
              label="Costo anual"
              icon={
                <Calendar className="w-4 h-4 text-gray-900 shrink-0" strokeWidth={2.2} />
              }
              resaltar
              a={
                costosA ? (
                  <span className="text-[15px] md:text-base font-black">
                    {formatMXN(costosA.anio)}
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
              b={
                costosB ? (
                  <span className="text-[15px] md:text-base font-black">
                    {formatMXN(costosB.anio)}
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )
              }
              diff={
                llenos && ahorroAnual > 0 && ganador ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-mirage-red/[0.06] border border-mirage-red/20">
                    {ganador === "A" ? (
                      <TrendingDown
                        className="w-3.5 h-3.5 text-mirage-red"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <TrendingUp
                        className="w-3.5 h-3.5 text-mirage-red"
                        strokeWidth={2.5}
                      />
                    )}
                    <span className="text-[11px] md:text-xs font-bold text-mirage-red tabular-nums whitespace-nowrap">
                      Ahorra {formatMXN(ahorroAnual)}
                    </span>
                  </div>
                ) : llenos && ganador === null ? (
                  <span className="text-[11px] font-semibold text-gray-500">
                    Igual costo
                  </span>
                ) : null
              }
            />
          </div>

          {/* Ganador final */}
          <div className="border-t border-gray-100 px-3 md:px-4 py-3.5 md:py-4.5 bg-gray-50/70">
            {ganador && llenos ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-0.5">
                      Equipo m&aacute;s econ&oacute;mico
                    </div>
                    <div className="text-[14px] md:text-[16px] font-bold text-gray-900 leading-tight truncate">
                      {(ganador === "A" ? parA : parB)!.serie.nombre} ·{" "}
                      {(ganador === "A" ? parA : parB)!.variante.btu.toLocaleString()} BTU
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                    Ahorro anual
                  </div>
                  <div className="text-[18px] md:text-[22px] font-black text-emerald-700 tabular-nums tracking-tight leading-tight">
                    {formatMXN(ahorroAnual)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-center md:text-left">
                <div className="text-[12px] md:text-[13px] font-medium text-gray-500">
                  Agrega 2 equipos al VS para ver cu&aacute;l es m&aacute;s econ&oacute;mico.
                </div>
                <div className="inline-flex items-center gap-1.5 mx-auto md:mx-0 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-[11px] font-semibold text-gray-600">
                  <Zap className="w-3.5 h-3.5 text-mirage-red" strokeWidth={2.2} />
                  Costo incluye precio luz, horas y d&iacute;as personalizados
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
