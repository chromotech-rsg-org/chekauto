import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const IntegracaoMotv = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integração MOTV</h1>
          <p className="text-muted-foreground mt-2">
            Configure a integração com o sistema MOTV
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Em Desenvolvimento</CardTitle>
            <CardDescription>
              Esta funcionalidade estará disponível em breve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aqui você poderá configurar:
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm text-muted-foreground space-y-1">
              <li>Credenciais de acesso MOTV</li>
              <li>Endpoints e URLs</li>
              <li>Testes de conexão</li>
              <li>Mapeamento de dados</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default IntegracaoMotv;
