import { LuMonitor } from "react-icons/lu";
import CardComputador from "../Cards/CardMenor";
 // Certifique-se que o import está correto

export default function PainelComputadores({ data }) {
  // Desestruturação com valores padrão
  const {
    totalComputadores = 0,
    totalAtivos = 0,
    totalManutencao = 0,
    totalInativos = 0,
  } = data || {};

  return (
    <section className="w-full h-[150px] flex items-center justify-center ">
      <section className="flex flex-row w-full gap-5 h-full items-center justify-center">
        
      
        <CardComputador 
          icon={<LuMonitor size={20} className="text-[#0080FF]" />} 
          subtitle="Total" 
          quantity={totalComputadores} 
          bgColor="#E5F2FF" 
        />

  
        <CardComputador 
          icon={<LuMonitor size={20} className="text-[#43CE76]" />} 
          subtitle="Ativos" 
          quantity={totalAtivos} 
          bgColor="#E8F9EF" 
        />

      
        <CardComputador 
          icon={<LuMonitor size={20} className="text-[#EAB308]" />} 
          subtitle="Manutenção" 
          quantity={totalManutencao} 
          bgColor="#FDF7E6" 
        />

   
        <CardComputador 
          icon={<LuMonitor size={20} className="text-[#EF4444]" />} 
          subtitle="Inativos" 
          quantity={totalInativos} 
          bgColor="#FDECEC" 
        />

      </section>
    </section>
  );
}