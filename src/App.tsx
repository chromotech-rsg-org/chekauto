import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { PermissionsProvider } from "./contexts/PermissionsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PermissionsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
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
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/perfis" element={<Perfis />} />
          <Route path="/admin/usuarios" element={<Usuarios />} />
          <Route path="/admin/produtos" element={<Produtos />} />
          <Route path="/admin/categorias" element={<Categorias />} />
          <Route path="/admin/clientes" element={<Clientes />} />
          <Route path="/admin/solicitacoes" element={<Solicitacoes />} />
          <Route path="/admin/split-pagamento" element={<SplitPagamento />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PermissionsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
