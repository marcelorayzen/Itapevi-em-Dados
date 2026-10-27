# Inventário inicial de dependências e licenças

_Leitura local em 25/10/2026. Este inventário é inicial e não substitui revisão jurídica nem análise das dependências transitivas antes de uma release estável._

| Dependência direta | Versão instalada | Licença declarada |
|---|---:|---|
| @modelcontextprotocol/sdk | 0.5.0 | MIT |
| @types/express | 5.0.6 | MIT |
| @types/jest | 30.0.0 | MIT |
| @types/node | 20.19.37 | MIT |
| @types/supertest | 7.2.0 | MIT |
| axios | 1.13.6 | MIT |
| axios-mock-adapter | 2.1.0 | MIT |
| cheerio | 1.2.0 | MIT |
| csv-parse | 6.2.0 | MIT |
| dotenv | 16.6.1 | BSD-2-Clause |
| express | 5.2.1 | MIT |
| jest | 30.3.0 | MIT |
| node-cache | 5.1.2 | MIT |
| pg | 8.23.1 | MIT |
| supertest | 7.2.2 | MIT |
| ts-jest | 29.4.6 | MIT |
| tsx | 4.21.0 | MIT |
| typescript | 5.9.3 | Apache-2.0 |
| zod | 3.25.76 | MIT |
| @types/pg | 8.23.1 | MIT |

## Pendências

- [x] Inventariar dependências transitivas a partir do lockfile.
- [ ] Validar avisos, obrigações de atribuição e compatibilidade antes de release estável.
- [x] Registrar responsável pela revisão: Marcelo Augusto.

## Varredura transitiva

_Atualizada localmente em 27/10/2026 a partir do `package-lock.json` (lockfile v3). A varredura lê a licença declarada em cada `package.json` disponível; ela não substitui revisão jurídica._

| Resultado | Quantidade de entradas transitivas |
|---|---:|
| MIT | 373 |
| ISC | 42 |
| BSD-2-Clause | 13 |
| BSD-3-Clause | 13 |
| Apache-2.0 | 6 |
| BlueOak-1.0.0 | 4 |
| MIT OR CC0-1.0 | 2 |
| CC-BY-4.0 | 1 |
| Sem manifesto local disponível para leitura | 50 |
| **Total no lockfile** | **504** |

As 50 entradas sem manifesto local podem corresponder a pacotes opcionais, não instalados na plataforma atual ou ausentes da árvore local. Elas exigem inspeção pela fonte do pacote/lockfile antes de uma release estável. Licenças de documentação e dados, como `CC-BY-4.0`, não são automaticamente equivalentes à licença do código e devem ser revisadas no contexto de uso.

## Roteiro de validação humana

Esta revisão é uma decisão operacional documentada; não substitui parecer jurídico quando houver dúvida, distribuição comercial, dados de terceiros ou licença não padronizada.

1. Fixar o escopo: nesta fase, o repositório distribui **código-fonte sob Apache-2.0**, e não dados públicos nem uma imagem/container com dependências empacotadas.
2. Conferir as dependências diretas e as licenças transitivas identificadas neste documento contra o manifesto e o texto de licença do pacote. Identificadores SPDX padronizam essa conferência, mas a declaração no `package.json` não é, isoladamente, parecer jurídico.
3. Tratar como bloqueio para release qualquer licença ausente, expressão ambígua, licença proprietária, ou licença copyleft forte que imponha condição incompatível com o modo de distribuição pretendido. Escalar esses casos para assessoria jurídica.
4. Para dependências permissivas, preservar os avisos de copyright, textos de licença e atribuições exigidas quando houver distribuição de artefato que as contenha. Antes de publicar um pacote npm, executar `npm pack --dry-run` para revisar exatamente os arquivos distribuídos.
5. Revisar explicitamente as 50 entradas sem manifesto local e a ocorrência `CC-BY-4.0`; registrar o pacote, a fonte do texto de licença, a conclusão e eventual obrigação em uma exceção versionada.
6. Registrar abaixo a decisão, data, versão do lockfile revisada e limites. Reavaliar quando `package-lock.json` mudar ou antes de uma release estável.

### Registro de aprovação

| Campo | Preenchimento |
|---|---|
| Responsável | Marcelo Augusto |
| Data da revisão | — |
| Escopo revisado | Dependências do `package-lock.json` v3 e distribuição de código-fonte do repositório |
| Resultado | — |
| Exceções/pendências | 50 manifestos locais indisponíveis; uma ocorrência `CC-BY-4.0` |
| Próxima revisão | Antes de release estável ou alteração do lockfile |
