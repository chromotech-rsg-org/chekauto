-- Adicionar campo is_desenvolvedor na tabela perfis_permissoes
ALTER TABLE perfis_permissoes ADD COLUMN IF NOT EXISTS is_desenvolvedor BOOLEAN DEFAULT false;

-- Comentário explicativo
COMMENT ON COLUMN perfis_permissoes.is_desenvolvedor IS 'Indica se o perfil tem acesso a funcionalidades de desenvolvedor';