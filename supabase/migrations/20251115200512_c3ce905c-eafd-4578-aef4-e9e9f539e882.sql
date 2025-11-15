-- Criar tabela para armazenar pagamentos do Asaas
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asaas_payment_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  metodo_pagamento TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  qr_code_pix TEXT,
  qr_code_copy_paste TEXT,
  invoice_url TEXT,
  dados_cliente JSONB,
  dados_produto JSONB,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver seus próprios pagamentos"
  ON public.pagamentos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios pagamentos"
  ON public.pagamentos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sistema pode atualizar status de pagamentos (webhook)"
  ON public.pagamentos
  FOR UPDATE
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pagamentos_updated_at
  BEFORE UPDATE ON public.pagamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_pagamentos_user_id ON public.pagamentos(user_id);
CREATE INDEX idx_pagamentos_asaas_id ON public.pagamentos(asaas_payment_id);
CREATE INDEX idx_pagamentos_status ON public.pagamentos(status);