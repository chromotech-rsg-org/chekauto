-- Atualizar token do InfoSimples
UPDATE configuracoes_sistema 
SET valor = '9D64LQ6rKM7MzOHOXeyZIKrCopG7CQLBQglEtv18',
    atualizado_em = now()
WHERE chave = 'INFOSIMPLES_TOKEN';

-- Se o token não existir, inserir
INSERT INTO configuracoes_sistema (chave, valor, descricao)
SELECT 'INFOSIMPLES_TOKEN', '9D64LQ6rKM7MzOHOXeyZIKrCopG7CQLBQglEtv18', 'Token da API InfoSimples'
WHERE NOT EXISTS (
  SELECT 1 FROM configuracoes_sistema WHERE chave = 'INFOSIMPLES_TOKEN'
);