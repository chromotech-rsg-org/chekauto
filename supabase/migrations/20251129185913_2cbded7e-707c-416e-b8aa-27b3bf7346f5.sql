-- Adicionar coluna tipo para armazenar o tipo do veículo (ex: 11 - SEMIRREBOQUE)
ALTER TABLE logs_consultas_infosimples 
ADD COLUMN IF NOT EXISTS tipo text;