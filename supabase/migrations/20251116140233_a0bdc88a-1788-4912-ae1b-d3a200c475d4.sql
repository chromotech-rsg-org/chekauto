-- Corrigir políticas RLS para tabela categorias
DROP POLICY IF EXISTS "Usuários autenticados podem inserir categorias" ON public.categorias;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar categorias" ON public.categorias;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar categorias" ON public.categorias;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar categorias" ON public.categorias;

CREATE POLICY "Usuários autenticados podem inserir categorias" 
ON public.categorias 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem visualizar categorias" 
ON public.categorias 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar categorias" 
ON public.categorias 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem deletar categorias" 
ON public.categorias 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Corrigir políticas RLS para tabela produtos
DROP POLICY IF EXISTS "Autenticados podem gerenciar produtos" ON public.produtos;
DROP POLICY IF EXISTS "Autenticados visualizam todos produtos" ON public.produtos;

CREATE POLICY "Autenticados podem gerenciar produtos" 
ON public.produtos 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Corrigir políticas RLS para tabela usuarios
DROP POLICY IF EXISTS "Autenticados podem gerenciar usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Autenticados podem visualizar usuários" ON public.usuarios;

CREATE POLICY "Autenticados podem gerenciar usuários" 
ON public.usuarios 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Corrigir políticas RLS para tabela parceiros
DROP POLICY IF EXISTS "Autenticados podem gerenciar parceiros" ON public.parceiros;

CREATE POLICY "Autenticados podem gerenciar parceiros" 
ON public.parceiros 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Corrigir políticas RLS para tabela splits
DROP POLICY IF EXISTS "Autenticados podem gerenciar splits" ON public.splits;

CREATE POLICY "Autenticados podem gerenciar splits" 
ON public.splits 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Corrigir políticas RLS para tabela perfis_permissoes
DROP POLICY IF EXISTS "Autenticados podem gerenciar perfis" ON public.perfis_permissoes;
DROP POLICY IF EXISTS "Autenticados podem visualizar perfis" ON public.perfis_permissoes;

CREATE POLICY "Autenticados podem gerenciar perfis" 
ON public.perfis_permissoes 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Corrigir políticas RLS para tabela cat_mmv
DROP POLICY IF EXISTS "Autenticados podem gerenciar cat_mmv" ON public.cat_mmv;

CREATE POLICY "Autenticados podem gerenciar cat_mmv" 
ON public.cat_mmv 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Corrigir políticas RLS para tabela sistemas
DROP POLICY IF EXISTS "Authenticated users can insert sistemas" ON public.sistemas;
DROP POLICY IF EXISTS "Authenticated users can update sistemas" ON public.sistemas;
DROP POLICY IF EXISTS "Authenticated users can delete sistemas" ON public.sistemas;
DROP POLICY IF EXISTS "Authenticated users can view sistemas" ON public.sistemas;

CREATE POLICY "Authenticated users can manage sistemas" 
ON public.sistemas 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Corrigir políticas RLS para tabela solicitacoes
DROP POLICY IF EXISTS "Autenticados podem atualizar solicitações" ON public.solicitacoes;
DROP POLICY IF EXISTS "Autenticados podem visualizar solicitações" ON public.solicitacoes;

CREATE POLICY "Autenticados podem visualizar e atualizar solicitações" 
ON public.solicitacoes 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);