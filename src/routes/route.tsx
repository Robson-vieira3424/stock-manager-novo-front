import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "@/pages/public/Login"
import PrivateRoutes from "./private"
import DefaultLayout from "../layouts/defaultLayout"
import RotaProtegida from "../componentsRob/RotaProtegida/RotaProtegida"

import DashboardPage from "@/pages/protected/dashboard/Dashboard"
import ComputadoresPage from "@/pages/protected/computadores/Computadores"
import MovimentacoesPage from "@/pages/protected/movimentacoes/Movimentacoes"
import MapeamentoPage from "@/pages/protected/mapeamento/Mapeamento"
import ManutencaoPage from "@/pages/protected/manutencao/Manutencao"
import EstoquePage from "@/pages/protected/estoque/Estoque"
import DetalhesSecretaria from "@/pages/protected/detalheSec/DetalhesSec"
import FeedbackPage from "@/pages/protected/feedback/Feedback"
import ConfiguracoesPage from "@/pages/protected/configuracoes/ConfiguracoesPage"
import ResetPassword from "@/pages/public/ResetPassword"
import RecuperarSenha from "@/pages/public/ResetPassword"
import AcessoNegado from "@/pages/public/AcessoNegado"
import NotFound from "@/pages/public/NotFound"

const TODOS = ["ROLE_ADMIN", "ROLE_ESTOQUISTA", "ROLE_TECNICO", "ROLE_SUPERVISOR"];
const SO_ADMIN = ["ROLE_ADMIN"];
const ESTOQUE = ["ROLE_ADMIN", "ROLE_ESTOQUISTA"];
const MANUTENCAO = ["ROLE_ADMIN", "ROLE_TECNICO"];
const DASHBOARD = ["ROLE_ADMIN", "ROLE_ESTOQUISTA", "ROLE_SUPERVISOR"];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  
  {
    path: "/resetpassword",
    element: <RecuperarSenha />,
  },
  {
    element: (
      <PrivateRoutes>
        <DefaultLayout />
      </PrivateRoutes>
    ),
    children: [
      // ── Todos os perfis ──────────────────────────────
      {
  path: "/dashboard",
  element: (
    <RotaProtegida permissoesPermitidas={DASHBOARD}>
      <DashboardPage />
    </RotaProtegida>
  ),
},
      
      {
        path: "/feedbacks",
        element: <FeedbackPage />,
      },

      // ── Admin + Estoquista ───────────────────────────
      {
        path: "/produtos",
        element: (
          <RotaProtegida permissoesPermitidas={ESTOQUE}>
            <EstoquePage />
          </RotaProtegida>
        ),
      },
      {
        path: "/movimentacoes",
        element: (
          <RotaProtegida permissoesPermitidas={ESTOQUE}>
            <MovimentacoesPage />
          </RotaProtegida>
        ),
      },

      // ── Admin + Técnico ──────────────────────────────
      {
        path: "/manutencao",
        element: (
          <RotaProtegida permissoesPermitidas={MANUTENCAO}>
            <ManutencaoPage />
          </RotaProtegida>
        ),
      },
      {
        path: "/computadores",
        element: (
          <RotaProtegida permissoesPermitidas={MANUTENCAO}>
            <ComputadoresPage />
          </RotaProtegida>
        ),
      },

      // ── Só Admin ────────────────────────────────────
      {
        path: "/configuracoes",
        element: (
          <RotaProtegida permissoesPermitidas={SO_ADMIN}>
            <ConfiguracoesPage />
          </RotaProtegida>
        ),
      },
      {
        path: "/mapeamento",
        element: (
          <RotaProtegida permissoesPermitidas={SO_ADMIN}>
            <MapeamentoPage />
          </RotaProtegida>
        ),
      },
      {
        path: "/mapeamento/:id",
        element: (
          <RotaProtegida permissoesPermitidas={SO_ADMIN}>
            <DetalhesSecretaria />
          </RotaProtegida>
        ),
      },
     {
  path: "/sem-acesso",
  element: <AcessoNegado />,
},
    ],
  },
  {
  path: "*",
  element: <NotFound/>,
},
]);

const Routers = () => <RouterProvider router={router} />;

export default Routers;