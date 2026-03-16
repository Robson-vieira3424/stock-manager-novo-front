import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
    permissoesPermitidas: string[];
}

export default function RotaProtegida({ children, permissoesPermitidas }: Props) {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    const permissao = userData?.permissao ?? "";

    if (!permissoesPermitidas.includes(permissao)) {
        return <Navigate to="/sem-acesso" replace />;
    }

    return <>{children}</>;
}