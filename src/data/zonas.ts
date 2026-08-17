import type { ZonaClimatica } from "../types/catalogo";

export const ZONAS_CLIMATICAS: ZonaClimatica[] = [
  {
    id: 1,
    nombre: "Zona 1",
    referencia: "Zona Norte (Templada)",
    cargaBTUxM2: 700,
    estados: [
      "Nayarit",
      "Jalisco",
      "Colima",
      "Zacatecas",
      "Aguascalientes",
      "Guanajuato",
      "Tlaxcala",
    ],
  },
  {
    id: 2,
    nombre: "Zona 2",
    referencia: "Zona Centro",
    cargaBTUxM2: 800,
    estados: [
      "Michoacán",
      "Edo. de México",
      "Hidalgo",
      "Puebla",
      "Morelos",
      "Querétaro",
      "CDMX",
    ],
  },
  {
    id: 3,
    nombre: "Zona 3",
    referencia: "Zona Pacífico",
    cargaBTUxM2: 900,
    estados: [
      "Baja California Sur",
      "Tamaulipas",
      "San Luís Potosí",
      "Veracruz",
      "Guerrero",
      "Oaxaca",
    ],
  },
  {
    id: 4,
    nombre: "Zona 4",
    referencia: "Quintana Roo | Playa del Carmen | Cancún",
    cargaBTUxM2: 1000,
    estados: [
      "Sonora",
      "Chihuahua",
      "Coahuila",
      "Nuevo León",
      "Baja California Norte",
      "Sinaloa",
      "Durango",
      "Tabasco",
      "Chiapas",
      "Campeche",
      "Quintana Roo",
      "Yucatán",
    ],
  },
];

export const ZONA_DEFAULT_ID = 4 as const;
export const BASE_VISUAL_BTUXM2 = 1000 as const;
export const CELDA_BTUS = 1000 as const;
