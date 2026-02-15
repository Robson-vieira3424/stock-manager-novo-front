"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner"
// Ícones
import api from "@/services/api";
import { FiCpu } from "react-icons/fi";
import { LuBox, LuMonitor } from "react-icons/lu";
import { FaRegHdd } from "react-icons/fa";
import { IoFlashOutline } from "react-icons/io5";
import { BiMap } from "react-icons/bi";
import { CpuIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Produto } from "@/types/produto";

// --- PRESETS E TYPES ---
const PRESETS = {
  allinone: {
    Marca: "Dell",
    Modelo: "All-in-One",
    MarcaMonitor: "Dell",
    Processador: "Intel Core I5-10400",
    Tamanho: "Integrado",
    Memoria: "Memoria Ram - 8 Gb",
    ModeloMonitor: "Integrado",
  },
  lenovo: {
    Marca: "Lenovo",
    Modelo: "ThinkCenter",
    MarcaMonitor: "Lenovo",
    ModeloMonitor: "ThinkVision",
    Tamanho: "24'",
    Processador: "Ryzen 5 5650G",
  },
  dell: {
    Marca: "Dell",
    Modelo: "XPS",
    MarcaMonitor: "Dell",
    ModeloMonitor: "XPS",
    Processador: "NÃO SEI",
    Tamanho: "24'",
  },
  generico: {
    Marca: "",
    Modelo: "",
    MarcaMonitor: "",
    Tamanho: "",
    MarcaEsatbilizador: "",
    Processador: "",
    ModeloMonitor: "",
  },
};

