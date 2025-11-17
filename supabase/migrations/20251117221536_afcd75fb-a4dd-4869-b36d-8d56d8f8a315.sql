-- Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS public.configuracoes_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem gerenciar configurações"
  ON public.configuracoes_sistema
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inserir configurações iniciais
INSERT INTO public.configuracoes_sistema (chave, valor, descricao) VALUES
  ('infosimples_token', '', 'Token opcional da API InfoSimples para substituir credenciais'),
  ('dias_cache_veiculo', '30', 'Número de dias para considerar cache de veículo válido')
ON CONFLICT (chave) DO NOTHING;

-- Criar tabela de consultas de veículos
CREATE TABLE IF NOT EXISTS public.consultas_veiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_consulta TEXT NOT NULL CHECK (tipo_consulta IN ('chassi', 'placa', 'renavam')),
  valor_consultado TEXT NOT NULL,
  dados_completos JSONB NOT NULL,
  modelo TEXT,
  marca TEXT,
  ano_modelo TEXT,
  renavam TEXT,
  chassi TEXT,
  placa TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_consultas_veiculos_renavam ON public.consultas_veiculos(renavam);
CREATE INDEX IF NOT EXISTS idx_consultas_veiculos_chassi ON public.consultas_veiculos(chassi);
CREATE INDEX IF NOT EXISTS idx_consultas_veiculos_placa ON public.consultas_veiculos(placa);
CREATE UNIQUE INDEX IF NOT EXISTS idx_consultas_veiculos_tipo_valor ON public.consultas_veiculos(tipo_consulta, valor_consultado);

ALTER TABLE public.consultas_veiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público pode visualizar consultas"
  ON public.consultas_veiculos
  FOR SELECT
  USING (true);

CREATE POLICY "Sistema pode criar e atualizar consultas"
  ON public.consultas_veiculos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Atualizar tabela clientes
ALTER TABLE public.clientes 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'cliente_ativo')),
  ADD COLUMN IF NOT EXISTS primeira_consulta_id UUID REFERENCES public.consultas_veiculos(id),
  ADD COLUMN IF NOT EXISTS ultima_interacao TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Atualizar clientes existentes para status 'lead'
UPDATE public.clientes SET status = 'lead' WHERE status IS NULL;

-- Atualizar tabela solicitacoes
ALTER TABLE public.solicitacoes
  ADD COLUMN IF NOT EXISTS consulta_veiculo_id UUID REFERENCES public.consultas_veiculos(id),
  ADD COLUMN IF NOT EXISTS dados_exibidos_cliente JSONB,
  ADD COLUMN IF NOT EXISTS origem_consulta TEXT CHECK (origem_consulta IN ('home_hero', 'modal_produto', 'produto_detail', 'checkout'));

-- Criar trigger para atualizar updated_at em configuracoes_sistema
CREATE TRIGGER update_configuracoes_sistema_updated_at
  BEFORE UPDATE ON public.configuracoes_sistema
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column_generic();

-- Criar trigger para atualizar updated_at em consultas_veiculos
CREATE TRIGGER update_consultas_veiculos_updated_at
  BEFORE UPDATE ON public.consultas_veiculos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column_generic();

-- Função para atualizar status do cliente quando pagamento é confirmado
CREATE OR REPLACE FUNCTION public.atualizar_status_cliente_pagamento()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Se o pagamento foi confirmado (status CONFIRMED ou RECEIVED)
  IF NEW.status IN ('CONFIRMED', 'RECEIVED') AND OLD.status != NEW.status THEN
    -- Atualizar status do cliente através da solicitação
    UPDATE public.clientes
    SET status = 'cliente_ativo',
        ultima_interacao = now()
    WHERE id IN (
      SELECT cliente_id 
      FROM public.solicitacoes 
      WHERE pagamento_id = NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger na tabela pagamentos
DROP TRIGGER IF EXISTS trigger_atualizar_status_cliente ON public.pagamentos;
CREATE TRIGGER trigger_atualizar_status_cliente
  AFTER UPDATE ON public.pagamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_status_cliente_pagamento();