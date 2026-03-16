import FormAddUser from "@/componentsRob/Forms/PainelFormAddUser";
import PageHeader from "@/componentsRob/Globals/PageHeader";
import { Settings2 } from "lucide-react";

export default function ConfiguracoesPage(){
    return(
        <>
            <PageHeader title="Configurações" description="Gerencie as configurações do sistema" icon={Settings2}/>

            <FormAddUser/>
        </>
    )
}