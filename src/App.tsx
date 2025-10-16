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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Signup />} />
          
          {/* Product Routes */}
          <Route path="/produto/:id" element={<ProductDetail />} />
          
          {/* Purchase Flow */}
          <Route path="/solicitacao/veiculo" element={<VehicleData />} />
          <Route path="/solicitacao/cliente" element={<ClientData />} />
          <Route path="/solicitacao/pagamento" element={<PaymentData />} />
          <Route path="/solicitacao/confirmacao" element={<Confirmation />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
