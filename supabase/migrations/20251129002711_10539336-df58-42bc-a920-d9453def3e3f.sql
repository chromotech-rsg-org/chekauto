-- Adicionar colunas na tabela usuarios para foto e tema
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS foto_url TEXT,
ADD COLUMN IF NOT EXISTS tema TEXT DEFAULT 'padrao' CHECK (tema IN ('padrao', 'dark', 'light'));

-- Comentários
COMMENT ON COLUMN public.usuarios.foto_url IS 'URL da foto de perfil do usuário';
COMMENT ON COLUMN public.usuarios.tema IS 'Tema preferido do usuário: padrao, dark ou light';