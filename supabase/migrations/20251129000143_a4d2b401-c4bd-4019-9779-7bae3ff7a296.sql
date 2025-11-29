-- Adicionar novas colunas na tabela logs_consultas_infosimples
ALTER TABLE public.logs_consultas_infosimples
ADD COLUMN IF NOT EXISTS codigo_resposta INTEGER,
ADD COLUMN IF NOT EXISTS endpoint TEXT,
ADD COLUMN IF NOT EXISTS api_conectou BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS erro_tipo TEXT;

-- Criar tabela de códigos de erro da API
CREATE TABLE IF NOT EXISTS public.codigos_erro_api (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo INTEGER NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  cobranca BOOLEAN NOT NULL DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.codigos_erro_api ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para codigos_erro_api
CREATE POLICY "Autenticados podem visualizar códigos de erro"
ON public.codigos_erro_api
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Autenticados podem gerenciar códigos de erro"
ON public.codigos_erro_api
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Inserir códigos de erro
INSERT INTO public.codigos_erro_api (codigo, descricao, cobranca) VALUES
(200, 'A requisição foi processada com sucesso.', true),
(600, 'Um erro inesperado ocorreu e será analisado.', false),
(601, 'Não foi possível se autenticar com o token informado.', false),
(602, 'O serviço informado na URL não é válido.', false),
(603, 'O token informado não tem autorização de acesso ao serviço. Verifique se ele continua ativo e se ele não possui algum limite de uso especificado.', false),
(604, 'A consulta não foi validada antes de pesquisar a fonte de origem.', false),
(605, 'A consulta não foi realizada dentro do tempo de limite de timeout especificado.', false),
(606, 'Parâmetros obrigatórios não foram enviados. Por favor, verifique a documentação de uso do serviço.', true),
(607, 'Parâmetro(s) inválido(s).', true),
(608, 'Os parâmetros foram recusados pelo site ou aplicativo de origem que processou esta consulta.', true),
(609, 'Tentativas de consultar o site ou aplicativo de origem excedidas.', false),
(610, 'Falha em resolver algum tipo de CAPTCHA.', false),
(611, 'Os dados estão incompletos no site ou aplicativo de origem e não puderam ser retornados.', true),
(612, 'A consulta não retornou dados no site ou aplicativo de origem no qual a automação foi executada.', true),
(613, 'A consulta foi bloqueada pelo servidor do site ou aplicativo de origem. Por favor, tente novamente.', false),
(614, 'Um erro inesperado com o site ou aplicativo de origem ocorreu. Por favor, tente novamente.', false),
(615, 'O site ou aplicativo de origem parece estar indisponível.', false),
(617, 'Contate o prestador de serviço. Há uma sobrecarga de uso do serviço.', false),
(618, 'O site ou aplicativo de origem está sobrecarregado. Tente novamente em alguns instantes.', false),
(619, 'O parâmetro enviado sofreu alterações no site ou aplicativo de origem. Verifique a alteração diretamente no site ou aplicativo de origem.', true),
(620, 'O site ou aplicativo de origem emitiu um erro que provavelmente não mudará em breve para esta consulta. Leia-o para saber mais.', true),
(621, 'Houve um erro ao tentar gerar o arquivo de visualização desta requisição.', false),
(622, 'Parece que você está tentando realizar a mesma consulta diversas vezes seguidas. Por favor, verifique se há algum problema em sua integração. Se acredita que está tudo certo, entre em contato com o suporte.', false)
ON CONFLICT (codigo) DO NOTHING;