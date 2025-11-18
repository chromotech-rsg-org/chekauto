-- Adicionar coluna foto_url na tabela produtos
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS foto_url TEXT;