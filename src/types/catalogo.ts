export type ZonaId = 1 | 2 | 3 | 4;

export type ZonaClimatica = {
  id: ZonaId;
  nombre: string;
  referencia: string;
  cargaBTUxM2: number;
  estados: string[];
};

export type Voltaje = 110 | 220;

export type VarianteEquipo = {
  id: string;
  btu: number;
  voltaje: Voltaje;
  seer: number | string;
  ahorro: string;
  ruidoDb: number | string;
  flujoAireM3h: number | string;
  compresor: string;
  gas: string;
  consumoWatts: number | string;
};

export type LineaEquipo = "Convencional" | "Inverter";

export type SerieEquipo = {
  id: string;
  nombre: string;
  linea: LineaEquipo;
  tagline?: string;
  imagenUrl?: string;
  funcionesDestacadas: string[];
  variantes: VarianteEquipo[];
};
