import {
  Gauge,
  Leaf,
  Volume2,
  Wind,
  Cog,
  Flame,
  Zap,
} from "lucide-react";
import type { VarianteEquipo } from "@/types/catalogo";

interface Props {
  variante: VarianteEquipo;
}

const iconMap = {
  seer: Gauge,
  ahorro: Leaf,
  ruidoDb: Volume2,
  flujoAireM3h: Wind,
  compresor: Cog,
  gas: Flame,
  consumoWatts: Zap,
} as const;

type CampoKey = keyof typeof iconMap;

const getSeerNumber = (v: VarianteEquipo): number =>
  typeof v.seer === "number" ? v.seer : Number(String(v.seer).replace(/[^0-9.]/g, "")) || 0;

const getAhorroPct = (v: VarianteEquipo): number => {
  const parts = String(v.ahorro).match(/([0-9.]+)/g);
  if (!parts || parts.length === 0) return 0;
  return Math.max(...parts.map((n) => Number(n)));
};

const campos: {
  key: CampoKey;
  label: string;
  formatter: (v: VarianteEquipo) => string;
  highlight?: (v: VarianteEquipo) => boolean;
}[] = [
  {
    key: "seer",
    label: "SEER",
    formatter: (v) => `${v.seer}`,
    highlight: (v) => getSeerNumber(v) >= 22,
  },
  {
    key: "ahorro",
    label: "Ahorro",
    formatter: (v) => v.ahorro,
    highlight: (v) => getAhorroPct(v) >= 40,
  },
  {
    key: "ruidoDb",
    label: "Ruido",
    formatter: (v) => `${v.ruidoDb} dB`,
  },
  {
    key: "flujoAireM3h",
    label: "Flujo aire",
    formatter: (v) => `${v.flujoAireM3h} m³/h`,
  },
  {
    key: "compresor",
    label: "Compresor",
    formatter: (v) => v.compresor,
  },
  {
    key: "gas",
    label: "Gas",
    formatter: (v) => v.gas,
  },
  {
    key: "consumoWatts",
    label: "Consumo",
    formatter: (v) => `${v.consumoWatts} W`,
  },
];

export default function FichaTecnica({ variante }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-2.5">
      {campos.map((c) => {
        const Icon = iconMap[c.key];
        const value = c.formatter(variante);
        const isHigh = c.highlight?.(variante);

        return (
          <div
            key={c.key}
            className={
              "flex items-center gap-2.5 p-2.5 md:p-3 rounded-lg border transition-colors " +
              (isHigh
                ? "bg-mirage-red/[0.04] border-mirage-red/20"
                : "bg-gray-50/70 border-gray-100")
            }
          >
            <div
              className={
                "w-8 h-8 rounded-md flex items-center justify-center shrink-0 " +
                (isHigh
                  ? "bg-mirage-red/90 text-white"
                  : "bg-gray-100 text-gray-600")
              }
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-medium text-gray-500 leading-tight">
                {c.label}
              </div>
              <div
                className={
                  "text-[13px] md:text-sm font-semibold tabular-nums mt-0.5 leading-tight truncate " +
                  (isHigh ? "text-mirage-red" : "text-gray-900")
                }
              >
                {value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
