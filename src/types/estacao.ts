export interface Estacao {
    idEstacao: number;
    localizacao: string;
    nomeComputador: string; 
    processador: string;    
    patrimonio?: string;    
    status?: string;
    dataUltimaManutencao?: string;
}