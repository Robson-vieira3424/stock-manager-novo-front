interface TitleProps{
    nome:string;
}
export default function HeaderSecId({nome}:TitleProps){
    return(
        <section className="w-full flex flex-col gap-2">
            <h1 className="font-bold text-3xl">{nome}</h1>
            <p className="text-gray-500">Gerencie computadores e equipamentos por sala</p>
        </section>
    )
}