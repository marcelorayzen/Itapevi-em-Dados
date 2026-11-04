# Capacidades e cobertura pública

**Referência:** [estado atual do produto](CURRENT_PUBLIC_PRODUCT_STATUS.md).
**Regra:** a cobertura abaixo é uma lista de recortes publicados, não uma afirmação de cobertura integral do município.

## Regra de resposta

Uma resposta numérica só é emitida quando tema, entidade, período e medida estiverem cobertos por fatos aprovados. Caso contrário, o portal informa a lacuna sem inventar resultados.

## Capacidades atuais

| Capacidade | Evidência | Limite |
|---|---|---|
| População | Estimativa IBGE, indicador 29171 | Não representa gasto público. |
| Contratos | Exportações LAI com checksum, agregadas de 2024 a 2026 | Agregados por secretaria; não conclui execução, regularidade ou vínculo não publicado. |
| Licitações | Exportações LAI com checksum, agregadas de 2024 a 2026 | Cobertura restrita aos artefatos carregados; não classifica conduta de empresas. |
| Orçamento | Previsto e realizado por órgão/programa | Recortes publicados: 01/09/2026 a 30/09/2026 e 01/10/2026 a 31/10/2026, por `Data de Empenho`; meses não são somados automaticamente. |
| Pronto-socorro e SAMU | Empenhos com menção explícita, por mês | Não inclui despesas sem vínculo explícito; período e unidade devem estar cobertos. |

## Garantias

- Fonte, dataset, checksum, cobertura e limitações acompanham a resposta.
- Dados brutos, documentos e credenciais não são expostos publicamente.
- Perguntas acusatórias não geram conclusões sobre conduta.
- A IA do piloto interpreta somente intenções permitidas; fatos e evidências continuam vindo das visões públicas.
- A resposta mostra como refazer a conferência na [trilha de auditoria](PUBLIC_AUDIT_TRAIL.md).
