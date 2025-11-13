import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JsonResultDisplayProps {
  result: any;
  responseTime?: number;
  status?: number;
  onClear: () => void;
}

export const JsonResultDisplay = ({ result, responseTime, status, onClear }: JsonResultDisplayProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast({
      title: 'JSON copiado',
      description: 'O JSON foi copiado para a área de transferência'
    });
  };

  if (!result) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resultado da Consulta</CardTitle>
            <CardDescription>
              Resposta da API Info Simples
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant={status === 200 ? 'default' : 'destructive'}>
                Status: {status}
              </Badge>
            )}
            {responseTime && (
              <Badge variant="outline">
                {responseTime}ms
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
            <code>{JSON.stringify(result, null, 2)}</code>
          </pre>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar JSON
          </Button>
          <Button variant="outline" onClick={onClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Resultados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
