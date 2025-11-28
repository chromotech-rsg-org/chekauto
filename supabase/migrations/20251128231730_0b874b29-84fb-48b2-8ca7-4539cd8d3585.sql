-- Criar bucket para fotos de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket produtos
-- Permitir que usuários autenticados façam upload
CREATE POLICY "Usuários autenticados podem fazer upload de produtos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'produtos');

-- Permitir que usuários autenticados atualizem seus uploads
CREATE POLICY "Usuários autenticados podem atualizar produtos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'produtos');

-- Permitir que usuários autenticados deletem seus uploads
CREATE POLICY "Usuários autenticados podem deletar produtos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'produtos');

-- Permitir que todos visualizem as imagens (bucket público)
CREATE POLICY "Qualquer um pode visualizar produtos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'produtos');