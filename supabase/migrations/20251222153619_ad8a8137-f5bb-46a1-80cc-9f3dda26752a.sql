-- Adicionar campos de tipo de comissão em parceiros
ALTER TABLE public.parceiros
ADD COLUMN IF NOT EXISTS tipo_comissao text DEFAULT 'percentual',
ADD COLUMN IF NOT EXISTS valor_comissao numeric DEFAULT 0;

-- Adicionar campos de tipo de comissão em splits
ALTER TABLE public.splits
ADD COLUMN IF NOT EXISTS tipo_comissao text DEFAULT 'percentual',
ADD COLUMN IF NOT EXISTS valor_fixo numeric DEFAULT 0;

-- Criar tabela de configurações de email
CREATE TABLE IF NOT EXISTS public.configuracoes_email (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_email text NOT NULL UNIQUE,
  nome_exibicao text NOT NULL,
  descricao text,
  ativo_cliente boolean DEFAULT false,
  ativo_parceiro boolean DEFAULT false,
  ativo_admin boolean DEFAULT false,
  minutos_abandono integer DEFAULT 30,
  template_assunto text,
  template_corpo text,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.configuracoes_email ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Autenticados podem gerenciar configuracoes_email"
ON public.configuracoes_email
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Sistema pode ler configuracoes_email"
ON public.configuracoes_email
FOR SELECT
USING (true);

-- Trigger para atualizar atualizado_em
CREATE TRIGGER update_configuracoes_email_updated_at
BEFORE UPDATE ON public.configuracoes_email
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configurações padrão de email
INSERT INTO public.configuracoes_email (tipo_email, nome_exibicao, descricao, ativo_cliente, ativo_parceiro, ativo_admin, minutos_abandono)
VALUES 
  ('consulta_iniciada', 'Consulta Iniciada', 'Enviado quando o cliente inicia uma consulta de veículo', true, false, false, null),
  ('abandono_carrinho', 'Abandono de Carrinho', 'Enviado após X minutos sem finalizar a compra', true, false, false, 30),
  ('pedido_criado', 'Pedido Criado', 'Enviado quando o pedido é criado aguardando pagamento', true, false, true, null),
  ('pagamento_confirmado', 'Pagamento Confirmado', 'Enviado quando o pagamento é confirmado', true, true, true, null),
  ('comissao_parceiro', 'Comissão do Parceiro', 'Notificação de comissão para o parceiro', false, true, false, null)
ON CONFLICT (tipo_email) DO NOTHING;

-- Criar tabela para rastrear consultas para abandono de carrinho
CREATE TABLE IF NOT EXISTS public.rastreamento_consultas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid REFERENCES public.clientes(id),
  consulta_id uuid,
  email_cliente text,
  produto_id uuid REFERENCES public.produtos(id),
  dados_veiculo jsonb,
  email_abandono_enviado boolean DEFAULT false,
  finalizado boolean DEFAULT false,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.rastreamento_consultas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Sistema pode gerenciar rastreamento_consultas"
ON public.rastreamento_consultas
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger para atualizar atualizado_em
CREATE TRIGGER update_rastreamento_consultas_updated_at
BEFORE UPDATE ON public.rastreamento_consultas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();