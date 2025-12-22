import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { SplitFacilCredentials } from "@/components/admin/SplitFacilCredentials";

export default function SplitFacilIntegracao() {
  return (
    <ApiIntegrationLayout
      title="Split Fácil"
      description="Configurações de integração com a API Split Fácil"
      basePath="/admin/api/split-facil"
      activeTab="integracao"
    >
      <SplitFacilCredentials />
    </ApiIntegrationLayout>
  );
}
