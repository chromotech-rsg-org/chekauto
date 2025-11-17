import { AsaasCredentials } from '@/components/admin/AsaasCredentials';
import { AdminLayout } from '@/components/admin/AdminLayout';

const ConfiguracaoAsaas = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuração Asaas</h1>
        <p className="text-muted-foreground mt-2">
          Configure a integração com o gateway de pagamento Asaas
        </p>
      </div>

      <AsaasCredentials />
      </div>
    </AdminLayout>
  );
};

export default ConfiguracaoAsaas;
