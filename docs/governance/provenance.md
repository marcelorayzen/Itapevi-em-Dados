# Provenance, Lineage e Trust

## Provenance — de onde veio

Cada fato, relação, resposta e insight deve manter `source_id`, URL/referência da fonte, `source_record_id`, checksum do artefato, localizador (página/seção) e `collected_at`.

## Lineage — como chegou

Para toda saída derivada, registrar a cadeia `artefato bruto -> normalizador -> extrator/regra -> revisão -> projeção -> insight/resposta`, incluindo versões de código, modelo, prompt quando existir, schema e execução.

## Trust

Confiança é atributo da afirmação processada, não verdade absoluta. Combina qualidade da fonte, integridade do artefato, método de extração, validações e revisão humana. A interface expõe score e fatores: `alta` (registro oficial estruturado validado), `média` (documento oficial extraído/consistente) e `baixa` (conflito, scraping incompleto ou extração sem validação).
