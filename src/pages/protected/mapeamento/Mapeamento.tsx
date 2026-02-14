import FormSecretaria from "@/componentsRob/Forms/FormSecretaria";
import PageHeader from "@/componentsRob/Globals/PageHeader";

import { MapPinned } from "lucide-react";
import { useState } from "react";

export default function MapeamentoPage() {
    const [IsformOpen, setIsFormOpen] = useState(false);
    return (<>
        <PageHeader
            icon={MapPinned}
            buttonText="Adicionar"
            title="Mapeamento"
            description="Visualize o inventário de equipamentos por secretaria e departamento"
            onClickButtonHeader={() => setIsFormOpen(!IsformOpen)} />

        {IsformOpen && (
            <div className="w-full flex items-start justify-center pt-8">
                <FormSecretaria onClose={() => setIsFormOpen(false)} />
            </div>)}

    </>
    )
}