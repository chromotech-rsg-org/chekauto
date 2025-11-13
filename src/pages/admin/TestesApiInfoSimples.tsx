import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoSimplesCredentialsComponent } from "@/components/admin/InfoSimplesCredentials";
import { InfoSimplesEndpointTest } from "@/components/admin/InfoSimplesEndpointTest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const TestesApiInfoSimples = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Testes de API - Info Simples</h1>
          <p className="text-muted-foreground mt-2">
            Configure credenciais e teste os endpoints da API Info Simples para consulta de veículos
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Documentação</CardTitle>
            <CardDescription>
              Links úteis para a API Info Simples
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="https://api.infosimples.com/consultas/docs/ecrvsp/veiculos/base-sp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Documentação: Base Estadual SP
            </a>
            <a 
              href="https://api.infosimples.com/consultas/docs/ecrvsp/veiculos/bin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Documentação: Cadastro BIN
            </a>
            <a 
              href="https://infosimples.com/consultas/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Portal Info Simples
            </a>
          </CardContent>
        </Card>

        <InfoSimplesCredentialsComponent />

        <Tabs defaultValue="base-sp" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="base-sp">Base Estadual SP</TabsTrigger>
            <TabsTrigger value="bin">Cadastro BIN</TabsTrigger>
          </TabsList>

          <TabsContent value="base-sp" className="mt-6">
            <InfoSimplesEndpointTest
              endpointType="base-sp"
              title="Base Estadual SP - Veículos Emplacados em SP"
              description="Consulta veículos emplacados no estado de São Paulo através da base estadual"
            />
          </TabsContent>

          <TabsContent value="bin" className="mt-6">
            <InfoSimplesEndpointTest
              endpointType="bin"
              title="Cadastro BIN - Outros Estados e 0KM"
              description="Consulta veículos emplacados em outros estados e veículos 0KM através do cadastro BIN"
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TestesApiInfoSimples;
