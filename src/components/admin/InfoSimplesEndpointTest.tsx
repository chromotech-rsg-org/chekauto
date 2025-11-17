import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Info } from 'lucide-react';
import { consultarBaseEstadualSP, consultarCadastroBIN } from '@/services/infoSimplesService';
import { ConsultaTipo, EndpointType } from '@/types/infoSimples';
import { useToast } from '@/hooks/use-toast';
import { JsonResultDisplay } from './JsonResultDisplay';

interface InfoSimplesEndpointTestProps {
  endpointType: EndpointType;
  title: string;
  description: string;
}

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const InfoSimplesEndpointTest = ({ endpointType, title, description }: InfoSimplesEndpointTestProps) => {
  const { toast } = useToast();
  const [consultaTipo, setConsultaTipo] = useState<ConsultaTipo>('chassi');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [responseTime, setResponseTime] = useState<number>();
  const [status, setStatus] = useState<number>();

  const [chassi, setChassi] = useState('');
  const [placa, setPlaca] = useState('');
  const [renavam, setRenavam] = useState('');
  const [uf, setUf] = useState('');
  const [token, setToken] = useState('');

  const handleExecutar = async () => {
    // Validações
    if (consultaTipo === 'chassi' && !chassi) {
      toast({
        title: 'Erro',
        description: 'O campo Chassi é obrigatório',
        variant: 'destructive'
      });
      return;
    }

    if (consultaTipo === 'placa-renavam' && (!placa || !renavam)) {
      toast({
        title: 'Erro',
        description: 'Os campos Placa e RENAVAM são obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    if (chassi && chassi.length !== 17) {
      toast({
        title: 'Erro',
        description: 'O Chassi deve ter exatamente 17 caracteres',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response;
      
      if (endpointType === 'base-sp') {
        const params = consultaTipo === 'chassi' 
          ? { chassi, token: token || undefined }
          : { placa, renavam, token: token || undefined };
        response = await consultarBaseEstadualSP(params);
      } else {
        const params = consultaTipo === 'chassi'
          ? { chassi, uf: uf || undefined, token: token || undefined }
          : { placa, renavam, uf: uf || undefined, token: token || undefined };
        response = await consultarCadastroBIN(params);
      }

      if (response.success) {
        setResult(response.data);
        setResponseTime(response.responseTime);
        setStatus(response.status);
        toast({
          title: 'Consulta realizada',
          description: `Consulta executada com sucesso em ${response.responseTime}ms`
        });
      } else {
        setResult(response.data || { error: response.error });
        setResponseTime(response.responseTime);
        setStatus(response.status);
        toast({
          title: 'Erro na consulta',
          description: response.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao executar consulta',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearResult = () => {
    setResult(null);
    setResponseTime(undefined);
    setStatus(undefined);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Como usar:</strong> Escolha o tipo de consulta e preencha os campos necessários.
              {endpointType === 'base-sp' && ' Este endpoint consulta apenas veículos emplacados em SP.'}
              {endpointType === 'bin' && ' Este endpoint consulta veículos de outros estados e 0KM.'}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Tipo de Consulta</Label>
              <RadioGroup value={consultaTipo} onValueChange={(v) => setConsultaTipo(v as ConsultaTipo)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chassi" id="chassi" />
                  <Label htmlFor="chassi">Consultar por Chassi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="placa-renavam" id="placa-renavam" />
                  <Label htmlFor="placa-renavam">Consultar por Placa + RENAVAM</Label>
                </div>
              </RadioGroup>
            </div>

            {consultaTipo === 'chassi' ? (
              <div className="space-y-2">
                <Label htmlFor="chassi-input">Chassi (17 caracteres)</Label>
                <Input
                  id="chassi-input"
                  value={chassi}
                  onChange={(e) => setChassi(e.target.value.toUpperCase())}
                  placeholder="9BWHE21JX24060831"
                  maxLength={17}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placa-input">Placa</Label>
                  <Input
                    id="placa-input"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    placeholder="ABC1234"
                    maxLength={7}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renavam-input">RENAVAM</Label>
                  <Input
                    id="renavam-input"
                    value={renavam}
                    onChange={(e) => setRenavam(e.target.value)}
                    placeholder="00123456789"
                  />
                </div>
              </div>
            )}

            {endpointType === 'bin' && (
              <div className="space-y-2">
                <Label htmlFor="uf-select">UF (Opcional para BIN)</Label>
                <Select value={uf} onValueChange={setUf}>
                  <SelectTrigger id="uf-select">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_BRASIL.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="token-input">Token (Opcional - substitui credenciais salvas)</Label>
              <Input
                id="token-input"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Digite o token da API InfoSimples"
              />
            </div>

            <Button onClick={handleExecutar} disabled={loading} className="w-full">
              {loading ? (
                <>Executando...</>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Executar Consulta
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <JsonResultDisplay
          result={result}
          responseTime={responseTime}
          status={status}
          onClear={handleClearResult}
        />
      )}
    </div>
  );
};
