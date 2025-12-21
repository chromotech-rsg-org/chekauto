-- Criar tabela para logs do Split Fácil
CREATE TABLE IF NOT EXISTS public.logs_split_facil (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitacao_id UUID REFERENCES public.solicitacoes(id),
  pagamento_id UUID REFERENCES public.pagamentos(id),
  asaas_payment_id TEXT,
  tipo TEXT NOT NULL, -- 'request' ou 'webhook'
  endpoint TEXT NOT NULL,
  metodo TEXT DEFAULT 'POST',
  payload JSONB,
  resposta JSONB,
  status_code INTEGER,
  erro TEXT,
  tempo_resposta_ms INTEGER,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar campos extras à tabela historico_splits
ALTER TABLE public.historico_splits 
ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id),
ADD COLUMN IF NOT EXISTS valor_compra NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS percentual NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS asaas_payment_id TEXT,
ADD COLUMN IF NOT EXISTS resposta_api JSONB,
ADD COLUMN IF NOT EXISTS erro_mensagem TEXT,
ADD COLUMN IF NOT EXISTS acionado_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS origem TEXT DEFAULT 'api',
ADD COLUMN IF NOT EXISTS status_pagamento TEXT;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_logs_split_facil_solicitacao ON public.logs_split_facil(solicitacao_id);
CREATE INDEX IF NOT EXISTS idx_logs_split_facil_pagamento ON public.logs_split_facil(pagamento_id);
CREATE INDEX IF NOT EXISTS idx_logs_split_facil_criado ON public.logs_split_facil(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_historico_splits_asaas ON public.historico_splits(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_historico_splits_cliente ON public.historico_splits(cliente_id);

-- RLS para logs_split_facil
ALTER TABLE public.logs_split_facil ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logs visíveis para usuários autenticados"
  ON public.logs_split_facil FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Logs inseríveis pelo service role"
  ON public.logs_split_facil FOR INSERT
  TO authenticated
  WITH CHECK (true);