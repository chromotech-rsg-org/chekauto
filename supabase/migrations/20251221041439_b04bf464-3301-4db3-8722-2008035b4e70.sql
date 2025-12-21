-- Adicionar campo wallet_id na tabela parceiros para integração com Split Fácil
ALTER TABLE public.parceiros ADD COLUMN wallet_id TEXT;

-- Comentário para documentação
COMMENT ON COLUMN public.parceiros.wallet_id IS 'ID da carteira do parceiro no Asaas, necessário para splits via Split Fácil';