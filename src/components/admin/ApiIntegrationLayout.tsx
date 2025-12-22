import { ReactNode } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, TestTubes, ScrollText, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface ApiIntegrationLayoutProps {
  title: string;
  description: string;
  basePath: string;
  children: ReactNode;
  activeTab: "integracao" | "testes" | "logs" | "erros";
}

export function ApiIntegrationLayout({
  title,
  description,
  basePath,
  children,
  activeTab
}: ApiIntegrationLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "integracao", label: "Integração", icon: Settings, path: `${basePath}/integracao` },
    { id: "testes", label: "Testes", icon: TestTubes, path: `${basePath}/testes` },
    { id: "logs", label: "Logs", icon: ScrollText, path: `${basePath}/logs` },
    { id: "erros", label: "Erros", icon: AlertCircle, path: `${basePath}/erros` },
  ];

  const handleTabChange = (value: string) => {
    const tab = tabs.find(t => t.id === value);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-xl">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
