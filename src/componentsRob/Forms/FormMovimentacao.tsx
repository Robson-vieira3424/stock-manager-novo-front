import { useState, useEffect, FormEvent } from "react";
import api from "../../services/api"
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface Product {
  id: number;
  name: string;
}

interface Departamento {
  id: number;
  nome: string;
}

interface Secretaria {
  id: number;
  nome: string;
  departamentos: Departamento[];
}

interface FormMovimentsProps {
  onClose: (shouldRefresh?: boolean) => void;
}

export default function FormMoviments({ onClose }: FormMovimentsProps) {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [listSecretarias, setListSecretarias] = useState<Secretaria[]>([]);
  const [departamentosOpcoes, setDepartamentosOpcoes] = useState<Departamento[]>([]);
  
  // Controle de estado para garantir limpeza dos campos
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedSecretariaId, setSelectedSecretariaId] = useState<string>("");
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<string>(""); // Novo estado
  const [tipoMovimentacao, setTipoMovimentacao] = useState("INPUT");

  // 1. Buscar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
       
        const [resProd, resSec] = await Promise.all([
            api.get("/product/select"),
            api.get("/secretaria")
        ]);

        setProductsList(resProd.data); 
        setListSecretarias(resSec.data);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Envio do Formulário
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    
    // Pegando valores
    const currentProductId = form.get("productId");
    const currentAmount = form.get("amount");
    
    // Validação básica
    if (!currentProductId || !currentAmount) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    if (tipoMovimentacao === "OUTPUT" && !selectedSecretariaId) {
       alert("Para saídas, a secretaria é obrigatória.");
       return;
    }

   const payload = {
      productId: Number(selectedProductId), // Pega do Estado
      type: tipoMovimentacao,               // Pega do Estado
      amount: Number(currentAmount),        // Pega do Input Nativo
      secretariaId: selectedSecretariaId ? Number(selectedSecretariaId) : null,
      departamentoId: selectedDepartamentoId ? Number(selectedDepartamentoId) : null,
      observacao: form.get("observacao") as string,
    };

    try {
      await api.post("/moviments", payload);

      alert("Movimentação registrada com sucesso!");
      onClose(true); // Fecha e avisa para atualizar a lista
      
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao salvar. Verifique se você tem permissão ou se os dados estão corretos.");
    }
  };

  // Handler para mudança de secretaria (Limpa o departamento)
  const handleSecretariaChange = (value: string) => {
    const novoId = value; // O valor já vem pronto aqui
    setSelectedSecretariaId(novoId);
    
    // Reseta o departamento ao trocar a secretaria
    setSelectedDepartamentoId(""); 
    
    // Busca os departamentos da secretaria selecionada
    const sec = listSecretarias.find(s => s.id.toString() === novoId);
    setDepartamentosOpcoes(sec ? sec.departamentos : []);
}

  // Classes reutilizáveis para manter o código limpo
  const labelClass = "block text-sm font-semibold text-gray-800 mb-1";
  const inputClass = "w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-lg mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6 font-sans"
    >
      <fieldset className="flex flex-col gap-4">
        <legend className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 w-full">
          Nova Movimentação
        </legend>

        {/* PRODUTO (Ocupa toda a largura) */}
       <div className="w-full">
          <label className={labelClass}>Produto</label>
          <Select 
            value={selectedProductId} 
            onValueChange={setSelectedProductId}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent>
              {productsList.map((prod) => (
                <SelectItem key={prod.id} value={prod.id.toString()}>
                  {prod.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Grid para Tipo e Quantidade (2 colunas) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tipo</label>
            <Select 
              value={tipoMovimentacao} 
              onValueChange={setTipoMovimentacao}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INPUT">Entrada</SelectItem>
                <SelectItem value="OUTPUT">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelClass}>Quantidade</label>
            <Input
              type="number"
              name="amount"
              min="1"
              required
              className="bg-white"
              placeholder="0"
            />
          </div>
        </div>

        {/* Condicional para SAÍDA (Grid de 2 colunas) */}
        {tipoMovimentacao === "OUTPUT" && (
          <div className="grid grid-cols-2 gap-4 animate-fadeIn">
            <div>
              <label className={labelClass}>Secretaria</label>
              <Select 
                value={selectedSecretariaId} 
                onValueChange={handleSecretariaChange}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecione uma secretaria" />
                </SelectTrigger>
                <SelectContent>
                  {listSecretarias.map((sec) => (
                    <SelectItem key={sec.id} value={sec.id.toString()}>
                      {sec.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* --- DEPARTAMENTO (Shadcn Select) --- */}
            <div>
              <label className={labelClass}>Departamento</label>
              <Select
                value={selectedDepartamentoId}
                onValueChange={setSelectedDepartamentoId}
                disabled={!selectedSecretariaId}
              >
                <SelectTrigger className={`w-full ${!selectedSecretariaId ? 'bg-gray-100' : 'bg-white'}`}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {departamentosOpcoes.map((dep) => (
                    <SelectItem key={dep.id} value={dep.id.toString()}>
                      {dep.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
          
      

        {/* OBSERVAÇÃO */}
        <div className="w-full">
          <label className={labelClass}>Observações (opcional)</label>
          <Input
            type="text"
            name="observacao"
            placeholder="Digite detalhes..."
            className="bg-white"
          />
        </div>

        {/* BOTÕES */}
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="flex-1 py-2.5 bg-gray-50 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors hover:cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:cursor-pointer"
          >
            Registrar
          </button>
        </div>

      </fieldset>
    </form>
  );
}