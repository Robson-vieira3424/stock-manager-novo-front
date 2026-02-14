import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FiCpu } from "react-icons/fi";
import { BiMap } from "react-icons/bi";
import { FaMemory } from "react-icons/fa";
import { MdStorage } from "react-icons/md";
import { Button } from "@/components/ui/button";
import api from "@/services/api"
interface ComputadorDTO {
  id: string | number;
  patrimonio: string;
  nome: string;
  modelo: string;
  processador: string;
  memoria: string;
  armazenamento: string;
  statusEquipamento: string;

}

interface EstacaoTrabalhoDTO {
  id: string | number;
  secretaria: string;
  setor: string;
  computador: ComputadorDTO;
  localizacao: string;
}

export default function TableComputador() {
  const [data, setData] = useState<EstacaoTrabalhoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function getEstacoesWork() {
    try {
      setLoading(true);
      const response = await api.get("/estacao");
      const result =  response.data;
      setData(result);
      console.log("dados de estacao recebidos:", result);


    } catch (error) {
      console.error("Erro ao buscar dados:", error);
     
    }finally{ setLoading(false);}
  };

  useEffect(() => {
    getEstacoesWork();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // --- Helpers de Estilo e Lógica ---

 const getTipoComputador = (modelo: string = "") => {
    const mod = (modelo || "").toLowerCase();
    if (mod.includes("xps")) return { label: "Dell XPS", style: "border-[#39d6f2] text-[#39d6f2] bg-[#e6f8fb]" };
    if (mod.includes("all-in-one")) return { label: "All-in-One", style: "border-[#0080ff] text-[#0080ff] bg-[#deeeff]" };
    if (mod.includes("thinkcenter")) return { label: "ThinkCentre", style: "border-[#ef4444] text-[#ef4444] bg-[#ffd8d2]" };
    return { label: "Genérico", style: "border-[#a855f7] text-[#a855f7] bg-[#f6eefe]" };
  };

  const getStatusStyle = (status: string = "") => {
    const s = status.trim();
    if (s === "EM_USO" || s === "EM__USO") {
      return { label: "Em Uso", style: "text-emerald-500 border-emerald-500 bg-emerald-100" };
    }
    if (s === "MANUTENCAO") {
      return { label: "Manutenção", style: "text-amber-500 border-amber-500 bg-amber-100" };
    }
    if (s === "DEFEITO") {
      return { label: "Defeito", style: "text-red-500 border-red-500 bg-red-100" };
    }
    return { label: "Disponível", style: "text-blue-400 border-blue-400 bg-blue-50" };
  };

  if (loading && data.length === 0) {
    return <div className="p-10 text-center text-gray-500">Carregando dados...</div>;
  }

  return (
    <div className="flex flex-col w-full bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="w-full mx-auto overflow-auto">
        <table className="w-full text-sm text-left">
          {/* Cabeçalho Moderno */}
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Patrimônio</th>
              <th className="px-6 py-4 font-semibold">Equipamento</th>
              <th className="px-6 py-4 font-semibold text-center">Tipo</th>
              <th className="px-6 py-4 font-semibold">Specs (CPU / RAM / ROM)</th>
              <th className="px-6 py-4 font-semibold">Localização</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {currentData.map((estacao) => {
              const pc = estacao.computador;
              if (!pc) return null;

              const tipoInfo = getTipoComputador(pc.modelo);
              const statusInfo = getStatusStyle(pc.statusEquipamento);

              return (
                <tr key={estacao.id} className="hover:bg-slate-50 transition-colors">

                  {/* 1. Patrimônio Tech Style */}
                  <td className="px-6 py-4 align-middle">
                    <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      {pc.patrimonio}
                    </span>
                  </td>

                  {/* 2. Equipamento Limpo */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{pc.nome}</span>
                      <span className="text-xs text-slate-500">{pc.modelo}</span>
                    </div>
                  </td>

                  {/* 3. Badge de Tipo Moderno */}
                  <td className="px-6 py-4 align-middle text-center">
                    {/* Note que removi o min-w fixo e usei cores mais suaves via classes Tailwind padrão se possível */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tipoInfo.style}`}>
                     {tipoInfo.label}
                    </span>
                  </td>

                  {/* 4. Componentes em Linha (Mais fácil de ler) */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="flex items-center gap-1.5" title="Processador">
                        <FiCpu className="w-4 h-4 text-slate-400" />
                        <span className="text-xs">{pc.processador}</span>
                      </div>
                      <div className="h-4 w-px bg-slate-300"></div> {/* Divisor Vertical */}
                      <div className="flex items-center gap-1.5" title="Memória">
                        <FaMemory className="w-4 h-4 text-slate-400" />
                        <span className="text-xs">{pc.memoria}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Armazenamento">
                        <MdStorage className="w-4 h-4 text-slate-400" />
                        <span className="text-xs">{pc.armazenamento}</span>
                      </div>
                    </div>
                  </td>

                  {/* 5. Localização Hierárquica (Sem ícone gigante) */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{estacao.setor}</span>
                      <div className="flex items-center gap-1 text-[14px] text-slate-500">
                        <BiMap className="w-5 h-5" />
                        {estacao.localizacao}
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 align-middle text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.style}`}>
                      {statusInfo.label}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação mantida, apenas ajuste as bordas para combinar */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
        <div className="flex justify-between items-center w-full mt-6 pt-4 border-t border-slate-200">
          <div className="text-[0.875rem] text-[#64748b] flex-1">
            Página {currentPage} de {totalPages || 1}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-medium"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-medium"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}