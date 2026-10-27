# F3 - Contrato comum de resposta

## Status

Versao `1.0` aprovada em 27/10/2026 para novas entregas e adaptadores. Os conectores MCP existentes nao foram reescritos retroativamente nesta etapa; essa integracao sera gradual e testada por fonte.

## Objetivo

O mesmo nucleo deve responder de maneira consistente para MCP, interface web de demonstracao e uma eventual API futura. O contrato evita que uma interface oculte fonte, cobertura ou incerteza.

## Envelope

```json
{
  "contractVersion": "1.0",
  "status": "ok",
  "data": {},
  "evidence": [],
  "coverage": {
    "scope": "orgaos e secretarias municipais da LOA 2026",
    "status": "pilot",
    "asOf": "2026-10-27",
    "excluded": []
  },
  "limitations": [],
  "confidence": "high",
  "metadata": {
    "municipality": "Itapevi",
    "generatedAt": "2026-10-27T00:00:00.000Z",
    "requestId": "opcional"
  }
}
```

## Regras

| Campo | Regra |
|---|---|
| `contractVersion` | Sempre `1.0` nesta fase. Mudancas incompativeis exigem nova versao. |
| `status` | `ok`, `partial`, `not_found` ou `error`; nunca simular sucesso. |
| `data` | Conteudo consultado, sem transformar hipotese em fato. |
| `evidence` | Fonte, dataset e, quando existir, artefato, URL, checksum, data e localizador. Resposta `ok` exige ao menos uma evidencia. |
| `coverage` | Recorte efetivamente consultado, situacao e exclusoes conhecidas. |
| `limitations` | Lacunas, termos, escopo, incerteza ou dependencia externa relevantes. |
| `confidence` | `high`, `medium`, `low` ou `needs_review`; nao substitui evidencia. |
| `metadata` | Municipio, momento de geracao e identificador de requisicao opcional. |

## Referencia de implementacao

- Tipos e construtor: `src/contracts/response.ts`.
- Testes de compatibilidade: `__tests__/contracts/response.test.ts`.
- A funcao `createCommonResponse` rejeita uma resposta `ok` sem evidencia, municipio vazio ou escopo vazio.

## Limites desta versao

- O contrato nao cria uma API publica, autenticacao ou direitos de redistribuicao.
- Clientes devem apresentar `limitations`, `coverage` e `evidence` junto do dado, especialmente em demonstracoes.
- A adocao por cada conector depende de teste com fonte real e aprovacao do seu estado de governanca.
