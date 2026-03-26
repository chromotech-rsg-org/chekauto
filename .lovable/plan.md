

## Plano de Implementação

### 1. Floating Labels nos Formulários de Checkout
**Arquivos**: `VehicleData.tsx`, `ClientData.tsx`, `PaymentData.tsx`

Criar um componente wrapper `FloatingLabelInput` que posiciona o label no canto superior esquerdo do campo, sobreposto à borda, com fundo branco para "cortar" a borda. Estilo similar ao Material Design outlined input. O label fica visível mesmo com dados preenchidos.

```text
┌─ Chassi ─────────────┐
│ 928225533012          │
└───────────────────────┘
```

Implementação via CSS: label com `position: absolute`, `top: -8px`, `left: 12px`, `background: white`, `padding: 0 4px`, `font-size: 11px`, `color: gray-500`. Wrapper com `position: relative`.

Aplicar em todos os campos: Chassi, RENAVAM, Ano, Placa, Estado, Cidade, Nome, CPF/CNPJ, CEP, Rua, Número, Bairro, Complemento, E-mail, Telefone, e campos do cartão.

### 2. RENAVAM - Corrigir dados vindos da consulta
**Arquivo**: `src/components/ConsultationModal.tsx` (linha 176)

O RENAVAM vem com caracteres extras da API. Aplicar `.replace(/\D/g, '').slice(0, 11)` ao salvar no CheckoutContext:
```
renavam: (data.identificacao?.renavam || '').replace(/\D/g, '').slice(0, 11),
```

### 3. "Trocar Produto" → "Trocar Solução"
**Arquivo**: `src/pages/PaymentData.tsx` (linha 148)

Alterar texto do botão de "Trocar Produto" para "Trocar Solução". Alterar também o toast de confirmação.

### 4. Texto da Hero
**Arquivo**: `src/components/Hero.tsx` (linhas 109-122)

Alterar textos conforme imagem 2:
- Manter: "Resolva seu RENAVE/BIN com tranquilidade."
- Alterar para: "Solução para implementos em caminhões, caminhonetes e veículos transformados."
- Alterar: "caminhão" → "veículo" no terceiro parágrafo

### Resumo de Arquivos

| Arquivo | Alteração |
|---------|-----------|
| `VehicleData.tsx` | Floating labels em todos os campos |
| `ClientData.tsx` | Floating labels em todos os campos |
| `PaymentData.tsx` | Floating labels nos campos de cartão + "Trocar Solução" |
| `ConsultationModal.tsx` | Limpar RENAVAM ao salvar no contexto |
| `Hero.tsx` | Atualizar textos da hero |

