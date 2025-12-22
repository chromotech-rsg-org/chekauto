import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { InfoSimplesEndpointTest } from "@/components/admin/InfoSimplesEndpointTest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoSimplesTestes() {
  return (
    <ApiIntegrationLayout
      title="API InfoSimples"
      description="Teste os endpoints da API InfoSimples"
      basePath="/admin/api/infosimples"
      activeTab="testes"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Consulta por Placa</CardTitle>
            <CardDescription>Teste a consulta de veículo por placa</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoSimplesEndpointTest
              title="Placa"
              endpoint="placa"
              paramName="placa"
              paramLabel="Placa do Veículo"
              placeholder="ABC1234"
              mask="aaa9*99"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consulta por Chassi</CardTitle>
            <CardDescription>Teste a consulta de veículo por chassi</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoSimplesEndpointTest
              title="Chassi"
              endpoint="chassi"
              paramName="chassi"
              paramLabel="Chassi do Veículo"
              placeholder="9BWZZZ377VT004251"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consulta Base SP</CardTitle>
            <CardDescription>Consulta na base do Detran-SP</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoSimplesEndpointTest
              title="Base SP"
              endpoint="base-sp"
              paramName="placa"
              paramLabel="Placa do Veículo"
              placeholder="ABC1234"
              mask="aaa9*99"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consulta BIN Nacional</CardTitle>
            <CardDescription>Consulta na Base de Índice Nacional</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoSimplesEndpointTest
              title="BIN Nacional"
              endpoint="bin"
              paramName="chassi"
              paramLabel="Chassi do Veículo"
              placeholder="9BWZZZ377VT004251"
            />
          </CardContent>
        </Card>
      </div>
    </ApiIntegrationLayout>
  );
}
