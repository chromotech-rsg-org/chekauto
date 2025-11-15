import { AsaasCredentials } from '@/components/admin/AsaasCredentials';

const ConfiguracaoAsaas = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuração Asaas</h1>
        <p className="text-muted-foreground mt-2">
          Configure a integração com o gateway de pagamento Asaas
        </p>
      </div>

      <AsaasCredentials />
    </div>
  );
};

export default ConfiguracaoAsaas;
