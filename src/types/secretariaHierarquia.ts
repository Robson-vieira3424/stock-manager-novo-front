import { Departamento } from "./departamento";

export type SecretariaHierarquia = {
    id:number;
    nomeSecretaria:string;
    departamentos: Departamento[];
}

