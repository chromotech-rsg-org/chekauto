-- Tabela para características de produtos
CREATE TABLE produto_caracteristicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para aplicações de produtos
CREATE TABLE produto_aplicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para FAQ de produtos
CREATE TABLE produto_faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para galeria de fotos
CREATE TABLE produto_galeria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para log de consultas InfoSimples
CREATE TABLE logs_consultas_infosimples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_consulta TEXT NOT NULL,
  parametros JSONB NOT NULL,
  resposta JSONB NOT NULL,
  sucesso BOOLEAN NOT NULL,
  tempo_resposta INTEGER,
  erro TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para pesquisa em logs
CREATE INDEX idx_logs_consultas_tipo ON logs_consultas_infosimples(tipo_consulta);
CREATE INDEX idx_logs_consultas_data ON logs_consultas_infosimples(criado_em DESC);
CREATE INDEX idx_logs_consultas_placa ON logs_consultas_infosimples((parametros->>'placa'));
CREATE INDEX idx_logs_consultas_chassi ON logs_consultas_infosimples((parametros->>'chassi'));

-- Habilitar RLS
ALTER TABLE produto_caracteristicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto_aplicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto_galeria ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_consultas_infosimples ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para características
CREATE POLICY "Todos podem visualizar características de produtos ativos"
  ON produto_caracteristicas FOR SELECT
  USING (EXISTS (SELECT 1 FROM produtos WHERE produtos.id = produto_id AND produtos.ativo = true));

CREATE POLICY "Autenticados podem gerenciar características"
  ON produto_caracteristicas FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas RLS para aplicações
CREATE POLICY "Todos podem visualizar aplicações de produtos ativos"
  ON produto_aplicacoes FOR SELECT
  USING (EXISTS (SELECT 1 FROM produtos WHERE produtos.id = produto_id AND produtos.ativo = true));

CREATE POLICY "Autenticados podem gerenciar aplicações"
  ON produto_aplicacoes FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas RLS para FAQ
CREATE POLICY "Todos podem visualizar FAQ de produtos ativos"
  ON produto_faq FOR SELECT
  USING (EXISTS (SELECT 1 FROM produtos WHERE produtos.id = produto_id AND produtos.ativo = true));

CREATE POLICY "Autenticados podem gerenciar FAQ"
  ON produto_faq FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas RLS para galeria
CREATE POLICY "Todos podem visualizar galeria de produtos ativos"
  ON produto_galeria FOR SELECT
  USING (EXISTS (SELECT 1 FROM produtos WHERE produtos.id = produto_id AND produtos.ativo = true));

CREATE POLICY "Autenticados podem gerenciar galeria"
  ON produto_galeria FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas RLS para logs
CREATE POLICY "Autenticados podem visualizar logs"
  ON logs_consultas_infosimples FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Sistema pode criar logs"
  ON logs_consultas_infosimples FOR INSERT
  WITH CHECK (true);

-- Triggers para atualizado_em
CREATE TRIGGER update_produto_caracteristicas_updated_at
  BEFORE UPDATE ON produto_caracteristicas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column_generic();

CREATE TRIGGER update_produto_aplicacoes_updated_at
  BEFORE UPDATE ON produto_aplicacoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column_generic();

CREATE TRIGGER update_produto_faq_updated_at
  BEFORE UPDATE ON produto_faq
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column_generic();

-- Criar bucket para fotos de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true);

-- Políticas de acesso ao storage
CREATE POLICY "Todos podem visualizar fotos de produtos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'produtos');

CREATE POLICY "Autenticados podem fazer upload de fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'produtos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados podem atualizar fotos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'produtos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados podem deletar fotos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'produtos' AND auth.uid() IS NOT NULL);