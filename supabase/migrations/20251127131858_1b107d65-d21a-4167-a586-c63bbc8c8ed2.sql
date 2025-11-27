-- Adicionar configurações de credenciais InfoSimples se não existirem
INSERT INTO configuracoes_sistema (chave, valor, descricao)
VALUES 
  ('infosimples_a3', '', 'Token da API InfoSimples (a3)')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO configuracoes_sistema (chave, valor, descricao)
VALUES 
  ('infosimples_a3_pin', '', 'Token Secret da API InfoSimples (a3_pin)')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO configuracoes_sistema (chave, valor, descricao)
VALUES 
  ('infosimples_login_cpf', '', 'CPF para login no portal ECRVSP')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO configuracoes_sistema (chave, valor, descricao)
VALUES 
  ('infosimples_login_senha', '', 'Senha para login no portal ECRVSP')
ON CONFLICT (chave) DO NOTHING;