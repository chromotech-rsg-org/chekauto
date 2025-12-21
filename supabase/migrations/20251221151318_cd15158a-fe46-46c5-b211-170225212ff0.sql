-- Adicionar colunas para rastrear status do split na tabela solicitacoes
ALTER TABLE public.solicitacoes ADD COLUMN IF NOT EXISTS split_status TEXT DEFAULT 'nao_aplicavel';
ALTER TABLE public.solicitacoes ADD COLUMN IF NOT EXISTS split_erro TEXT;

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.solicitacoes.split_status IS 'Status do split: nao_aplicavel, pendente, configurado, erro';
COMMENT ON COLUMN public.solicitacoes.split_erro IS 'Mensagem de erro quando o split falha';