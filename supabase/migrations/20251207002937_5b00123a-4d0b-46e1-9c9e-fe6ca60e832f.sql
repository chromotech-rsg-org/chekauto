-- Primeiro, limpar a tabela existente
TRUNCATE TABLE public.cat_mmv;

-- Adicionar novas colunas à tabela cat_mmv
ALTER TABLE public.cat_mmv 
DROP COLUMN IF EXISTS codigo_cat,
DROP COLUMN IF EXISTS codigo_mmv,
DROP COLUMN IF EXISTS descricao,
DROP COLUMN IF EXISTS tipo_veiculo;

-- Adicionar todas as novas colunas
ALTER TABLE public.cat_mmv 
ADD COLUMN IF NOT EXISTS mmv_original TEXT,
ADD COLUMN IF NOT EXISTS codigo_mmv_original TEXT,
ADD COLUMN IF NOT EXISTS mmv_transformada TEXT,
ADD COLUMN IF NOT EXISTS codigo_mmv_transformada TEXT,
ADD COLUMN IF NOT EXISTS wmi TEXT,
ADD COLUMN IF NOT EXISTS categoria TEXT,
ADD COLUMN IF NOT EXISTS marca TEXT,
ADD COLUMN IF NOT EXISTS modelo_original TEXT,
ADD COLUMN IF NOT EXISTS modelo_transformado TEXT,
ADD COLUMN IF NOT EXISTS tipo_transformacao TEXT,
ADD COLUMN IF NOT EXISTS carroceria TEXT,
ADD COLUMN IF NOT EXISTS eixos TEXT,
ADD COLUMN IF NOT EXISTS numero_cat TEXT,
ADD COLUMN IF NOT EXISTS numero_cct TEXT,
ADD COLUMN IF NOT EXISTS vencimento TEXT,
ADD COLUMN IF NOT EXISTS origem TEXT;