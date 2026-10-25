# Ontologia inicial

> Modelo V2 planejado: estas entidades não estão todas persistidas no protótipo atual.

## Vocabulário institucional

| Entidade solicitada | Correspondência no modelo |
|---|---|
| Município, Fonte, Dataset, Documento, Evento | Núcleo de escopo, origem e histórico |
| Secretaria, Empresa, Licitação, Contrato | Administração e contratação pública |
| Lei, Projeto Legislativo, Publicação Oficial | Ciclo legislativo e documental |
| Bairro, Indicador | Território e medida temporal |
| Proveniência | Evidência, coleta e transformação |

| Entidade | Identidade mínima | Relações exemplares |
|---|---|---|
| Município | código IBGE | possui Dataset, Bairro, Órgão |
| Dataset | escopo, período, licença | é_publicado_por Fonte |
| Fonte | URL/órgão | origina Documento/Registro |
| Documento | checksum, edição, página | evidencia Evento/Fato |
| Evento | tipo, data de ocorrência | altera Contrato, Licitação, Lei |
| Fato | predicado, valor, unidade, validade | é_evidenciado_por Documento |
| Organização | CNPJ e aliases quando disponíveis | vence Licitação; é contratada |
| Órgão/Secretaria | código/nome canônico | celebra Contrato; executa Despesa |
| Pessoa pública | identificador legislativo | propõe Projeto |
| Lei/Projeto | número e ano | é_originado_de/gera Lei |
| Licitação | número/modalidade/exercício | tem_vencedor; gera Contrato |
| Contrato | número, valor, vigência | tem_aditivo; vincula órgão e organização |
| Território | tipo e geometria/referência | contém/é_referido_por Evento |
| Indicador | definição, período, unidade | mede Território |

Eventos mínimos: `licitacao_publicada`, `licitacao_adjudicada`, `contrato_assinado`, `contrato_aditivado`, `despesa_empenhada`, `pagamento_realizado`, `lei_publicada`, `projeto_proposto` e `indicador_atualizado`.

Cada evento contém `occurred_at`, `recorded_at`, validade quando aplicável e evidências. Uma entidade canônica não elimina seu texto de origem: `EntityAlias` guarda o alias, a fonte, normalização, período e confiança. Fusões são auditáveis e reversíveis; CNPJ e números oficiais são chaves fortes quando presentes.
