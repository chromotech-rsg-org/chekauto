-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  produtos_count INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS public.produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  preco NUMERIC(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  cpf_cnpj TEXT UNIQUE NOT NULL,
  telefone TEXT,
  endereco JSONB,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de perfis de permissão
CREATE TABLE IF NOT EXISTS public.perfis_permissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  permissoes JSONB NOT NULL DEFAULT '{}',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  perfil_id UUID REFERENCES public.perfis_permissoes(id) ON DELETE SET NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de solicitações
CREATE TABLE IF NOT EXISTS public.solicitacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pagamento_id UUID REFERENCES public.pagamentos(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pendente',
  dados_veiculo JSONB,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de parceiros
CREATE TABLE IF NOT EXISTS public.parceiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf_cnpj TEXT UNIQUE NOT NULL,
  email TEXT,
  telefone TEXT,
  percentual_split NUMERIC(5,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de configuração de splits
CREATE TABLE IF NOT EXISTS public.splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parceiro_id UUID REFERENCES public.parceiros(id) ON DELETE CASCADE NOT NULL,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE NOT NULL,
  percentual NUMERIC(5,2) NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(parceiro_id, produto_id)
);

-- Criar tabela de histórico de splits
CREATE TABLE IF NOT EXISTS public.historico_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pagamento_id UUID REFERENCES public.pagamentos(id) ON DELETE CASCADE,
  parceiro_id UUID REFERENCES public.parceiros(id) ON DELETE SET NULL,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  valor NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pendente',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela CAT/MMV
CREATE TABLE IF NOT EXISTS public.cat_mmv (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_cat TEXT,
  codigo_mmv TEXT,
  descricao TEXT,
  tipo_veiculo TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_permissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_mmv ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorias (apenas autenticados podem gerenciar)
CREATE POLICY "Usuários autenticados podem visualizar categorias"
  ON public.categorias FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir categorias"
  ON public.categorias FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar categorias"
  ON public.categorias FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar categorias"
  ON public.categorias FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para produtos
CREATE POLICY "Todos podem visualizar produtos ativos"
  ON public.produtos FOR SELECT
  TO public
  USING (ativo = true);

CREATE POLICY "Autenticados visualizam todos produtos"
  ON public.produtos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Autenticados podem gerenciar produtos"
  ON public.produtos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para clientes (público pode criar durante checkout)
CREATE POLICY "Público pode criar clientes"
  ON public.clientes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Público pode buscar clientes por CPF"
  ON public.clientes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Autenticados podem gerenciar clientes"
  ON public.clientes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para perfis (apenas autenticados)
CREATE POLICY "Autenticados podem visualizar perfis"
  ON public.perfis_permissoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Autenticados podem gerenciar perfis"
  ON public.perfis_permissoes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para usuários administrativos
CREATE POLICY "Autenticados podem visualizar usuários"
  ON public.usuarios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Autenticados podem gerenciar usuários"
  ON public.usuarios FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para solicitações
CREATE POLICY "Autenticados podem visualizar solicitações"
  ON public.solicitacoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sistema pode criar solicitações"
  ON public.solicitacoes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Autenticados podem atualizar solicitações"
  ON public.solicitacoes FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas RLS para parceiros
CREATE POLICY "Autenticados podem gerenciar parceiros"
  ON public.parceiros FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para splits
CREATE POLICY "Autenticados podem gerenciar splits"
  ON public.splits FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para histórico_splits
CREATE POLICY "Autenticados podem visualizar histórico_splits"
  ON public.historico_splits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sistema pode criar histórico_splits"
  ON public.historico_splits FOR INSERT
  TO public
  WITH CHECK (true);

-- Políticas RLS para cat_mmv
CREATE POLICY "Todos podem visualizar cat_mmv"
  ON public.cat_mmv FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Autenticados podem gerenciar cat_mmv"
  ON public.cat_mmv FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column_generic()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_generic();

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_generic();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_generic();

CREATE TRIGGER update_perfis_updated_at BEFORE UPDATE ON public.perfis_permissoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_generic();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_generic();

CREATE TRIGGER update_solicitacoes_updated_at BEFORE UPDATE ON public.solicitacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_generic();

CREATE TRIGGER update_parceiros_updated_at BEFORE UPDATE ON public.parceiros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_generic();