import { Departamento } from "./departamento";

export type Secretaria = {
    id:number;
    nomeSecretaria:string;
    departamentos: Departamento[];
}


