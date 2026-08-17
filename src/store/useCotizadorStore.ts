import { create } from "zustand";
import { ZONA_DEFAULT_ID, ZONAS_CLIMATICAS } from "../data/zonas";
import { getCapacidadesDisponibles, findVarianteById } from "../data/equipos";
import type { ZonaId, SerieEquipo, VarianteEquipo } from "../types/catalogo";
import {
  calcularArea,
  calcularBTUVisual,
  calcularBTUZona,
  recomendarCapacidadMinima,
} from "../utils/calculos";

export type ParComparar = { serie: SerieEquipo; variante: VarianteEquipo } | null;

export const PRECIO_LUZ_DEFAULT = 3.8;
export const HORAS_USO_DIARIO_DEFAULT = 8;
export const DIAS_MES_DEFAULT = 30;

interface CotizadorState {
  zonaId: ZonaId;
  largoM: number;
  anchoM: number;
  capacidadSeleccionadaBTU: number;
  varianteActivaPorSerie: Record<string, string>;

  compararLista: string[];
  precioLuzMXN: number;
  horasUsoDiario: number;
  diasUsoMes: number;

  setZonaId: (id: ZonaId) => void;
  setLargo: (v: number) => void;
  setAncho: (v: number) => void;
  setCapacidadSeleccionadaBTU: (btus: number) => void;
  setVarianteActivaPorSerie: (serieId: string, varianteId: string) => void;

  toggleComparar: (varianteId: string) => boolean;
  quitarComparar: (varianteId: string) => void;
  limpiarComparar: () => void;
  setPrecioLuzMXN: (v: number) => void;
  setHorasUsoDiario: (v: number) => void;
  setDiasUsoMes: (v: number) => void;

  getArea: () => number;
  getBTUVisual: () => number;
  getBTUZona: () => number;
  getCargaZonaActual: () => number;
  getCapacidadRecomendada: () => number | null;
  getCompararPares: () => ParComparar[];
  estaEnComparar: (varianteId: string) => boolean;
}

function recomendar(state: CotizadorState): number | null {
  const btuVisual = state.getBTUVisual();
  return recomendarCapacidadMinima(btuVisual, getCapacidadesDisponibles());
}

export const useCotizadorStore = create<CotizadorState>((set, get) => {
  const stateBase: CotizadorState = {
    zonaId: ZONA_DEFAULT_ID,
    largoM: 3,
    anchoM: 3,
    capacidadSeleccionadaBTU: 12000,
    varianteActivaPorSerie: {},
    compararLista: [],
    precioLuzMXN: PRECIO_LUZ_DEFAULT,
    horasUsoDiario: HORAS_USO_DIARIO_DEFAULT,
    diasUsoMes: DIAS_MES_DEFAULT,

    setZonaId: (id) => {
      set({ zonaId: id });
    },
    setLargo: (v) => {
      const value = isFinite(v) ? Math.max(0, v) : 0;
      const next = { largoM: value } as Partial<CotizadorState>;
      set(next);
      const r = recomendar(get());
      if (r) set({ capacidadSeleccionadaBTU: r });
    },
    setAncho: (v) => {
      const value = isFinite(v) ? Math.max(0, v) : 0;
      const next = { anchoM: value } as Partial<CotizadorState>;
      set(next);
      const r = recomendar(get());
      if (r) set({ capacidadSeleccionadaBTU: r });
    },
    setCapacidadSeleccionadaBTU: (btus) => set({ capacidadSeleccionadaBTU: btus }),
    setVarianteActivaPorSerie: (serieId, varianteId) =>
      set((s) => ({
        varianteActivaPorSerie: { ...s.varianteActivaPorSerie, [serieId]: varianteId },
      })),

    toggleComparar: (varianteId) => {
      const lista = get().compararLista;
      const idx = lista.indexOf(varianteId);
      if (idx >= 0) {
        set({ compararLista: lista.filter((x) => x !== varianteId) });
        return false;
      }
      if (lista.length >= 2) {
        set({ compararLista: [lista[1], varianteId] });
      } else {
        set({ compararLista: [...lista, varianteId] });
      }
      return true;
    },
    quitarComparar: (varianteId) =>
      set((s) => ({
        compararLista: s.compararLista.filter((x) => x !== varianteId),
      })),
    limpiarComparar: () => set({ compararLista: [] }),
    setPrecioLuzMXN: (v) =>
      set({ precioLuzMXN: isFinite(v) ? Math.max(0.01, v) : PRECIO_LUZ_DEFAULT }),
    setHorasUsoDiario: (v) =>
      set({ horasUsoDiario: isFinite(v) ? Math.min(24, Math.max(1, v)) : HORAS_USO_DIARIO_DEFAULT }),
    setDiasUsoMes: (v) =>
      set({ diasUsoMes: isFinite(v) ? Math.min(31, Math.max(1, v)) : DIAS_MES_DEFAULT }),

    getArea: () => calcularArea(get().largoM, get().anchoM),
    getBTUVisual: () => calcularBTUVisual(get().getArea()),
    getBTUZona: () => {
      const area = get().getArea();
      const carga = get().getCargaZonaActual();
      return calcularBTUZona(area, carga);
    },
    getCargaZonaActual: () => {
      const z = ZONAS_CLIMATICAS.find((z) => z.id === get().zonaId);
      return z?.cargaBTUxM2 ?? 1000;
    },
    getCapacidadRecomendada: () => recomendar(get()),
    getCompararPares: () =>
      get().compararLista.map((id) => findVarianteById(id) ?? null),
    estaEnComparar: (varianteId) => get().compararLista.includes(varianteId),
  };
  return stateBase;
});
