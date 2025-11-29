-- Adicionar política RLS para permitir leitura anônima de configurações públicas
CREATE POLICY "Permitir leitura pública de configurações"
ON configuracoes_sistema
FOR SELECT
TO anon, authenticated
USING (true);