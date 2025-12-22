import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { InfoSimplesEndpointTest } from "@/components/admin/InfoSimplesEndpointTest";

export default function InfoSimplesTestes() {
  return (
    <ApiIntegrationLayout
      title="API InfoSimples"
      description="Teste os endpoints da API InfoSimples"
      basePath="/admin/api/infosimples"
      activeTab="testes"
    >
      <div className="space-y-6">
        <InfoSimplesEndpointTest
          endpointType="base-sp"
          title="Consulta Base Estadual SP"
          description="Endpoint para consultar veículos emplacados em São Paulo"
        />

        <InfoSimplesEndpointTest
          endpointType="bin"
          title="Consulta Cadastro BIN"
          description="Endpoint para consultar veículos de outros estados e 0KM"
        />
      </div>
    </ApiIntegrationLayout>
  );
}
