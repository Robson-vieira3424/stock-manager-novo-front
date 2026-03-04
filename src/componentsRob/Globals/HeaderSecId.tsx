import AddButton from "./AddButton";

interface TitleProps{
    nome:string;
    onAddClick: () => void;
}
export default function HeaderSecId({ nome, onAddClick }:TitleProps){
    return(
        <section className="w-full flex gap-2 justify-between">
            <div className="flex flex-col">
            <h1 className="font-bold text-3xl">{nome}</h1>
            <p className="text-gray-500">Gerencie computadores e equipamentos por sala</p>
            </div>

            <div onClick={onAddClick}><AddButton variant="blue" text={"Adicionar Departamento"} /></div>

        </section>
    )
}