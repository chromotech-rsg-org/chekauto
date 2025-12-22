import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { CheckoutProvider } from "./contexts/CheckoutContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import VehicleData from "./pages/VehicleData";
import ClientData from "./pages/ClientData";
import PaymentData from "./pages/PaymentData";
import Confirmation from "./pages/Confirmation";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/admin/Dashboard";
import Perfis from "./pages/admin/Perfis";
import Usuarios from "./pages/admin/Usuarios";
import Produtos from "./pages/admin/Produtos";
import Categorias from "./pages/admin/Categorias";
import Clientes from "./pages/admin/Clientes";
import Solicitacoes from "./pages/admin/Solicitacoes";
import SplitPagamento from "./pages/admin/SplitPagamento";
import Parceiros from "./pages/admin/Parceiros";
import TabelaCatMmv from "./pages/admin/TabelaCatMmv";
import HistoricoSplits from "./pages/admin/HistoricoSplits";
import ConfiguracoesEmail from "./pages/admin/ConfiguracoesEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import AuthGuard from "./components/admin/AuthGuard";

// API Integration Pages
import InfoSimplesIntegracao from "./pages/admin/api/InfoSimplesIntegracao";
import InfoSimplesTestes from "./pages/admin/api/InfoSimplesTestes";
import InfoSimplesLogs from "./pages/admin/api/InfoSimplesLogs";
import InfoSimplesErros from "./pages/admin/api/InfoSimplesErros";
import AsaasIntegracao from "./pages/admin/api/AsaasIntegracao";
import AsaasTestes from "./pages/admin/api/AsaasTestes";
import AsaasLogs from "./pages/admin/api/AsaasLogs";
import AsaasErros from "./pages/admin/api/AsaasErros";
import SplitFacilIntegracao from "./pages/admin/api/SplitFacilIntegracao";
import SplitFacilTestes from "./pages/admin/api/SplitFacilTestes";
import SplitFacilLogs from "./pages/admin/api/SplitFacilLogs";
import SplitFacilErros from "./pages/admin/api/SplitFacilErros";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PermissionsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <CheckoutProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Signup />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/redefinir-senha/:token" element={<ResetPassword />} />
              
              {/* Product Routes */}
              <Route path="/produto/:id" element={<ProductDetail />} />
              
              {/* Purchase Flow */}
              <Route path="/solicitacao/veiculo" element={<VehicleData />} />
              <Route path="/solicitacao/cliente" element={<ClientData />} />
              <Route path="/solicitacao/pagamento" element={<PaymentData />} />
              <Route path="/solicitacao/confirmacao" element={<Confirmation />} />
              
              {/* Admin Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/perfis" element={<Perfis />} />
                <Route path="/admin/usuarios" element={<Usuarios />} />
                <Route path="/admin/produtos" element={<Produtos />} />
                <Route path="/admin/categorias" element={<Categorias />} />
                <Route path="/admin/clientes" element={<Clientes />} />
                <Route path="/admin/solicitacoes" element={<Solicitacoes />} />
                <Route path="/admin/split-pagamento" element={<SplitPagamento />} />
                <Route path="/admin/parceiros" element={<Parceiros />} />
                <Route path="/admin/tabela-cat-mmv" element={<TabelaCatMmv />} />
                <Route path="/admin/historico-splits" element={<HistoricoSplits />} />
                <Route path="/admin/configuracoes-email" element={<ConfiguracoesEmail />} />
                
                {/* API InfoSimples Routes */}
                <Route path="/admin/api/infosimples/integracao" element={<InfoSimplesIntegracao />} />
                <Route path="/admin/api/infosimples/testes" element={<InfoSimplesTestes />} />
                <Route path="/admin/api/infosimples/logs" element={<InfoSimplesLogs />} />
                <Route path="/admin/api/infosimples/erros" element={<InfoSimplesErros />} />
                
                {/* API Asaas Routes */}
                <Route path="/admin/api/asaas/integracao" element={<AsaasIntegracao />} />
                <Route path="/admin/api/asaas/testes" element={<AsaasTestes />} />
                <Route path="/admin/api/asaas/logs" element={<AsaasLogs />} />
                <Route path="/admin/api/asaas/erros" element={<AsaasErros />} />
                
                {/* API Split Fácil Routes */}
                <Route path="/admin/api/splitfacil/integracao" element={<SplitFacilIntegracao />} />
                <Route path="/admin/api/splitfacil/testes" element={<SplitFacilTestes />} />
                <Route path="/admin/api/splitfacil/logs" element={<SplitFacilLogs />} />
                <Route path="/admin/api/splitfacil/erros" element={<SplitFacilErros />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CheckoutProvider>
        </BrowserRouter>
      </PermissionsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
