import React from "react";

interface CardProps {
  icon: React.ReactNode;
  quantity: string | number;
  subtitle: string;
  bgColor: string; // Ex: "#E5F2FF"
}

export default function CardComputador({
  icon,
  quantity,
  subtitle,
  bgColor,
}: CardProps) {
  return (
    <div
      className="
     
        flex flex-row items-center justify-start gap-[15px]
        w-full md:w-1/4 min-h-[110px]
        pl-[15px] py-[10px]
        rounded-[15px]
        bg-white border border-transparent
        
        
        shadow-[1px_1px_8px_rgba(0,0,0,0.32)]
        transition-all duration-250 ease-out
        
        /* Efeitos de Hover (.card__computador:hover) */
        hover:-translate-y-1.5 
        hover:shadow-[2px_6px_14px_rgba(173,216,230,0.55)]
      "
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-[10px] shrink-0 text-black/60"
        style={{ backgroundColor: bgColor }} 
      >
        {icon}
      </div>

      <div className="flex flex-col h-[55px] justify-center">
        <p className="m-0 text-[14px] text-black/60">
          {subtitle}
        </p>
        <p className="m-0 text-[26px] font-bold leading-none text-gray-800">
          {quantity}
        </p>
               
      </div>
    </div>
  );
}