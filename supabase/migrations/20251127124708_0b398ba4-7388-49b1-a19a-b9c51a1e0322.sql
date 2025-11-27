-- Permitir que usuários autenticados deletem logs de consultas InfoSimples
CREATE POLICY "Autenticados podem deletar logs"
ON logs_consultas_infosimples
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);