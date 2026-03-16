
export function usePermissao() {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    const permissao: string = userData?.permissao ?? "";

    return {
        permissao,
        isAdmin: permissao === "ROLE_ADMIN",
        isEstoquista: permissao === "ROLE_ESTOQUISTA",
        isTecnico: permissao === "ROLE_TECNICO",
        isSupervisor: permissao === "ROLE_SUPERVISOR",
    };
}