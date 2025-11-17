import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Package, 
  UserCircle, 
  FileText, 
  DollarSign, 
  LogOut,
  Menu,
  X,
  FolderTree,
  Handshake,
  Table2,
  Receipt,
  TestTube2,
  CreditCard
} from "lucide-react";
import logoAdmin from "@/assets/logo-admin-chekauto.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { title: "Usuários", icon: Users, path: "/admin/usuarios" },
  { title: "Perfis de Usuário", icon: Shield, path: "/admin/perfis" },
  { title: "Produtos", icon: Package, path: "/admin/produtos" },
  { title: "Categorias", icon: FolderTree, path: "/admin/categorias" },
  { title: "Clientes", icon: UserCircle, path: "/admin/clientes" },
  { title: "Solicitações", icon: FileText, path: "/admin/solicitacoes" },
  { title: "Parceiros", icon: Handshake, path: "/admin/parceiros" },
  { title: "Split de Pagamento", icon: DollarSign, path: "/admin/split-pagamento" },
  { title: "Histórico de Splits", icon: Receipt, path: "/admin/historico-splits" },
  { title: "Tabela CAT MMV", icon: Table2, path: "/admin/tabela-cat-mmv" },
  { title: "Testes API Info Simples", icon: TestTube2, path: "/admin/testes-api" },
  { title: "Configurações InfoSimples", icon: TestTube2, path: "/admin/config-infosimples" },
  { title: "Configuração Asaas", icon: CreditCard, path: "/admin/config-asaas" }
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      // Limpa todo localStorage conforme solicitado
      localStorage.clear();
      if (error) {
        // Mesmo em caso de erro, redireciona para login
        navigate("/login");
        return;
      }
      navigate("/login");
    } catch {
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-black text-white z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <img src={logoAdmin} alt="ChekAuto" className="h-8 mx-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-brand-yellow text-black font-semibold"
                        : "text-white hover:bg-gray-900"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white hover:bg-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};
