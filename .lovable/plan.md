

## Plano: Campos separados de consulta + renomear modal

### Resumo

Separar o campo único "chassi, placa ou renavam" em campos individuais, com lógica condicional: 0KM mostra apenas chassi; usado mostra opção de consultar por chassi OU por placa+renavam. Renomear modal "Selecionar Produto" para "Selecionar Solução".

### 1. Hero (home) - `src/components/Hero.tsx`

**Estado atual**: Um único input "Digite chassi, placa ou renavam" com detecção automática por tamanho.

**Mudança**:
- Adicionar estado `consultType: 'chassi' | 'placa-renavam'` (default: 'chassi')
- Para 0KM: mostrar apenas campo de chassi, sem opção de placa/renavam
- Para usado: mostrar radio/toggle para escolher entre "Chassi" ou "Placa e Renavam"
  - Se "Chassi": um campo para chassi
  - Se "Placa e Renavam": dois campos lado a lado (placa e renavam)
- Ajustar `handleConsult` para usar o tipo correto baseado na seleção
- Estado dropdown bloqueado para 0KM (já funciona)

```text
┌─────────────────────────────────────────────────────┐
│ ○ 0KM  ● Usado   [SP ▾]                            │
│                                                      │
│ ○ Chassi  ● Placa e Renavam   (só para usado)       │
│                                                      │
│ [  Placa  ] [  Renavam  ] [CONSULTAR]               │
└─────────────────────────────────────────────────────┘
```

### 2. Página do Produto - `src/pages/ProductDetail.tsx`

**Estado atual**: Mesmo campo único na seção "Consulta rápida de veículo".

**Mudança** (mesma lógica):
- Adicionar estado `consultType`
- Para 0KM: apenas campo chassi
- Para usado: toggle chassi / placa+renavam com campos separados
- Ajustar `handleConsultaRapida` para usar campos corretos
- Adicionar estados `placaInput` e `renavamInput`

### 3. Modal "Selecionar Solução" - `src/components/ProductSelectModal.tsx`

**Mudança**: Alterar o título do `DialogTitle` de "Selecionar Produto" para "Selecionar Solução".

### Arquivos afetados

| Arquivo | Alteração |
|---------|-----------|
| `Hero.tsx` | Campos separados chassi / placa+renavam com toggle |
| `ProductDetail.tsx` | Mesma lógica de campos separados |
| `ProductSelectModal.tsx` | Título "Selecionar Solução" |

