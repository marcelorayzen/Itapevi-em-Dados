# F2 - Consulta citavel de entidades e evidencias

## Consulta entregue

O comando local abaixo recupera aliases de orgaos e secretarias com seus respectivos elos de proveniencia:

```powershell
npm run db:inspect:f2
```

Cada registro retorna:

- `canonical_name`, somente quando a identidade foi aceita;
- `alias_text`, como apareceu no documento;
- `resolution_status` e `confidence`;
- organizacao de origem e dataset;
- checksum do artefato;
- pagina e secao no campo `locator`.

## Resultado validado

Em 27/10/2026, a execucao no PostgreSQL local retornou:

| Alias | Estado | Elo citavel |
|---|---|---|
| `SECRETARIA DE GOVERNO` | `accepted` | LOA 2026, checksum do artefato, pagina 51 e secao `orgao_orcamentario`. |
| `SECRETARIA DES. URBANO ORDENACAO DO SOLO` | `needs_review` | LOA 2026, checksum do artefato, pagina 82 e secao `orgao_orcamentario`; sem entidade canonica. |

O segundo resultado demonstra que a consulta nao oculta incerteza: a ausencia de nome canonico e parte da resposta auditavel.

## Cobertura e limites

- Cobre somente o piloto LOA 2026 e o recorte de orgaos/secretarias municipais.
- Nao representa empresas, licitacoes, contratos, pessoas, gastos ou execucao orcamentaria.
- Nao autoriza publicacao ou redistribuicao do documento e seus derivados.
- A consulta e local, voltada a desenvolvimento e auditoria; ela nao e uma API publica ou painel para usuarios.
