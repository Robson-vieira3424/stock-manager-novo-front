import { LucideIcon } from "lucide-react";
import AddButton from "./AddButton";

interface propsPageHeader {
    icon: LucideIcon;
    title: string;
    description: string;
    buttonText: string
    onClickButtonHeader: () => void;
}
export default function PageHeader({ icon: Icon, title, description, buttonText, onClickButtonHeader }: propsPageHeader) {
    return (
        <div className="flex  gap-3 w-full pb-6 justify-between items-center" >



            <div className="flex flex-row gap-2 items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#0080FF]
 rounded-xl text-[#ffffff]"><Icon /></div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {title}
                    </h1>
                    <p className="text-md text-slate-500 font-normal">
                        {description}
                    </p>
                </div>
            </div>



            <div onClick={onClickButtonHeader}><AddButton variant="blue" text={buttonText} /></div>

        </div>
    )
}