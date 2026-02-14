import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant;
}

export default function AddButton({ text, variant , ...props }: AddButtonProps) {
  return (
    <Button variant={variant} className="flex items-center gap-2 hover:cursor-pointer" {...props}>
      <FiPlus size={18} />
      {text}
    </Button>
  );
}