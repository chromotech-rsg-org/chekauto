-- Remover a FK existente se houver (cliente_consultas -> consultas_veiculos)
ALTER TABLE public.cliente_consultas 
DROP CONSTRAINT IF EXISTS cliente_consultas_consulta_id_fkey;

-- Não adicionar nova FK pois logs_consultas_infosimples pode ter IDs que não estão em consultas_veiculos
-- A associação será feita via ID do log ou ID da consulta, ambos são UUIDs válidos

-- Adicionar coluna para distinguir o tipo de referência (log ou consulta_veiculo)
ALTER TABLE public.cliente_consultas 
ADD COLUMN IF NOT EXISTS tipo_referencia TEXT DEFAULT 'log';

-- Comentário explicativo
COMMENT ON COLUMN public.cliente_consultas.consulta_id IS 'ID da consulta - pode ser de logs_consultas_infosimples ou consultas_veiculos';
COMMENT ON COLUMN public.cliente_consultas.tipo_referencia IS 'Tipo de referência: log (logs_consultas_infosimples) ou consulta (consultas_veiculos)';