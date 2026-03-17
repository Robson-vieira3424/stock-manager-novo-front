import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor, Cpu, MapPin } from "lucide-react";
import { Departamento } from "@/types/departamento";

interface PcLocalProps {
  departamento: Departamento;
}

// ✅ 1. Função FORA do componente
const getStatusBadge = (status: string) => {
  const s = status?.toUpperCase() || "";

  const formatLabel = (s: string) => {
    const labels: Record<string, string> = {
      DISPONIVEL: "Disponível",
      EM_USO: "Em Uso",
      DEFEITO: "Defeito",
      MANUTENCAO: "Manutenção",
    };
    return labels[s] ?? s;
  };

  const label = formatLabel(s);

  if (s === "EM_USO") return { style: "text-green-700 bg-green-100", label };
  if (s === "MANUTENCAO")
    return { style: "text-yellow-700 bg-yellow-100", label };
  if (s === "DEFEITO") return { style: "text-red-700 bg-red-100", label };
  if (s === "DISPONIVEL") return { style: "text-blue-700 bg-blue-100", label };
  return { style: "text-gray-700 bg-gray-100", label };
};

export default function PcLocal({ departamento }: PcLocalProps) {
  return (
    <Card className="w-full md:w-[48%] lg:w-[30%] h-fit">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="flex flex-shrink-0 h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Monitor className="h-6 w-6" />
        </div>
        <section className="flex-1 min-w-0">
          <CardTitle className="text-lg uppercase truncate">
            {departamento.nomeDepartamento}
          </CardTitle>
          <CardDescription>
            {departamento.estacoes.length} computador(es)
          </CardDescription>
        </section>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-4">
        {departamento.estacoes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center italic py-2">
            Nenhum equipamento neste setor.
          </p>
        ) : (
          departamento.estacoes.map((estacao) => {
            // ✅ 2. badge declarado AQUI dentro do map, antes do return
            const badge = getStatusBadge(estacao.status ?? "");

            return (
              <div
                key={estacao.idEstacao}
                className="border border-zinc-200 rounded-md overflow-hidden bg-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/20"
              >
                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-3 overflow-hidden">
                      <div className="mt-1 flex-shrink-0">
                        <Monitor className="h-5 w-5 text-zinc-500" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-semibold text-sm mb-2 truncate text-zinc-800"
                          title={estacao.nomeComputador}
                        >
                          {estacao.nomeComputador || "Sem Nome"}
                        </p>
                        <div className="flex flex-col gap-1 text-xs text-zinc-500">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {estacao.processador || "Proc. N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {estacao.localizacao}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ✅ 3. Agora usa o badge dinâmico */}
                    <span
                      className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-200"></div>

                <div className="flex justify-between items-center bg-zinc-50/50 p-2 px-3 text-xs text-zinc-500">
                  <span className="font-medium">
                    ID:{" "}
                    <span className="text-zinc-700">{estacao.idEstacao}</span>
                  </span>
                  <span>
                    Manut:{" "}
                    <span className="text-zinc-700">
                      {estacao.dataUltimaManutencao ?? "--/--/--"}
                    </span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
