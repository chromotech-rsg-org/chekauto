-- Add codigo field to categorias (tipos de carroceria)
ALTER TABLE public.categorias 
ADD COLUMN IF NOT EXISTS codigo TEXT;

-- Add apelido field to produtos
ALTER TABLE public.produtos 
ADD COLUMN IF NOT EXISTS apelido TEXT;

-- Create produto_tipos table for N:N relationship
CREATE TABLE IF NOT EXISTS public.produto_tipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  tipo_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE(produto_id, tipo_id)
);

-- Enable RLS on produto_tipos
ALTER TABLE public.produto_tipos ENABLE ROW LEVEL SECURITY;

-- RLS policies for produto_tipos
CREATE POLICY "Autenticados podem gerenciar produto_tipos"
ON public.produto_tipos
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Todos podem visualizar produto_tipos de produtos ativos"
ON public.produto_tipos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.produtos 
    WHERE produtos.id = produto_tipos.produto_id 
    AND produtos.ativo = true
  )
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_produto_tipos_produto_id ON public.produto_tipos(produto_id);
CREATE INDEX IF NOT EXISTS idx_produto_tipos_tipo_id ON public.produto_tipos(tipo_id);