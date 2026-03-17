import { useState, useEffect } from "react";
import { FiCpu } from "react-icons/fi";
import { BiMap } from "react-icons/bi";
import { FaMemory } from "react-icons/fa";
import { MdStorage } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/services/api";

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
      const result = response.data;
      setData(result);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

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

  // --- Helpers de Estilo ---

  const getTipoComputador = (modelo: string = "") => {
    const mod = modelo.toLowerCase();
    // Diminuído o px, py, text e min-w
    const baseStyle =
      "px-[8px] py-[2px] border min-w-[140px] flex flex-wrap rounded-[16px] justify-center text-[14px] font-normal m-0 ";

    if (mod.includes("xps")) {
      return {
        label: "Dell XPS",
        style: baseStyle + "border-[#39d6f2] text-[#39d6f2] bg-[#e6f8fb]",
      };
    }
    if (mod.includes("all-in-one")) {
      return {
        label: "All-in-One",
        style: baseStyle + "border-[#0080ff] text-[#0080ff] bg-[#deeeff]",
      };
    }
    if (mod.includes("thinkcentre") || mod.includes("lenovo")) {
      return {
        label: "ThinkCentre",
        style: baseStyle + "border-[#ef4444] text-[#ef4444] bg-[#ffd8d2]",
      };
    }
    return {
      label: "Genérico",
      style: baseStyle + "border-[#a855f7] text-[#a855f7] bg-[#f6eefe]",
    };
  };

  const getStatusStyle = (status: string = "") => {
    const s = status.trim().toUpperCase();
    // Diminuído o px, py, text e min-w
    const baseStyle =
      "px-[12px] py-[2px] border min-w-[90px] inline-flex flex-wrap rounded-[16px] justify-center text-[12px] font-medium mx-auto ";

    if (s === "ATIVO" || s === "EM_USO" || s === "EM__USO") {
      return {
        label: "Em Uso",
        style: baseStyle + "text-[#10b981] border-[#10b981] bg-[#d1fae5]",
      };
    }
    if (s === "MANUTENCAO" || s === "EM MANUTENÇÃO") {
      return {
        label: "Manutenção",
        style: baseStyle + "text-[#f59e0b] border-[#f59e0b] bg-[#fef3c7]",
      };
    }
    if (s === "INATIVO" || s === "DEFEITO") {
      return {
        label: "Defeito",
        style: baseStyle + "text-[#ef4444] border-[#ef4444] bg-[#fee2e2]",
      };
    }
    return {
      label: "Disponível",
      style: baseStyle + "text-[#60a5fa] border-[#60a5fa] bg-[#e0f2fe]",
    };
  };

  if (loading && data.length === 0) {
    return <div className="p-10 text-center text-slate-500 font-sans">Carregando dados...</div>;
  }

  return (
    <section className="shadow-[0px_10px_30px_rgba(0,0,0,0.1)] w-full mx-auto my-8 rounded-2xl animate-tableFadeIn font-sans bg-white">

      {/* Header Visual */}
      <section className="flex justify-between items-center mx-auto h-[5.5rem] w-[96.5%]">
        <h1 className="text-[1.4rem] capitalize font-semibold text-gray-800">
          Estações de Trabalho
        </h1>
      </section>

      {/* Container da Tabela com Borda e Sombra Interna */}
      <section className="w-[96.5%] mx-auto mb-0 border border-black/5 rounded-xl overflow-hidden shadow-sm">
        <Table className="w-[99%] bg-[#F2F4F6] border-separate border-spacing-0">
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="px-3 py-4 text-gray-600 font-medium text-[16px] border-b border-black/5 text-center">
                Patrimônio
              </TableHead>
              <TableHead className="px-3 py-4 text-gray-600 font-medium text-[16px] border-b border-black/5 text-center">
                Equipamento
              </TableHead>
              <TableHead className="px-3 py-4 text-gray-600 font-medium text-[16px] border-b border-black/5 text-center">
                Tipo
              </TableHead>
              <TableHead className="px-3 py-4 text-gray-600 font-medium text-[16px] border-b border-black/5 text-center">
                Componentes
              </TableHead>
              <TableHead className="px-3 py-4 text-gray-600 font-medium text-[16px] border-b border-black/5 text-center w-[250px]">
                Localização
              </TableHead>
              <TableHead className="px-3 py-4 text-gray-600 font-medium text-[16px] border-b border-black/5 text-center w-[120px]" >
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.map((estacao) => {
              const pc = estacao.computador;
              if (!pc) return null;

              const tipoInfo = getTipoComputador(pc.modelo);
              const statusInfo = getStatusStyle(pc.statusEquipamento);

              return (
                <TableRow
                  key={estacao.id}
                  className="bg-white transition-all hover:bg-gray-50/50 hover:scale-[1.001] border-none"
                >
                  {/* 1. Patrimônio */}
                  <TableCell className="p-4 text-sm text-center border-b border-black/5 font-semibold text-[#0066ffda] align-middle">
                    {pc.patrimonio}
                  </TableCell>

                  {/* 2. Equipamento */}
                  <TableCell className="p-4 align-middle border-b border-black/5">
                    <div className="flex flex-col gap-[6px] items-center text-center">
                      <div className="font-semibold text-black/90 text-[14px]">
                        {pc.nome}
                      </div>
                      <div className="font-medium text-black/50 text-[13px]">
                        {pc.modelo}
                      </div>
                    </div>
                  </TableCell>

                  {/* 3. Tipo */}
                  <TableCell className="p-2 align-middle border-b border-black/5">
                    <div className="flex justify-center">
                      <section className={tipoInfo.style}>
                        {tipoInfo.label}
                      </section>
                    </div>
                  </TableCell>

                  {/* 4. Componentes */}
                  <TableCell className="p-4 align-middle border-b border-black/5">
                    <div className="flex flex-col gap-[6px] items-center">
                      <div className="w-full text-black/90 text-[13px] font-medium flex justify-center items-center gap-[4px]">
                        <FiCpu fontSize={14} color="rgba(0, 0, 0, 0.5)" />
                        {pc.processador}
                      </div>
                      <div className="flex text-[13px] font-medium text-black/80 items-center justify-center gap-[6px] w-full">
                        <FaMemory fontSize={14} color="rgba(0, 0, 0, 0.5)" />
                        {pc.memoria}
                        <MdStorage fontSize={14} color="rgba(0, 0, 0, 0.5)" className="ml-1" />
                        {pc.armazenamento}
                      </div>
                    </div>
                  </TableCell>

                  {/* 5. Localização */}
                  <TableCell className="p-4 align-middle border-b border-black/5">
                    <div className="flex flex-col gap-[2px] items-center text-center">
                      <div className="font-semibold text-gray-800 text-[14px]">
                        {estacao.secretaria || "-"}
                      </div>
                      <div className="font-medium text-gray-500 text-[13px]">
                        {estacao.setor || "-"}
                      </div>
                    </div>
                  </TableCell>

                  {/* 6. Status */}
                  <TableCell className="p-4 text-center align-middle border-b border-black/5">
                    <div className={statusInfo.style}>
                      {statusInfo.label}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      {/* Paginação Estilo Controle de Estoque */}
      <div className="flex justify-between items-center w-[96.5%] mx-auto p-4 bg-white mt-0 mb-4 rounded-b-2xl">

        {/* Info de registros */}
        <div className="text-sm text-gray-500 font-medium">
          Mostrando {currentData.length === 0 ? 0 : startIndex + 1} a {Math.min(endIndex, data.length)} de {data.length} estações
        </div>

        {/* Botões */}
        <div className="flex items-center gap-4">
          <button
            disabled={currentPage === 1 || loading}
            onClick={goToPreviousPage}
            className="px-4 py-1.5 border border-black/20 rounded-md text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-700"
          >
            Anterior
          </button>

          <span className="text-sm text-gray-600 font-medium min-w-[80px] text-center">
            {currentPage} de {totalPages === 0 ? 1 : totalPages}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            onClick={goToNextPage}
            className="px-4 py-1.5 border border-black/20 rounded-md text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-700"
          >
            Próxima
          </button>
        </div>
      </div>

    </section>
  );
}