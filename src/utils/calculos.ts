import { BASE_VISUAL_BTUXM2, CELDA_BTUS } from "../data/zonas";

export type TipoCelda = "blue" | "green" | "red" | "empty";

export function calcularArea(largo: number, ancho: number): number {
  const l = isFinite(largo) && largo > 0 ? largo : 0;
  const a = isFinite(ancho) && ancho > 0 ? ancho : 0;
  return Math.round(l * a * 100) / 100;
}

export function calcularBTUZona(
  areaM2: number,
  cargaBTUxM2: number,
): number {
  return Math.round(areaM2 * cargaBTUxM2);
}

export function calcularBTUVisual(areaM2: number): number {
  return Math.round(areaM2 * BASE_VISUAL_BTUXM2);
}

export function celdaCountFromBTU(btus: number): number {
  if (btus <= 0) return 0;
  return Math.max(1, Math.ceil(btus / CELDA_BTUS));
}

export function construirGridCeldas(params: {
  btuRequeridos: number;
  btuEquipoSeleccionado: number;
}): { tipo: TipoCelda }[] {
  const { btuRequeridos, btuEquipoSeleccionado } = params;

  if (btuRequeridos <= 0 && btuEquipoSeleccionado <= 0) return [];

  const celdasRequeridas = Math.max(
    celdaCountFromBTU(btuRequeridos),
    celdaCountFromBTU(btuEquipoSeleccionado),
  );

  const celdas: { tipo: TipoCelda }[] = [];

  for (let i = 0; i < celdasRequeridas; i++) {
    const btuCeldaInicio = i * CELDA_BTUS;
    const btuCeldaFin = (i + 1) * CELDA_BTUS;

    const cubreRequerido = btuCeldaInicio < btuRequeridos;
    const cubreEquipo = btuCeldaInicio < btuEquipoSeleccionado;

    if (!cubreRequerido && !cubreEquipo) {
      celdas.push({ tipo: "empty" });
    } else if (!cubreEquipo && cubreRequerido) {
      celdas.push({ tipo: "red" });
    } else if (cubreEquipo && !cubreRequerido) {
      celdas.push({ tipo: "green" });
    } else {
      celdas.push({ tipo: "blue" });
    }
  }

  return celdas;
}

export function recomendarCapacidadMinima(btuRequeridos: number, capacidades: number[]): number | null {
  if (btuRequeridos <= 0) return null;
  const sorted = [...capacidades].sort((a, b) => a - b);
  const match = sorted.find((c) => c >= btuRequeridos);
  return match ?? sorted[sorted.length - 1] ?? null;
}

export function formatearBTU(btus: number): string {
  if (btus >= 1000) {
    return (btus / 1000).toFixed(btus % 1000 === 0 ? 0 : 1) + "k";
  }
  return String(btus);
}
