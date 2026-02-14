import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import api from "../../services/api"


// No Vite, garanta que as fontes estejam instaladas: npm install @fontsource/roboto
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import formatarData from "@/utils/formatDate";

type Produto = {
  id?: number;
  name: string;
  quantity: number;
  min: number;
  ultimaAtualizacao: string;
  status?: string;
  categoria?: string;
};

export default function ProductTable() {
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const PAGE_SIZE = 15;
 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getProdutos();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [pagina]); 

  const getProdutos = async () => {
    setIsLoading(true);
   try {
      const response = await api.get("/product", {
        params: {
          size: PAGE_SIZE
        }
      });

      const data = response.data;
      setListaProdutos(data.content || []);
      setTotalPaginas(data.totalPages || 0);

    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const getStatusLabel = (qtd: number, min: number, statusBackend?: string) => {
    if (statusBackend) return statusBackend.replace("_", " ");
    if (qtd === 0) return "Sem Estoque";
    if (qtd <= min) return "Estoque Baixo";
    return "Em Estoque";
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Em Estoque": return "bg-[#0dbe0d] text-[#e1f0e7]";
      case "Estoque Baixo": return "bg-[#ff9100] text-[#e1f0e7]";
      case "Sem Estoque": return "bg-[#ff3737] text-[#e1f0e7]";
      default: return "bg-gray-500 text-white";
    }
  };


  if (isLoading) return <div className="p-10 font-sans">Carregando...</div>;

  return (
    <section className="shadow-[0px_10px_30px_rgba(0,0,0,0.1)] w-full mx-auto my-8 rounded-2xl animate-tableFadeIn font-sans">

      {/* Header */}
      <section className="flex justify-between items-center mx-auto h-[5.5rem] w-[96.5%]">
        <h1 className="text-[1.4rem] capitalize font-semibold">Controle de Estoque</h1>
        <input
          className=" border w-80 px-4 py-2 rounded-lg focus:outline focus:outline-2 focus:outline-blue-500 transition-all"
          type="text"
          placeholder="Buscar produtos"
        />
      </section>

      {/* Tabela */}
      <section className="w-[96.5%] mx-auto mb-4 border border-black/5 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-separate border-spacing-0 bg-[#F2F4F6]">
          <thead className="bg-white">
            <tr>
              {["Item", "Categoria", "Quantidade", "Estoque Min", "Status", "Atualização", "Ações"].map((h) => (
                <th key={h} className="px-3 py-4 text-gray-600 font-medium text-[16px] border-b border-black/5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listaProdutos.map((item, index) => {
              const currentStatus = getStatusLabel(item.quantity, item.min, item.status);
              return (
                <tr
                  key={item.id || index}
                  className="bg-white transition-all hover:bg-gray-50/50 hover:scale-[1.001] animate-rowFadeIn"
                >
                  <td className="p-4 text-sm text-center  font-semibold text-black/90">{item.name}</td>
                  <td className="p-4 text-sm text-center  text-gray-600">{item.categoria || "Geral"}</td>
                  <td className="p-4 text-sm text-center ">{item.quantity}</td>
                  <td className="p-4 text-sm text-center ">{item.min}</td>
                  <td className="p-4 text-center  align-middle ">
                    <span className={` px-3 py-1 rounded-full max-w-30 inline-flex justify-center  font-bold text-[10px] uppercase ${getStatusStyles(currentStatus)}`}>
                      {currentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-center border-b border-black/5 text-black/50">{formatarData(item.ultimaAtualizacao)}</td>
                  <td className="p-4 border-b border-black/5">
                    <div className="flex gap-2 justify-center">
                      <button className="p-2 rounded hover:bg-gray-200 transition-colors"><FiEdit /></button>
                      <button className="p-2 rounded hover:bg-red-100 hover:text-red-600 transition-colors"><RiDeleteBin6Line /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Paginação */}
      <div className="flex justify-end items-center gap-4 p-4 border-t border-black/5">
        <button
          disabled={pagina === 0}
          onClick={() => setPagina(pagina - 1)}
          className="px-4 py-1 border border-black/20 rounded text-sm font-medium disabled:opacity-30 hover:bg-gray-50"
        >
          Anterior
        </button>
        <span className="text-xs text-gray-500 font-medium">
          {pagina + 1} de {totalPaginas}
        </span>
        <button
          disabled={pagina + 1 >= totalPaginas}
          onClick={() => setPagina(pagina + 1)}
          className="px-4 py-1 border border-black/20 rounded text-sm font-medium disabled:opacity-30 hover:bg-gray-50 mr-4"
        >
          Próxima
        </button>
      </div>
    </section>
  );
}