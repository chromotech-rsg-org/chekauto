import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Personalizacao = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Personalização</h1>
          <p className="text-muted-foreground mt-2">
            Configure a aparência e identidade visual do sistema
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
              Aqui você poderá personalizar:
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm text-muted-foreground space-y-1">
              <li>Logotipos e marca</li>
              <li>Cores e tema</li>
              <li>Textos e mensagens</li>
              <li>Layout e estrutura</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Personalizacao;
