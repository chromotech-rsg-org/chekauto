import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Shield, Package, UserCircle, FileText, DollarSign, Menu, X, FolderTree, Handshake, Table2, Receipt, Settings, CreditCard, Database, TestTubes, ChevronDown, ChevronsLeft, ChevronsRight, AlertCircle } from "lucide-react";
import logoLight from "@/assets/logo-chekauto-light.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const menuItems = [{
  title: "Dashboard",
  icon: LayoutDashboard,
  path: "/admin/dashboard",
  devOnly: false
}, {
  title: "Usuários",
  icon: Users,
  path: "/admin/usuarios",
  devOnly: false
}, {
  title: "Perfis de Usuário",
  icon: Shield,
  path: "/admin/perfis",
  devOnly: false
}, {
  title: "Produtos",
  icon: Package,
  path: "/admin/produtos",
  devOnly: false
}, {
  title: "Tipos de Carroceria",
  icon: FolderTree,
  path: "/admin/categorias",
  devOnly: false
}, {
  title: "Clientes",
  icon: UserCircle,
  path: "/admin/clientes",
  devOnly: false
}, {
  title: "Solicitações",
  icon: FileText,
  path: "/admin/solicitacoes",
  devOnly: false
}, {
  title: "Parceiros",
  icon: Handshake,
  path: "/admin/parceiros",
  devOnly: false
}, {
  title: "Split de Pagamento",
  icon: DollarSign,
  path: "/admin/split-pagamento",
  devOnly: false
}, {
  title: "Histórico de Splits",
  icon: Receipt,
  path: "/admin/historico-splits",
  devOnly: false
}, {
  title: "Tabela CAT MMV",
  icon: Table2,
  path: "/admin/tabela-cat-mmv",
  devOnly: false
}, {
  title: "Logs InfoSimples",
  icon: Database,
  path: "/admin/logs-consultas",
  devOnly: false
}];
const configMenuItems = [{
  title: "Integração Asaas",
  icon: CreditCard,
  path: "/admin/configuracao-asaas"
}, {
  title: "Config. InfoSimples",
  icon: Settings,
  path: "/admin/configuracoes-infosimples"
}, {
  title: "Testes API InfoSimples",
  icon: TestTubes,
  path: "/admin/testes-api-infosimples"
}, {
  title: "Códigos de Erro",
  icon: AlertCircle,
  path: "/admin/codigos-erro-api"
}];
export const AdminSidebar = () => {
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const {
    isDesenvolvedor
  } = usePermissions();

  // Logo branco para todos os temas
  const currentLogo = logoLight;
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate("/login");
    } catch {
      navigate("/login");
    }
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return <>
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md" onClick={toggleSidebar}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside className={`
          fixed lg:sticky top-0 left-0 h-screen bg-sidebar-background text-sidebar-foreground z-50
          transition-all duration-300 ease-in-out border-r border-sidebar-border
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
          w-64 flex flex-col
        `}>
        {/* Logo & Collapse Button */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between bg-primary">
          {!isCollapsed && <img src={currentLogo} alt="ChekAuto" className="h-7" />}
          <Button variant="ghost" size="icon" onClick={toggleCollapse} className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent ml-auto">
            {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation with custom scrollbar */}
        <nav className="flex-1 overflow-y-auto py-4 sidebar-scroll bg-sidebar-background bg-secondary-foreground">
          <ul className="space-y-1 px-2 bg-sidebar-background">
            {menuItems.filter(item => !item.devOnly || isDesenvolvedor).map(item => <li key={item.path}>
                  <NavLink to={item.path} onClick={() => setIsOpen(false)} className={({
              isActive
            }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent"} ${isCollapsed ? 'justify-center' : ''}`} title={isCollapsed ? item.title : undefined}>
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm">{item.title}</span>}
                  </NavLink>
                </li>)}

            {/* Menu Configurações Expansível - Apenas para Desenvolvedores */}
            {isDesenvolvedor && <li>
                {isCollapsed ? <Button variant="ghost" size="icon" className="w-full text-sidebar-foreground hover:bg-sidebar-accent" title="Configurações">
                    <Settings className="h-5 w-5" />
                  </Button> : <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                    <CollapsibleTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full">
                      <Settings className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 text-left text-sm">Configurações</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isConfigOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="mt-1 space-y-1">
                        {configMenuItems.map(item => <li key={item.path}>
                            <NavLink to={item.path} className={({
                      isActive
                    }) => `flex items-center gap-3 px-3 py-2 pl-10 rounded-lg transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                              <item.icon className="h-4 w-4" />
                              <span className="text-sm">{item.title}</span>
                            </NavLink>
                          </li>)}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>}
              </li>}
          </ul>
        </nav>
      </aside>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: hsl(var(--sidebar-border));
          border-radius: 3px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--sidebar-accent));
        }
      `}</style>
    </>;
};