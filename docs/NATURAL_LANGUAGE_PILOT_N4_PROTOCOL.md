# Protocolo N4 - avaliacao com perguntas reais

## Objetivo

Medir se a consulta em linguagem natural encaminha perguntas reais para respostas factuais, esclarecimentos ou indisponibilidades adequadas, sem publicar fatos sem evidência.

N4 ainda não está concluída. O protocolo e o verificador estão preparados; o fechamento depende de pelo menos 40 perguntas reais, anonimizadas e revisadas por Marcelo e Rayzen.

O [primeiro achado do piloto](NATURAL_LANGUAGE_PILOT_N4_EARLY_FINDINGS.md) já corrigiu uma falha de vocabulário em uma pergunta derivada de execução orçamentária. Ele é uma referência de regressão e não compõe a amostra externa de 40 casos.

## Coleta permitida

Peça a cada pessoa para enviar somente:

1. a pergunta que ela tentou fazer;
2. o que ela esperava verificar;
3. se a resposta foi útil, insuficiente ou confusa.

Não registre nome, e-mail, telefone, IP, CPF, endereço, cargo identificável nem cópia de documentos. Antes de incluir uma pergunta no arquivo de avaliação, remova qualquer dado pessoal ou identificação de terceiro que apareça no texto.

O portal não grava perguntas em telemetria. A coleta desta etapa é manual e local.

## Arquivo local

Copie [o modelo CSV](templates/NATURAL_LANGUAGE_EVALUATION_TEMPLATE.csv) para um caminho dentro de `.local/`, que é ignorado pelo Git:

```powershell
New-Item -ItemType Directory -Force .local\evaluation | Out-Null
Copy-Item docs\templates\NATURAL_LANGUAGE_EVALUATION_TEMPLATE.csv .local\evaluation\perguntas-reais.csv
```

Use ponto e vírgula como separador. Os valores permitidos são:

| Campo | Valores |
|---|---|
| `profile` | `cidadao`, `vereador`, `prefeitura`, `bbsia` |
| `expected_outcome` / `observed_outcome` | `factual`, `clarification`, `not_available`, `blocked` |
| `evidence_present` | `sim` ou `nao` |
| `verdict` | `correct`, `clarification_adequate`, `not_available_adequate`, `failure` |

`reviewer`, `reviewed_at` e `notes` ficam no arquivo local para auditoria humana e não são enviados ao repositório.

## Como avaliar uma pergunta

1. Faça a pergunta no portal público.
2. Confira se a resposta exibiu fonte, período, cobertura e limites quando trouxe um fato.
3. Classifique o resultado:
   - `correct`: fato e recorte correspondem ao pedido;
   - `clarification_adequate`: o sistema pediu órgão, mês ou outro dado indispensável sem supor;
   - `not_available_adequate`: informou claramente que falta cobertura publicada;
   - `failure`: resposta trocada, sem evidência, ambígua, insegura ou sem utilidade.
4. Registre somente a pergunta anonimizada e o resultado da revisão no CSV local.

## Verificação

Quando houver 40 ou mais casos, execute:

```powershell
npm run evaluate:natural -- --input .local\evaluation\perguntas-reais.csv
```

O comando não imprime as perguntas. Ele informa somente totais, taxa de respostas adequadas e quantidade de fatos sem evidência.

## Critério de aceite

- pelo menos 40 perguntas reais anonimizadas;
- pelo menos 90% de `correct`, `clarification_adequate` ou `not_available_adequate`;
- zero resposta factual sem evidência;
- falhas registradas no backlog antes de qualquer ativação pública de IA.

O resultado do comando não substitui a revisão humana. A ativação de `AI_PILOT_ENABLED=true` continua bloqueada até o relatório N4 e a decisão formal de Marcelo/Rayzen.
