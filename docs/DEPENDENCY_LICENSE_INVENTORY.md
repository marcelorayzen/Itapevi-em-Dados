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
| supertest | 7.2.2 | MIT |
| ts-jest | 29.4.6 | MIT |
| tsx | 4.21.0 | MIT |
| typescript | 5.9.3 | Apache-2.0 |
| zod | 3.25.76 | MIT |

## Pendências

- [x] Inventariar dependências transitivas a partir do lockfile.
- [ ] Validar avisos, obrigações de atribuição e compatibilidade antes de release estável.
- [ ] Registrar exceções e responsável pela revisão.

## Varredura transitiva

_Executada localmente em 25/10/2026 a partir do `package-lock.json` (lockfile v3). A varredura lê a licença declarada em cada `package.json` disponível; ela não substitui revisão jurídica._

| Resultado | Quantidade de entradas transitivas |
|---|---:|
| MIT | 360 |
| ISC | 40 |
| BSD-2-Clause | 13 |
| BSD-3-Clause | 13 |
| Apache-2.0 | 6 |
| BlueOak-1.0.0 | 4 |
| MIT OR CC0-1.0 | 2 |
| CC-BY-4.0 | 1 |
| Sem manifesto local disponível para leitura | 50 |
| **Total no lockfile** | **489** |

As 50 entradas sem manifesto local podem corresponder a pacotes opcionais, não instalados na plataforma atual ou ausentes da árvore local. Elas exigem inspeção pela fonte do pacote/lockfile antes de uma release estável. Licenças de documentação e dados, como `CC-BY-4.0`, não são automaticamente equivalentes à licença do código e devem ser revisadas no contexto de uso.
