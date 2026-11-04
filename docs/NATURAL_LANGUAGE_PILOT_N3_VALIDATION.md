# Validacao N3 - cobertura orcamentaria por orgao

**Status:** concluida em 03/11/2026. A interpretacao por IA continua desativada para usuarios publicos.

## O que a consulta responde

O Worker responde, com dados agregados da visao `public_api.budget_execution_summary`:

- quais orgaos aparecem no recorte orcamentario publicado;
- valor previsto e realizado de um orgao catalogado;
- ausencia de registro para um orgao ou periodo fora da cobertura.

O classificador e as regras deterministicas trabalham apenas com identificadores fechados de 20 orgaos retornados pela fonte. Nenhum nome fornecido pelo modelo vira SQL ou filtro livre.

## Cobertura validada

- **Fonte:** Portal da Transparencia de Itapevi.
- **Dataset:** `DS-LAI-PREVISTO-EMPENHADO-2026`.
- **Periodo:** 01/09/2026 a 30/09/2026, conforme o filtro da exportacao.
- **Resultado da leitura real:** 20 orgaos com valores previstos no recorte.
- **Evidencia:** checksum do artefato retornado junto de cada resposta publica.

O resultado nao afirma que a lista representa todo o orcamento municipal ou todos os orgaos existentes; ele representa somente as linhas devolvidas pelo painel naquele periodo.

## Regras de periodo

O unico exercicio publicado nesta rota e 2026, com cobertura mensal de setembro. Perguntas para outro exercicio ou mes recebem uma indisponibilidade explicavel, sem substituicao por outro periodo.

## Evidencias de validacao

- testes automatizados do Worker: 18 aprovados;
- testes do repositorio principal: 30 aprovados;
- consulta de leitura real na visao publica: 20 orgaos e um checksum de artefato retornados;
- bundle do Worker validado com `wrangler deploy --dry-run`;
- auditoria de dependencias de producao: zero vulnerabilidades.
