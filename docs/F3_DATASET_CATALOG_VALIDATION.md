# F3 - Catalogo navegavel de datasets

## Acesso local

Com PostgreSQL local em execucao, rode:

```powershell
npm run db:catalog
```

O comando produz o contrato comum `1.0` em JSON. Ele foi pensado para alimentar MCP e a futura interface web sem perder governanca.

## Campos apresentados

Para cada dataset, o catalogo apresenta:

- fonte e organizacao responsavel;
- URL base e URL de termos, quando registrada;
- status de redistribuicao e data de revisao;
- escopo, frequencia de atualizacao, versao do esquema e estado do dataset;
- quantidade de artefatos e ultima coleta;
- cobertura, limitacoes e nivel de confianca do resultado.

## Validacao local em 27/10/2026

O catalogo retornou o dataset `DS-LOA-2026`, associado a fonte `SRC-LOA-2026-001`, com um artefato registrado. O resultado preservou `redistributionStatus: pending_review`, `termsUrl: null` e `confidence: needs_review`.

Portanto, a tela futura podera mostrar o dataset, mas nao devera sugerir que ha permissao de redistribuicao ou que a cobertura e completa.

## Limites

- O catalogo e local e representa somente fontes ja registradas no PostgreSQL.
- Ele nao consulta portais externos nem altera registros.
- O catalogo nao e uma aprovacao juridica dos termos da fonte.
