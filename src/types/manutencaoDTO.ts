import { ComputadorDTO } from "./computadorDTO"

export type manutecaoDTO = {
    id: number; 
    pc: ComputadorDTO;
    descricaoProblema: string;
    tipo: string;
    prioridade: "ALTA" | "MEDIA" | "BAIXA";
    status: "ANDAMENTO" | "PECAS" | "PRONTO" | "BAIXADO"; 
    pecasUtilizadas: string[];
    observacao: string;
    dataPrevisao: string;
    tecnicoId: number;
    nomeTecnico:string;
}