const formSchema = z.object({
  Patrimonio: z.string().min(2, "Mínimo 2 caracteres"),
  Nome: z.string().min(1, "Obrigatório"),
  Marca: z.string().min(3, "Mínimo 3 caracteres"),
  Modelo: z.string().min(3, "Mínimo 3 caracteres"),
  Processador: z.string().min(4, "Mínimo 4 caracteres"),
  Memoria: z.string().min(3, "Selecione a memória"),
  Armazenamento: z.string().min(2, "Obrigatório"),
  tipoArmazenamento: z.enum(["HD", "SSD", "Nvme"], {
    required_error: "Selecione o tipo",
  }),
  sistemaOperacional: z.string().optional(),

  PatrimonioMonitor: z.string().optional(),
  MarcaMonitor: z.string().optional(),
  ModeloMonitor: z.string().optional(),
  TamanhoMonitor: z.string().optional(),

  PatrimonioEstabilizador: z.string().optional(),
  MarcaEsatbilizador: z.string().optional(),
  ModeloEstabilizador: z.string().optional(),
  Potencia: z.string().optional(),

  secretariaId: z.number({ required_error: "Selecione uma secretaria" }),
  setorId: z.number({ required_error: "Selecione um setor" }),

  tipo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Secretaria {
  id: number;
  nome: string;
  departamentos: { id: number; nome: string }[];
}

export default function FormComputadores({ onClose }: { onClose: () => void }) {
  const [cardSelecionado, setCardSelecionado] = useState<string | null>(null);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [setores, setSetores] = useState<{ id: number; nome: string }[]>([]);
  const [memoriasGenericas, setMemoriasGenericas] = useState<Produto[]>([]);
  const [processadoresGenericos, setProcessadoresGenericos] = useState<Produto[]>([]);
  const mostrarPerifericos =
    cardSelecionado !== null && cardSelecionado !== "allinone";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Patrimonio: "",
      Nome: "",
      Marca: "",
      Modelo: "",
      Processador: "",
      Memoria: "",
      Armazenamento: "",
      tipoArmazenamento: undefined,
      sistemaOperacional: undefined,
      secretariaId: undefined,
      setorId: undefined,
    },
  });

 
 useEffect(() => {
    async function carregarSecretarias() {
      try {
        // Axios já retorna o JSON em .data e lança erro se falhar
        const response = await api.get("/secretaria");
        setSecretarias(response.data);
      } catch (error) {
        console.error("Erro ao carregar secretarias", error);
        toast.error("Erro ao carregar secretarias.");
      }
    }
    carregarSecretarias();
    getProcessadoresGenericos();
    getMemoriasGenericas();
  }, []);
  // --- Lógica de Presets ---
  useEffect(() => {
    if (cardSelecionado && PRESETS[cardSelecionado as keyof typeof PRESETS]) {
      const preset = PRESETS[cardSelecionado as keyof typeof PRESETS];

      form.setValue("Marca", preset.Marca);
      form.setValue("Modelo", preset.Modelo);
      form.setValue("Processador", preset.Processador);

      if (cardSelecionado !== "allinone") {
        form.setValue("MarcaMonitor", preset.MarcaMonitor);
        form.setValue("TamanhoMonitor", preset.Tamanho);
        form.setValue("ModeloMonitor", preset.ModeloMonitor);
      }
      form.setValue("tipo", cardSelecionado);
    }
  }, [cardSelecionado, form]);

  async function getMemoriasGenericas() {
    try {
      const response = await api.get("/product/tipoProduto/MEMORIA");
      setMemoriasGenericas(response.data);
    } catch (erro) {
      toast.error("Erro ao buscar memórias.");
      console.log("Erro ao buscar memorias:", erro);
    }
  }
  async function getProcessadoresGenericos() {
    try {
      const response = await api.get("/product/tipoProduto/PROCESSADOR");
      setProcessadoresGenericos(response.data);
    } catch (erro) {
      toast.error("Erro ao buscar processadores.");
      console.log("Erro ao buscar processadores:", erro);
    }
  }
 async function onSubmit(values: FormValues) {
    if (!cardSelecionado) {
      alert("Por favor, selecione o tipo de equipamento (Card) no topo.");
      return;
    }

    const usarEstabilizador = cardSelecionado !== "allinone";

    // ... (Lógica de montagem dos payloads auxiliar permanece igual) ...
    const estabilizadorPayload = usarEstabilizador
      ? {
          patrimonio: values.PatrimonioEstabilizador || "",
          marca: values.MarcaEsatbilizador || "",
          modelo: values.ModeloEstabilizador || "",
          potencia: values.Potencia || "",
        }
      : { patrimonio: "N/A", marca: "N/A", modelo: "N/A", potencia: "" };

    const monitorPayload =
      cardSelecionado === "allinone"
        ? { patrimonio: "Integrado", marca: "Dell", modelo: "Monitor Integrado", tamanho: "24'" }
        : {
            patrimonio: values.PatrimonioMonitor || "",
            marca: values.MarcaMonitor || "",
            modelo: values.ModeloMonitor || "",
            tamanho: values.TamanhoMonitor || "",
          };

    const payload = {
      computador: {
        tipo: cardSelecionado,
        patrimonio: values.Patrimonio,
        nome: values.Nome,
        marca: values.Marca,
        modelo: values.Modelo,
        processador: values.Processador,
        memoria: values.Memoria,
        armazenamento: values.Armazenamento,
        tipoArmazenamento: values.tipoArmazenamento,
        sistemaOperacional: values.sistemaOperacional,
      },
      secretariaId: values.secretariaId,
      departamentoId: values.setorId,
      monitor: monitorPayload,
      estabilizador: estabilizadorPayload,
    };

    try {
      // POST com AXIOS: URL e Payload direto. Sem headers manuais.
      await api.post("/estacao", payload);

      toast.success("Equipamento cadastrado com sucesso!");
      form.reset();
      onClose();

    } catch (error) {
      console.error("Erro ao cadastrar", error);
      
      // Axios coloca a resposta de erro em error.response
      const msgErro = error.response?.data?.message || "Erro ao salvar no servidor.";
      toast.error(msgErro);
    }
  }
  useEffect(() => {
    if (cardSelecionado && PRESETS[cardSelecionado as keyof typeof PRESETS]) {
      const preset = PRESETS[cardSelecionado as keyof typeof PRESETS];

      form.setValue("Marca", preset.Marca);
      form.setValue("Modelo", preset.Modelo);
      form.setValue("Processador", preset.Processador);
      
      // ADICIONE ESSA LINHA ABAIXO:
      // Se o preset tiver memória definida, preenche o campo
      if (preset.Memoria) {
         form.setValue("Memoria", preset.Memoria); 
      }

      if (cardSelecionado !== "allinone") {
        form.setValue("MarcaMonitor", preset.MarcaMonitor);
        form.setValue("TamanhoMonitor", preset.Tamanho);
        form.setValue("ModeloMonitor", preset.ModeloMonitor);
      }
      form.setValue("tipo", cardSelecionado);
    }
  }, [cardSelecionado, form]);

  const inputStyle = "pl-2.5 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:border-transparent focus-visible:shadow-lg transition-all duration-200";
  const selectTriggerStyle = "w-full focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:shadow-lg transition-all duration-200";
  const marcaTravada = cardSelecionado !== null && cardSelecionado !== "generico";
  const processadorTravado = cardSelecionado !== null && cardSelecionado !== "generico";
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[750px] mx-auto bg-white p-8 rounded-xl overflow-y-auto max-h-[85vh] shadow-sm"
      >
        <header className="mb-4">
          <h2 className="font-bold text-xl text-gray-900 m-0">
            Cadastrar Novo Computador
          </h2>
        </header>

        {/* --- SEÇÃO DOS CARDS --- */}
        <div className="flex flex-row flex-wrap gap-3 mb-6 border-b border-black/10 pb-6">
          <div className="w-full font-semibold text-lg mb-2 text-gray-800">
            Tipo de equipamento *
          </div>

          {[
            { id: "allinone", label: "Dell All-in-one", desc: "Computador com monitor embutido", icon: <LuMonitor size={25} /> },
            { id: "lenovo", label: "Lenovo (Combo)", desc: "PC + Monitor + Estabilizador", icon: <LuBox size={27} /> },
            { id: "dell", label: "Dell (Combo)", desc: "PC + Monitor + Estabilizador", icon: <FiCpu size={25} /> },
            { id: "generico", label: "Genérico", desc: "Marcas Diversas", icon: <FaRegHdd size={25} /> },
          ].map((card) => (
            <div
              key={card.id}
              onClick={() => setCardSelecionado(card.id)}
              className={`
                flex flex-row w-full md:w-[47%] p-3 rounded-xl bg-white shadow-sm border border-transparent cursor-pointer
                transition-all duration-200 ease-in-out
                hover:-translate-y-1 hover:shadow-md
                ${cardSelecionado === card.id
                  ? "ring-2 ring-blue-600 ring-offset-2 -translate-y-[2px] shadow-lg"
                  : "shadow-[0_4px_8px_rgba(0,0,0,0.1)]"}
              `}
            >
              <div className="flex items-center text-gray-700">{card.icon}</div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-900">{card.label}</h3>
                <p className="text-xs text-black/50 font-normal">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {cardSelecionado && (
          <>
            {/* --- DADOS DO GABINETE --- */}
            <section className="mt-4">
              <div className="flex flex-row gap-2 mb-4 items-center">
                <CpuIcon size={20} className="text-gray-700" />
                <h2 className="font-semibold text-lg text-gray-800">
                  {cardSelecionado === "allinone" ? "Dados do All-in-One" : "Dados do Gabinete"}
                </h2>
              </div>

              {/* Linha 1 */}
              <div className="flex flex-row flex-wrap gap-5 border-b border-black/10 pb-4 mb-4">
                <FormField control={form.control} name="Patrimonio" render={({ field }) => (
                  <FormItem className="min-w-[48%] flex-1">
                    <FormLabel>Patrimônio *</FormLabel>
                    <FormControl><Input placeholder="Ex: 093744" {...field} className={inputStyle} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="Nome" render={({ field }) => (
                  <FormItem className="min-w-[48%] flex-1">
                    <FormLabel>Nome/Identificação *</FormLabel>
                    <FormControl><Input placeholder="Ex: PC-SETOR-01" {...field} className={inputStyle} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="Marca" render={({ field }) => (
                  <FormItem className="min-w-[48%] flex-1">
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dell" {...field}
                        className={`${inputStyle} ${marcaTravada ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                        disabled={marcaTravada} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="Modelo" render={({ field }) => (
                  <FormItem className="min-w-[48%] flex-1">
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Optiplex" {...field}
                        className={`${inputStyle} ${marcaTravada ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                        disabled={marcaTravada} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField
                  control={form.control}
                  name="Processador"
                  render={({ field }) => (
                    <FormItem className="min-w-[48%] flex-1">
                      <FormLabel>Processador</FormLabel>

                      {cardSelecionado === "generico" ? (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={selectTriggerStyle}>
                              <SelectValue placeholder="Selecione o processador" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white max-h-60">
                            {processadoresGenericos.map((p) => (
                              <SelectItem key={p.name} value={p.name}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input
                            {...field}
                            disabled={processadorTravado}
                            className={`${inputStyle} bg-gray-100 text-gray-500 cursor-not-allowed`}
                            placeholder="Processador"
                          />
                        </FormControl>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
  control={form.control}
  name="Memoria"
  render={({ field }) => (
    <FormItem className="min-w-[48%] flex-1">
      <FormLabel>Memoria Ram</FormLabel>
      
     
      {cardSelecionado === "generico" ? ( 
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger   className={selectTriggerStyle}>
              <SelectValue  placeholder="Selecione a Memoria ram" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="z-[9999] bg-white">
            {memoriasGenericas.map((m) => (
              <SelectItem key={m.name} value={m.name}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
       
        <FormControl>
          <Input 
            {...field} 
            placeholder="Memória do Preset" 
            className={`${inputStyle} bg-gray-100 text-gray-500 cursor-not-allowed`}
            disabled={true} 
          />
        </FormControl>
      )}
      
      <FormMessage />
    </FormItem>
  )}
/>
              </div>

              {/* Linha 2 (Items menores) */}
              <div className="flex flex-row flex-nowrap gap-5 w-full">
                <FormField control={form.control} name="Armazenamento" render={({ field }) => (
                  <FormItem className="w-[30%] flex-1">
                    <FormLabel>Armazenamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={selectTriggerStyle}><SelectValue placeholder="Ex: 256 GB" /></SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="128 GB">128 GB</SelectItem>
                        <SelectItem value="256 GB">256 GB</SelectItem>
                        <SelectItem value="500 GB">500 GB</SelectItem>
                        <SelectItem value="1 TB">1 TB</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="tipoArmazenamento" render={({ field }) => (
                  <FormItem className="w-[30%] flex-1">
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={selectTriggerStyle}><SelectValue placeholder="Tipo" /></SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="HD">HD</SelectItem>
                        <SelectItem value="SSD">SSD</SelectItem>
                        <SelectItem value="Nvme">Nvme</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="sistemaOperacional" render={({ field }) => (
                  <FormItem className="w-[30%] flex-1">
                    <FormLabel>Sistema</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={selectTriggerStyle}><SelectValue placeholder="SO" /></SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem>
                        <SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem>
                        <SelectItem value="Linux">Linux</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </section>
          </>
        )}

        {/* --- DADOS DO MONITOR --- */}
        {mostrarPerifericos && (
          <section className="mt-6">
            <div className="flex flex-row gap-2 mb-4 items-center">
              <LuMonitor size={20} className="text-gray-700" />
              <h2 className="font-semibold text-lg text-gray-800">Dados do Monitor</h2>
            </div>
            <div className="flex flex-row flex-wrap gap-5 border-b border-black/10 pb-4 mb-4">
              <FormField control={form.control} name="PatrimonioMonitor" render={({ field }) => (
                <FormItem className="min-w-[48%] flex-1">
                  <FormLabel>Patrimonio</FormLabel>
                  <FormControl><Input placeholder="Ex: 363828" {...field} className={inputStyle} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="MarcaMonitor" render={({ field }) => (
                <FormItem className="min-w-[48%] flex-1">
                  <FormLabel>Marca</FormLabel>
                  <FormControl><Input placeholder="Ex: Dell" {...field} className={inputStyle} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="ModeloMonitor" render={({ field }) => (
                <FormItem className="min-w-[48%] flex-1">
                  <FormLabel>Modelo</FormLabel>
                  <FormControl><Input placeholder="Ex: P2419H" {...field} className={inputStyle} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="TamanhoMonitor" render={({ field }) => (
                <FormItem className="min-w-[48%] flex-1">
                  <FormLabel>Tamanho</FormLabel>
                  <FormControl><Input placeholder="Ex: 24pol" {...field} className={inputStyle} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>
        )}

        {/* --- DADOS DO ESTABILIZADOR --- */}
        {mostrarPerifericos && (
          <section className="mt-4">
            <div className="flex flex-row gap-2 mb-4 items-center">
              <IoFlashOutline size={20} className="text-gray-700" />
              <h2 className="font-semibold text-lg text-gray-800">Dados do Estabilizador</h2>
            </div>
            <div className="flex flex-row flex-wrap gap-5 border-b border-black/10 pb-4 mb-4">
              <FormField control={form.control} name="PatrimonioEstabilizador" render={({ field }) => (
                <FormItem className="min-w-[48%] flex-1">
                  <FormLabel>Patrimonio</FormLabel>
                  <FormControl><Input placeholder="Ex: 12345" {...field} className={inputStyle} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="MarcaEsatbilizador" render={({ field }) => (
                <FormItem className="min-w-[48%] flex-1">
                  <FormLabel>Marca</FormLabel>
                  <FormControl><Input placeholder="Ex: SMS" {...field} className={inputStyle} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="ModeloEstabilizador" render={({ field }) => (
                <FormItem className="min-w-[48%] flex-1">
                  <FormLabel>Modelo</FormLabel>
                  <FormControl><Input placeholder="Ex: Revolution" {...field} className={inputStyle} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Potencia" render={({ field }) => (
                <FormItem className="min-w-[48%] flex-1">
                  <FormLabel>Potência</FormLabel>
                  <FormControl><Input placeholder="Ex: 600VA" {...field} className={inputStyle} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>
        )}

        {/* --- LOCALIZAÇÃO --- */}
        <section className="mt-4 mb-4">
          <div className="flex flex-row gap-2 mb-4 items-center">
            <BiMap size={20} className="text-gray-700" />
            <h2 className="font-semibold text-lg text-gray-800">Localização</h2>
          </div>
          <div className="flex flex-row flex-wrap gap-5 pb-4">
            <FormField control={form.control} name="secretariaId" 
           render={({ field }) => (
              <FormItem className="min-w-[48%] flex-1">
                <FormLabel>Secretaria *</FormLabel>
                <Select
                value={field.value ? String(field.value) : undefined}
                  onValueChange={(val) => {
                    const id = Number(val);
                    form.setValue("secretariaId", id);
                    const sec = secretarias.find(s => s.id === id);
                    setSetores(sec?.departamentos || []);
                  form.setValue("secretariaId", id, { shouldValidate: true }); // Resetar setor visualmente se necessário ou tratar com undefined
                  }}
                >
                  <FormControl>
                    <SelectTrigger className={selectTriggerStyle}>
                      <SelectValue placeholder="Selecione secretaria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[9999] bg-white max-h-60">
                    {secretarias.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="setorId" render={() => (
              <FormItem className="min-w-[48%] flex-1">
                <FormLabel>Setor *</FormLabel>
                <Select
                  disabled={!setores.length}
                  onValueChange={(val) => form.setValue("setorId", Number(val))}
                >
                  <FormControl>
                    <SelectTrigger className={selectTriggerStyle}>
                      <SelectValue placeholder="Selecione setor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[9999] bg-white max-h-60">
                    {setores.map((setor) => (
                      <SelectItem key={setor.id} value={String(setor.id)}>{setor.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </section>

        {/* --- BOTÕES --- */}
        <div className="flex flex-row gap-4 items-center justify-end w-full mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-black/10 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </Form>
  );
}