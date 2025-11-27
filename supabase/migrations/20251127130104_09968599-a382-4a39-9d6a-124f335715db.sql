-- Adicionar campos de dados extraídos à tabela de logs
ALTER TABLE logs_consultas_infosimples
ADD COLUMN IF NOT EXISTS modelo text,
ADD COLUMN IF NOT EXISTS marca text,
ADD COLUMN IF NOT EXISTS placa text,
ADD COLUMN IF NOT EXISTS chassi text,
ADD COLUMN IF NOT EXISTS renavam text,
ADD COLUMN IF NOT EXISTS cor text,
ADD COLUMN IF NOT EXISTS ano_modelo text,
ADD COLUMN IF NOT EXISTS ano_fabricacao text,
ADD COLUMN IF NOT EXISTS combustivel text,
ADD COLUMN IF NOT EXISTS categoria text;

-- Criar índices para melhorar performance de busca
CREATE INDEX IF NOT EXISTS idx_logs_chassi ON logs_consultas_infosimples(chassi);
CREATE INDEX IF NOT EXISTS idx_logs_placa ON logs_consultas_infosimples(placa);
CREATE INDEX IF NOT EXISTS idx_logs_renavam ON logs_consultas_infosimples(renavam);
CREATE INDEX IF NOT EXISTS idx_logs_tipo_consulta ON logs_consultas_infosimples(tipo_consulta);

-- Criar índice composto para busca por tipo e valor
CREATE INDEX IF NOT EXISTS idx_logs_tipo_sucesso ON logs_consultas_infosimples(tipo_consulta, sucesso, criado_em DESC);