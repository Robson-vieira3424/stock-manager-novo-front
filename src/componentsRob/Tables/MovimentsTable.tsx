import formatarData from "@/utils/formatDate";
import { FileEdit } from "lucide-react";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import api from "../../services/api"
type Movimentacao = {
  id: number;
  moveDate: string;
  type: string;
  productName: string | number;
  categoria: string;
  amount: string | number;
  departamentoId: number;
  observacao: string;
  termo: string;
  destinoFormatado: string; 
};

export default function MovimentsTable() {
  const [listaMovimentacoes, setListaMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovimentacoes = async () => {
    try {
      // Substituindo Axios por Fetch
      const response = await api.get("/moviments");

      

      const data = await response.data;
      setListaMovimentacoes(data);
      console.log(data);
    } catch (error) {
      console.error("Erro ao buscar movimentacoes:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  return (
    <>

      <section className="mx-auto my-8 flex w-full flex-col rounded-[10px] border border-transparent shadow-[3px_5px_14px_rgba(0,0,0,0.185)]">

        {/* Header da Tabela */}
        <section className="flex w-full flex-row justify-between px-[30px] py-[15px]">
          <h1 className="m-0 p-0 text-[1.4rem] font-semibold capitalize">
            histórico de movimentações
          </h1>
          <input
            type="text"
            className="w-80 rounded-lg border border-black/10 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Buscar movimentações"
          />
        </section>

        {/* Container da Tabela */}
        <section className="mx-auto mb-4 flex w-[96.5%] flex-col justify-center overflow-hidden rounded-xl border border-black/[0.02]">
          <table className="w-full border-separate border-spacing-0 bg-[#F2F4F6]">
            <thead>
              <tr className="bg-white">
                <th className="border-b border-black/[0.04] px-[10px] py-3 text-center text-[0.95rem] font-semibold text-[#32373D]">Data</th>
                <th className="border-b border-black/[0.04] px-[10px] py-3 text-center text-[0.95rem] font-semibold text-[#32373D]">Item</th>
                <th className="border-b border-black/[0.04] px-[10px] py-3 text-center text-[0.95rem] font-semibold text-[#32373D]">Categoria</th>
                <th className="border-b border-black/[0.04] px-[10px] py-3 text-center text-[0.95rem] font-semibold text-[#32373D]">Tipo</th>
                <th className="border-b border-black/[0.04] px-[10px] py-3 text-center text-[0.95rem] font-semibold text-[#32373D]">Quantidade</th>
                <th className="border-b border-black/[0.04] px-[10px] py-3 text-center text-[0.95rem] font-semibold text-[#32373D]">Destino/Origem</th>
                <th className="border-b border-black/[0.04] px-[10px] py-3 text-center text-[0.95rem] font-semibold text-[#32373D]">Observações</th>
                <th className="border-b border-black/[0.04] px-[10px] py-3 text-center text-[0.95rem] font-semibold text-[#32373D]">Ações</th>
              </tr>
            </thead>

            <tbody>
              {listaMovimentacoes.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="bg-white py-10 text-center text-gray-500">
                    Não há movimentações cadastradas!
                  </td>
                </tr>
              )}

              {listaMovimentacoes.map((item) => (
                <tr
                  key={item.id}
                  className="animate-row-fade bg-white transition-all duration-200 hover:scale-[1.002] hover:bg-white/60"
                >
                  <td className="border-b border-black/[0.03] px-3 py-[15px] text-center text-sm text-[#070707]">{formatarData(item.moveDate)}</td>
                  <td className="border-b border-black/[0.03] px-3 py-[15px] text-center text-sm font-semibold text-[#070707]">{item.productName}</td>
                  <td className="border-b border-black/[0.03] px-3 py-[15px] text-center text-sm text-[#070707]">{item.categoria}</td>
                  <td className="border-b border-black/[0.03] px-3 py-[15px] text-center text-sm text-[#070707]">
                    <span
                      className={`rounded-2xl px-2 py-1 text-xs font-bold ${item.type === "INPUT"
                          ? "bg-[#21C45D] text-[#ffffff]"
                          : "bg-[#0080FF]  text-[#ffffff]"
                        }`}
                    >
                      {item.type === "OUTPUT" ? "SAIDA":"ENTRADA"}
                    </span>
                  </td>
                  <td className="border-b border-black/[0.03] px-3 py-[15px] text-center text-sm text-[#070707]">{item.amount}</td>
                  <td className="border-b border-black/[0.03] px-3 py-[15px] text-center text-sm text-[#070707]">{item.destinoFormatado || "-"}</td>
                  <td className="border-b border-black/[0.03] px-3 py-[15px] text-center text-sm text-[#070707]">{item.observacao || "-"}</td>
                  <td className="border-b border-black/[0.03] px-3 py-[15px] text-center text-sm text-[#070707]">
                    <div className="flex justify-center gap-2">
                      <button className="text-blue-600 transition-colors hover:text-blue-800">
                        <FileEdit size={18} />
                      </button>
                      <button className="text-red-500 transition-colors hover:text-red-700">
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </>
  );
}