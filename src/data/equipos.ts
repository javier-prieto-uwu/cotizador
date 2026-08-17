import type { SerieEquipo } from "../types/catalogo";

export const LOGO_MIRAGE_URL =
  "https://climamirage.com/wp-content/uploads/2017/10/mirage-logo-blanco.png";
export const LOGO_MIRAGE_BLANCO_URL =
  "https://climamirage.com/wp-content/uploads/2017/10/mirage-logo-blanco.png";

export const CATALOGO_EQUIPOS: SerieEquipo[] = [
  {
    id: "life-12-plus",
    nombre: "LIFE 12+",
    linea: "Convencional",
    tagline: "Eficiencia y durabilidad en cada enfriamiento",
    imagenUrl:
      "https://mirage.mx/wp-content/uploads/2022/08/life12plus-768x768.png",
    funcionesDestacadas: [
      "Recubrimiento Ozone Fin",
      "Detección de Fugas",
      "Ventilador X-Blade",
    ],
    variantes: [
      {
        id: "life12-12k-110",
        btu: 12000,
        voltaje: 110,
        seer: 12,
        ahorro: "5%",
        ruidoDb: 41,
        flujoAireM3h: 560,
        compresor: "GMCC High Perf.",
        gas: "R-410a",
        consumoWatts: 950,
      },
      {
        id: "life12-12k-220",
        btu: 12000,
        voltaje: 220,
        seer: 12,
        ahorro: "5%",
        ruidoDb: 41,
        flujoAireM3h: 560,
        compresor: "GMCC High Perf.",
        gas: "R-410a",
        consumoWatts: 1000,
      },
      {
        id: "life12-18k-220",
        btu: 18000,
        voltaje: 220,
        seer: 12,
        ahorro: "5%",
        ruidoDb: 46,
        flujoAireM3h: 850,
        compresor: "GMCC High Perf.",
        gas: "R-410a",
        consumoWatts: 1600,
      },
      {
        id: "life12-24k-220",
        btu: 24000,
        voltaje: 220,
        seer: 12,
        ahorro: "3%",
        ruidoDb: 41,
        flujoAireM3h: 1170,
        compresor: "GMCC High Perf.",
        gas: "R-410a",
        consumoWatts: 2000,
      },
    ],
  },
  {
    id: "xlife-2025",
    nombre: "XLIFE 2025",
    linea: "Convencional",
    tagline: "Turbo enfriamiento con modo descanso silencioso",
    imagenUrl:
      "https://mirage.mx/wp-content/uploads/2022/08/xlife_minisplit_mirage-768x768.png",
    funcionesDestacadas: [
      "Recubrimiento BlueFin",
      "Turbo Enfriamiento",
      "Modo Descanso Silencioso",
    ],
    variantes: [
      {
        id: "xlife-12k-110",
        btu: 12000,
        voltaje: 110,
        seer: 12,
        ahorro: "5%",
        ruidoDb: 44,
        flujoAireM3h: 600,
        compresor: "GMCC High Perf.",
        gas: "R-410a",
        consumoWatts: 1000,
      },
      {
        id: "xlife-12k-220",
        btu: 12000,
        voltaje: 220,
        seer: 12,
        ahorro: "5%",
        ruidoDb: 44,
        flujoAireM3h: 600,
        compresor: "GMCC High Perf.",
        gas: "R-410a",
        consumoWatts: 950,
      },
      {
        id: "xlife-18k-220",
        btu: 18000,
        voltaje: 220,
        seer: 12,
        ahorro: "5%",
        ruidoDb: 51,
        flujoAireM3h: 1300,
        compresor: "GMCC High Perf.",
        gas: "R-410a",
        consumoWatts: 1600,
      },
      {
        id: "xlife-24k-220",
        btu: 24000,
        voltaje: 220,
        seer: 12,
        ahorro: "3%",
        ruidoDb: 50,
        flujoAireM3h: 1200,
        compresor: "GMCC High Perf.",
        gas: "R-410a",
        consumoWatts: 2000,
      },
    ],
  },
  {
    id: "magnum-22",
    nombre: "MAGNUM 22",
    linea: "Inverter",
    tagline: "Alta eficiencia 22 SEER con temperatura exacta",
    imagenUrl:
      "https://mirage.mx/wp-content/uploads/2022/07/magnum22_inverter-768x768.png",
    funcionesDestacadas: [
      "Alta Eficiencia 22 SEER",
      "Temperatura Exacta",
      "Filtro de Alta Densidad",
    ],
    variantes: [
      {
        id: "magnum22-12k-110",
        btu: 12000,
        voltaje: 110,
        seer: 22,
        ahorro: "39.5% ~ 50%",
        ruidoDb: 41,
        flujoAireM3h: 560,
        compresor: "SVS (Smart Variable Speed)",
        gas: "R-410a",
        consumoWatts: 950,
      },
      {
        id: "magnum22-12k-220",
        btu: 12000,
        voltaje: 220,
        seer: 22,
        ahorro: "39.5% ~ 50%",
        ruidoDb: 41,
        flujoAireM3h: 560,
        compresor: "SVS (Smart Variable Speed)",
        gas: "R-410a",
        consumoWatts: 1000,
      },
      {
        id: "magnum22-18k-220",
        btu: 18000,
        voltaje: 220,
        seer: 22,
        ahorro: "35.5% ~ 50%",
        ruidoDb: 46,
        flujoAireM3h: 800,
        compresor: "SVS (Smart Variable Speed)",
        gas: "R-410a",
        consumoWatts: 1600,
      },
      {
        id: "magnum22-24k-220",
        btu: 24000,
        voltaje: 220,
        seer: 22,
        ahorro: "43.3% ~ 50%",
        ruidoDb: 47,
        flujoAireM3h: 1000,
        compresor: "SVS (Smart Variable Speed)",
        gas: "R-410a",
        consumoWatts: 2000,
      },
    ],
  },
  {
    id: "inverter-x",
    nombre: "INVERTER X",
    linea: "Inverter",
    tagline: "Gas R32 ecológico + WIFI + Ingeniería IA",
    imagenUrl:
      "https://mirage.mx/wp-content/uploads/2019/07/inverter-x-gen3-768x768.webp",
    funcionesDestacadas: [
      "Gas R32 Ecológico",
      "WIFI Compatible",
      "Ingeniería Inteligente IA",
    ],
    variantes: [
      {
        id: "invx-12k-110",
        btu: 12000,
        voltaje: 110,
        seer: 17.4,
        ahorro: "15.8%",
        ruidoDb: 39.5,
        flujoAireM3h: 592,
        compresor: "SVS (Smart Variable Speed)",
        gas: "R-32",
        consumoWatts: 950,
      },
      {
        id: "invx-12k-220",
        btu: 12000,
        voltaje: 220,
        seer: 16.8,
        ahorro: "15.8%",
        ruidoDb: 39.5,
        flujoAireM3h: 592,
        compresor: "SVS (Smart Variable Speed)",
        gas: "R-32",
        consumoWatts: 1000,
      },
      {
        id: "invx-18k-220",
        btu: 18000,
        voltaje: 220,
        seer: 18.6,
        ahorro: "16.7%",
        ruidoDb: 43.5,
        flujoAireM3h: 850,
        compresor: "SVS (Smart Variable Speed)",
        gas: "R-32",
        consumoWatts: 1600,
      },
      {
        id: "invx-23k-220",
        btu: 23000,
        voltaje: 220,
        seer: 18.8,
        ahorro: "23.5%",
        ruidoDb: 45,
        flujoAireM3h: 1150,
        compresor: "SVS (Smart Variable Speed)",
        gas: "R-32",
        consumoWatts: 2000,
      },
    ],
  },
  {
    id: "magnum-18",
    nombre: "MAGNUM 18",
    linea: "Inverter",
    tagline: "Equipos de alta capacidad con confort total",
    imagenUrl:
      "https://mirage.mx/wp-content/uploads/2023/07/mirage-magnum18-768x768.webp",
    funcionesDestacadas: [
      "Tecnología Inverter",
      "Ahorro Energético",
      "Confort Total",
    ],
    variantes: [
      {
        id: "magnum18-36k-220",
        btu: 36000,
        voltaje: 220,
        seer: 18,
        ahorro: "Hasta 40%",
        ruidoDb: 48,
        flujoAireM3h: 1350,
        compresor: "Twin Rotary Inverter",
        gas: "R-410a",
        consumoWatts: "Dato pendiente de manual exacto",
      },
    ],
  },
  {
    id: "inverter-17",
    nombre: "INVERTER 17",
    linea: "Inverter",
    tagline: "Alta capacidad con arranque suave y silencioso",
    imagenUrl:
      "https://mirage.mx/wp-content/uploads/2022/07/magnum22_inverter-768x768.png",
    funcionesDestacadas: [
      "Arranque Suave (Soft Start)",
      "Sensación Térmica Mejorada",
      "Operación Silenciosa",
    ],
    variantes: [
      {
        id: "inv17-36k-220",
        btu: 36000,
        voltaje: 220,
        seer: 16.7,
        ahorro: "19.30%",
        ruidoDb: 53,
        flujoAireM3h: "Más de 100 niveles de ventilación",
        compresor: "Heavy Duty Inverter",
        gas: "R-410A",
        consumoWatts: "Dato pendiente de manual exacto",
      },
    ],
  },
];

export function getSeriesPorLinea(linea: "Convencional" | "Inverter") {
  return CATALOGO_EQUIPOS.filter((s) => s.linea === linea);
}

export function findVarianteById(varianteId: string) {
  for (const serie of CATALOGO_EQUIPOS) {
    const found = serie.variantes.find((v) => v.id === varianteId);
    if (found) return { serie, variante: found };
  }
  return null;
}

export function getCapacidadesDisponibles(): number[] {
  const set = new Set<number>();
  for (const serie of CATALOGO_EQUIPOS) {
    for (const v of serie.variantes) set.add(v.btu);
  }
  return Array.from(set).sort((a, b) => a - b);
}
