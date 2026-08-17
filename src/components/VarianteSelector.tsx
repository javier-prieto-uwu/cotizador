import type { SerieEquipo, VarianteEquipo, Voltaje } from "@/types/catalogo";
import { useCotizadorStore } from "@/store/useCotizadorStore";

interface Props {
  serie: SerieEquipo;
}

function getCapacidades(serie: SerieEquipo): number[] {
  return Array.from(new Set(serie.variantes.map((v) => v.btu))).sort(
    (a, b) => a - b,
  );
}

function getVoltajes(variantes: VarianteEquipo[]): Voltaje[] {
  return Array.from(new Set(variantes.map((v) => v.voltaje))).sort(
    (a, b) => (a === (110 as Voltaje) ? -1 : 1),
  );
}

export default function VarianteSelector({ serie }: Props) {
  const setCapacidad = useCotizadorStore((s) => s.setCapacidadSeleccionadaBTU);
  const setVarianteActiva = useCotizadorStore((s) => s.setVarianteActivaPorSerie);
  const varianteActivaId = useCotizadorStore(
    (s) => s.varianteActivaPorSerie[serie.id],
  );
  const getBTUZona = useCotizadorStore((s) => s.getBTUZona);
  const getCapacidadRecomendada = useCotizadorStore(
    (s) => s.getCapacidadRecomendada,
  );
  const capacidadSeleccionadaBTU = useCotizadorStore(
    (s) => s.capacidadSeleccionadaBTU,
  );

  const varianteActiva =
    serie.variantes.find((v) => v.id === varianteActivaId) ??
    serie.variantes.find(
      (v) =>
        v.btu === capacidadSeleccionadaBTU &&
        v.voltaje === (110 as Voltaje),
    ) ??
    serie.variantes[0];

  const capacidades = getCapacidades(serie);
  const voltajesDisponibles = getVoltajes(
    serie.variantes.filter((v) => v.btu === varianteActiva.btu),
  );

  const btuNecesarios = getBTUZona();
  const recomendada = getCapacidadRecomendada();

  const elegir = (cap: number, volt: Voltaje) => {
    const v =
      serie.variantes.find(
        (vv) => vv.btu === cap && vv.voltaje === volt,
      ) ?? serie.variantes.find((vv) => vv.btu === cap);
    if (v) {
      setCapacidad(v.btu);
      setVarianteActiva(serie.id, v.id);
    } else {
      setCapacidad(cap);
      setVarianteActiva(serie.id, null);
    }
  };

  return (
    <div className="space-y-3 md:space-y-3.5">
      <div>
        <div className="text-[11px] font-semibold text-gray-600 mb-1.5">
          Capacidad (BTU)
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {capacidades.map((cap) => {
            const k = cap / 1000;
            const kLabel = `${k}k`;
            const activa = cap === varianteActiva.btu;
            const cubre = cap >= btuNecesarios;
            const sugerida = cap === recomendada;

            return (
              <button
                key={cap}
                type="button"
                onClick={() => elegir(cap, varianteActiva.voltaje)}
                className={
                  "relative px-3 md:px-3.5 py-1.5 md:py-2 rounded-lg text-[12px] md:text-sm font-semibold transition-all duration-150 border " +
                  (activa
                    ? "bg-mirage-red text-white border-mirage-red"
                    : cubre
                      ? "bg-white text-gray-800 border-gray-200 hover:border-mirage-red/40 hover:text-mirage-red"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900")
                }
              >
                {sugerida ? (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1.5 py-0.5 rounded-sm bg-mirage-red text-white font-semibold">
                    MIN
                  </span>
                ) : null}
                <span>{kLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-[11px] font-semibold text-gray-600 mb-1.5">
          Voltaje
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {voltajesDisponibles.length === 0
            ? serie.variantes.length > 0
              ? getVoltajes(serie.variantes).map((volt) => {
                  const activa = volt === varianteActiva.voltaje;
                  return (
                    <button
                      key={volt}
                      type="button"
                      onClick={() => elegir(varianteActiva.btu, volt)}
                      className={
                        "px-4 md:px-5 py-1.5 md:py-2 rounded-lg text-[12px] md:text-sm font-semibold border transition-all " +
                        (activa
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-200 hover:border-gray-300")
                      }
                    >
                      {volt}V
                    </button>
                  );
                })
              : null
            : voltajesDisponibles.map((volt) => {
                const activa = volt === varianteActiva.voltaje;
                return (
                  <button
                    key={volt}
                    type="button"
                    onClick={() => elegir(varianteActiva.btu, volt)}
                    className={
                      "px-4 md:px-5 py-1.5 md:py-2 rounded-lg text-[12px] md:text-sm font-semibold border transition-all " +
                      (activa
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-800 border-gray-200 hover:border-gray-300")
                    }
                  >
                    {volt}V
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
}
