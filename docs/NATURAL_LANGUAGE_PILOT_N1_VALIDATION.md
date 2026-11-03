# Validacao N1 - contrato de perguntas naturais

**Status:** concluida em 03/11/2026. O classificador ainda nao esta exposto na rota publica.

## O que foi implementado

- esquema JSON fechado para intencao, entidade, periodo, filtros permitidos e confianca;
- validacao local com Zod antes de qualquer futuro roteamento para PostgreSQL;
- recusa fechada para JSON invalido, campos adicionais, baixa confianca e filtros incompletos;
- classificacao com resposta estruturada do Workers AI, sem SQL, credenciais, fatos ou acesso ao banco pelo modelo.

## Limites verificados

| Caso | Resultado esperado |
|---|---|
| JSON invalido | nao e roteado |
| `confidence` diferente de `high` | nao e roteado |
| unidade de saude sem mes e ano | nao e roteada |
| campo `sql` ou qualquer campo extra | nao e roteado |
| erro ou indisponibilidade do modelo | retorna `null` para a rota usar o fallback seguro |

## Evidencia de teste

O teste automatizado do Worker cobre um objeto valido, JSON invalido, baixa confianca, periodo incompleto e uma tentativa de injecao de SQL. N1 nao altera a resposta publica: `AI_PILOT_ENABLED` continua `false` ate a conclusao de N2, N3 e N4.
