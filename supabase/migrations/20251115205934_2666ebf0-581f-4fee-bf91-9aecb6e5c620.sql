-- Adicionar coluna para armazenar dados do veículo junto com o pagamento
ALTER TABLE pagamentos 
ADD COLUMN dados_veiculo JSONB;