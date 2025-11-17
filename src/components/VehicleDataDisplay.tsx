import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Truck, Calendar, Hash, Palette, Fuel, CheckCircle, Clock } from 'lucide-react';
import { mapearDadosVeiculo, formatarDadosResumo, DadosVeiculoMapeados } from '@/lib/infoSimplesDataMapper';

interface VehicleDataDisplayProps {
  dados: any;
  fromCache?: boolean;
  ultimaAtualizacao?: string;
  showFullDetails?: boolean;
  className?: string;
}

export const VehicleDataDisplay: React.FC<VehicleDataDisplayProps> = ({
  dados,
  fromCache = false,
  ultimaAtualizacao,
  showFullDetails = false,
  className = '',
}) => {
  const dadosMapeados: DadosVeiculoMapeados = mapearDadosVeiculo(dados);
  const resumo = formatarDadosResumo(dadosMapeados);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Badge de status */}
      <div className="flex items-center gap-2">
        {fromCache ? (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Última atualização: {new Date(ultimaAtualizacao!).toLocaleDateString('pt-BR')}
          </Badge>
        ) : (
          <Badge className="gap-1 bg-green-500">
            <CheckCircle className="h-3 w-3" />
            Dados atualizados
          </Badge>
        )}
      </div>

      {/* Card principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Dados do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Título */}
          <div className="border-b pb-3">
            <h3 className="text-xl font-bold text-foreground">{resumo.titulo}</h3>
            <p className="text-sm text-muted-foreground">{resumo.subtitulo}</p>
          </div>

          {/* Dados principais em grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resumo.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detalhes expandíveis */}
          {showFullDetails && (
            <Accordion type="single" collapsible className="w-full">
              {/* Especificações */}
              <AccordionItem value="especificacoes">
                <AccordionTrigger>Especificações Técnicas</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <InfoItem label="Tipo" value={dadosMapeados.especificacoes.tipo} />
                    <InfoItem label="Espécie" value={dadosMapeados.especificacoes.especie} />
                    <InfoItem label="Categoria" value={dadosMapeados.especificacoes.categoria} />
                    <InfoItem label="Cor" value={dadosMapeados.especificacoes.cor} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Motorização */}
              <AccordionItem value="motorizacao">
                <AccordionTrigger>Motorização</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <InfoItem label="Combustível" value={dadosMapeados.motorizacao.combustivel} />
                    <InfoItem label="Potência" value={dadosMapeados.motorizacao.potencia} />
                    <InfoItem label="Cilindradas" value={dadosMapeados.motorizacao.cilindradas} />
                    <InfoItem label="Cap. Passageiros" value={dadosMapeados.motorizacao.capacidadePassageiros} />
                    <InfoItem label="Cap. Carga" value={dadosMapeados.motorizacao.capacidadeCarga} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Registro */}
              <AccordionItem value="registro">
                <AccordionTrigger>Informações de Registro</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <InfoItem label="Situação" value={dadosMapeados.registro.situacao} />
                    <InfoItem label="Data Emissão CRV" value={dadosMapeados.registro.dataEmissaoCRV} />
                    <InfoItem label="Município" value={dadosMapeados.registro.municipio} />
                    <InfoItem label="UF" value={dadosMapeados.registro.uf} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Restrições */}
              {dadosMapeados.informacoes.restricoes.length > 0 && (
                <AccordionItem value="restricoes">
                  <AccordionTrigger>Restrições</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {dadosMapeados.informacoes.restricoes.map((restricao, idx) => (
                        <div key={idx} className="p-2 bg-muted/50 rounded">
                          <p className="text-sm">{restricao}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Observações */}
              {dadosMapeados.informacoes.observacoes.length > 0 && (
                <AccordionItem value="observacoes">
                  <AccordionTrigger>Observações</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {dadosMapeados.informacoes.observacoes.map((obs, idx) => (
                        <div key={idx} className="p-2 bg-muted/50 rounded">
                          <p className="text-sm">{obs}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Componente auxiliar para exibir informações
const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);
