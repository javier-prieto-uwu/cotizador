import MarcaHeader from "@/components/MarcaHeader";
import CalculadoraSimuladorUnificado from "@/components/CalculadoraSimuladorUnificado";
import ComparativaVS from "@/components/ComparativaVS";
import CatalogoSection from "@/components/CatalogoSection";
import MarcaFooter from "@/components/MarcaFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MarcaHeader />
      <main className="flex-1">
        <div className="container max-w-[1400px] 2xl:max-w-[1600px] py-5 md:py-7 lg:py-8">
          <CalculadoraSimuladorUnificado />
        </div>
        {/* <ComparativaVS />
        <CatalogoSection /> */}
      </main>
      <MarcaFooter />
    </div>
  );
}
