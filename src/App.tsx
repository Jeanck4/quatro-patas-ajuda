
/**
 * App.tsx
 * 
 * Componente principal da aplicação que configura o roteamento e os provedores contextuais.
 * Este componente é responsável por:
 * - Configurar o cliente de consultas (QueryClient) para o React Query
 * - Configurar o roteamento com React Router
 * - Fornecer o contexto de autenticação para toda a aplicação
 * - Configurar os provedores de componentes como tooltips e toasts
 */

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import Cadastro from "./pages/Cadastro";
import CadastroTutor from "./pages/CadastroTutor";
import CadastroOrganizacao from "./pages/CadastroOrganizacao";
import CadastroPet from "./pages/CadastroPet";
import ListaOrganizacoes from "./pages/ListaOrganizacoes";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MutiroesDisponiveis from "./pages/MutiroesDisponiveis";
import DashboardOrganizacao from "./pages/DashboardOrganizacao";
import CadastroMutirao from "./pages/CadastroMutirao";
import AgendarCastracao from "./pages/AgendarCastracao";

// Cria uma nova instância do QueryClient para gerenciar o estado das consultas
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/cadastro/tutor" element={<CadastroTutor />} />
              <Route path="/cadastro/organizacao" element={<CadastroOrganizacao />} />
              <Route path="/cadastro/pet" element={<CadastroPet />} />
              <Route path="/cadastro/mutirao" element={<CadastroMutirao />} />
              <Route path="/organizacoes" element={<ListaOrganizacoes />} />
              <Route path="/mutiroes" element={<MutiroesDisponiveis />} />
              <Route path="/agendar/:mutiraoId" element={<AgendarCastracao />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/organizacao" element={<DashboardOrganizacao />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
