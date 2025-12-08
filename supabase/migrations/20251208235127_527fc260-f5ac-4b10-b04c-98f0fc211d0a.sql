-- Criar tabela de junção para relacionar clientes com múltiplas consultas
CREATE TABLE public.cliente_consultas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  consulta_id UUID NOT NULL REFERENCES public.consultas_veiculos(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cliente_id, consulta_id)
);

-- Habilitar RLS
ALTER TABLE public.cliente_consultas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Sistema pode criar cliente_consultas"
ON public.cliente_consultas
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Público pode visualizar cliente_consultas"
ON public.cliente_consultas
FOR SELECT
USING (true);

CREATE POLICY "Autenticados podem gerenciar cliente_consultas"
ON public.cliente_consultas
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Índices para performance
CREATE INDEX idx_cliente_consultas_cliente_id ON public.cliente_consultas(cliente_id);
CREATE INDEX idx_cliente_consultas_consulta_id ON public.cliente_consultas(consulta_id);