import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CodigoErro {
  id: string;
  codigo: number;
  descricao: string;
  cobranca: boolean;
  criado_em: string;
}

export default function CodigosErroApi() {
  const [codigos, setCodigos] = useState<CodigoErro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCodigos();
  }, []);

  const loadCodigos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('codigos_erro_api')
        .select('*')
        .order('codigo', { ascending: true });

      if (error) throw error;

      setCodigos(data || []);
    } catch (error) {
      console.error('Erro ao carregar códigos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os códigos de erro',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCodigos = codigos.filter(codigo => {
    const search = searchTerm.toLowerCase();
    return (
      codigo.codigo.toString().includes(search) ||
      codigo.descricao.toLowerCase().includes(search)
    );
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Códigos de Erro da API</h1>
        <p className="text-muted-foreground mt-2">Códigos de resposta da API InfoSimples</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>InfoSimples - Códigos de Resposta</CardTitle>
          <CardDescription>
            Lista completa de códigos retornados pela API InfoSimples. O código 200 indica sucesso,
            os demais indicam diferentes tipos de erro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código ou palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando códigos...
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[120px] text-center">Cobrança</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodigos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Nenhum código encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCodigos.map((codigo) => (
                      <TableRow key={codigo.id}>
                        <TableCell>
                          <Badge
                            variant={codigo.codigo === 200 ? 'default' : 'destructive'}
                            className="font-mono"
                          >
                            {codigo.codigo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{codigo.descricao}</TableCell>
                        <TableCell className="text-center">
                          {codigo.cobranca ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-6 text-sm text-muted-foreground space-y-2">
            <p><strong>Cobrança:</strong> Indica se a consulta é cobrada mesmo quando retorna erro.</p>
            <p><strong>Código 200:</strong> Consulta realizada com sucesso.</p>
            <p><strong>Códigos 6xx:</strong> Erros diversos da API InfoSimples.</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
