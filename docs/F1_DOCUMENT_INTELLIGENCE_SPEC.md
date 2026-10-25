# F1 — Especificação de Document Intelligence

## Objetivo

Extrair fatos estruturados de documentos oficiais sem perder o artefato, a localização da evidência ou os limites de interpretação. Esta especificação é de planejamento; nenhum conector, banco ou pipeline Docling está implementado por ela.

## Trilhas do piloto

| Trilha | Fonte institucional | Formato esperado | Roteamento |
|---|---|---|---|
| Indicadores de contexto | [IBGE](https://servicodados.ibge.gov.br/api/v1) | API/JSON/CSV | normalização direta |
| Atos e publicações | Diário Oficial de Itapevi | PDF e/ou HTML | preservar original; Docling para PDF/documento complexo; parser direto para HTML estruturado |
| Aprovação legislativa | [Câmara de Itapevi — portal legislativo](https://www.camaraitapevi.sp.gov.br/) | página, anexo ou PDF da LOA/emenda | Docling para anexos PDF; normalização direta para dados estruturados |
| Execução financeira | [Prefeitura de Itapevi — transparência](https://itapevi.sp.gov.br/transparencia/) | CSV, HTML ou PDF, a confirmar | priorizar exportação estruturada; Docling somente para documento complexo |
| Gastos do Legislativo | [Portal da Câmara](https://www.camaraitapevi.sp.gov.br/), via ícone Transparência | balancete/adiantamento/diária/folha | Docling para PDFs tabulares; parser direto para CSV/HTML estruturado |

## Contrato mínimo de artefato

Todo item processado deve conter:

```json
{
  "source_id": "SRC-...",
  "source_url": "https://...",
  "collected_at": "timestamp",
  "artifact_checksum": "sha256:...",
  "media_type": "application/pdf",
  "document_locator": { "page": 1, "section": "...", "table": "..." },
  "normalizer_version": "...",
  "extraction_version": "..."
}
```

## Modelos candidatos de extração

### Publicação oficial

`edicao`, `data_publicacao`, `titulo`, `tipo_ato`, `orgao`, `texto_referenciado`, `valor`, `numero_processo`, `pagina` e evidências.

### Emenda parlamentar aprovada

`exercicio`, `autor`, `numero_emenda`, `tipo_emenda`, `orgao_beneficiario`, `acao_beneficiaria`, `funcional_programatica`, `valor_aprovado`, `documento_loa`, `pagina/anexo` e evidências.

### Adiantamento, diária ou gasto de gabinete

`exercicio`, `mes`, `favorecido`, `cargo/lotacao_quando_publico`, `tipo_despesa`, `historico_ou_justificativa`, `numero_empenho`, `valor_empenhado/liquidado/pago`, `nota_ou_documento` e evidências.

### Folha e subsídios

`competencia`, `nome`, `cargo`, `lotacao`, `remuneracao_bruta`, `descontos`, `remuneracao_liquida`, `fonte_documental` e evidências. Dados pessoais além dos divulgados oficialmente não devem ser coletados.

## Regra de vinculação entre emenda e execução

O código de funcional programática é uma pista de associação, não uma chave primária suficiente. Uma relação `emenda -> despesa` só pode ser apresentada como confirmada quando houver evidência documental ou combinação validada de exercício, unidade/órgão, ação, elemento, beneficiário quando aplicável e referência oficial. Caso contrário, o estado deve ser `candidato` ou `não confirmado`.

Estados previstos: `aprovada`, `execucao_candidata`, `empenhada_confirmada`, `liquidada_confirmada`, `paga_confirmada`, `nao_confirmada`.

## Critérios para iniciar implementação

- [-] Confirmar URL e termos do portal de transparência da Câmara. O e-SIC oficial confirmou o domínio e as categorias publicadas; ainda falta identificar a rota técnica, formato e termos específicos de coleta/redistribuição.
- [-] Localizar um PDF real de LOA/emendas e um documento de despesa/adiantamento autorizado para teste. A [LOA 2026](https://itapevi.sp.gov.br/wp-content/uploads/2026/01/loa-lei-no-3.551-2025.pdf) foi localizada como amostra estrutural; ainda falta anexo de emendas individualizadas e documento de despesa/adiantamento.
- [ ] Confirmar se a Prefeitura oferece exportação CSV/HTML e quais campos/documentação acompanham a exportação.
- [ ] Definir retenção de artefatos e responsabilidade institucional pela validação de fonte.
- [ ] Criar conjunto de avaliação com extração manual de referência antes de automatizar Docling.
