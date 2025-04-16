
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cadastro from "./pages/Cadastro";
import CadastroTutor from "./pages/CadastroTutor";
import CadastroOrganizacao from "./pages/CadastroOrganizacao";
import CadastroOngOrganizacao from "./pages/CadastroOngOrganizacao";
import CadastroPet from "./pages/CadastroPet";
import ListaONGs from "./pages/ListaONGs";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MutiroesDisponiveis from "./pages/MutiroesDisponiveis";
import DashboardOrganizacao from "./pages/DashboardOrganizacao";
import CadastroMutirao from "./pages/CadastroMutirao";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/cadastro/tutor" element={<CadastroTutor />} />
              <Route path="/cadastro/organizacao" element={<CadastroOrganizacao />} />
              <Route path="/cadastro/ong" element={<CadastroOngOrganizacao />} />
              <Route path="/cadastro/pet" element={<CadastroPet />} />
              <Route path="/cadastro/mutirao" element={<CadastroMutirao />} />
              <Route path="/ongs" element={<ListaONGs />} />
              <Route path="/mutiroes" element={<MutiroesDisponiveis />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/organizacao" element={<DashboardOrganizacao />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
