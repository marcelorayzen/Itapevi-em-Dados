# P0 - Revisão de termos e licenças das fontes

## Resultado desta rodada

Esta é uma revisão documental inicial, não parecer jurídico. Nenhuma fonte teve seu estado alterado para `allowed`, pois uma prévia privada ou publicação exige evidência específica de licença/termos e decisão humana registrada por dataset.

## Evidências encontradas

| Fonte/dataset | Evidência oficial | Leitura conservadora | Estado após revisão |
|---|---|---|---|
| IBGE - localidades e indicador 29171 | [Dados Abertos do IBGE](https://www.ibge.gov.br/acesso-informacao/dados-abertos.html) publica o Plano de Dados Abertos; o [PDA 2024-2025](https://www.ibge.gov.br/np_download/novoportal/documentos_institucionais/Plano_de_Dados_Abertos_IBGE_2024_2025.pdf) define dados abertos como disponibilizados sob licença aberta | Há fundamento institucional para abertura, mas a revisão ainda precisa confirmar a licença, atribuição e escopo aplicáveis ao indicador/API usado | `pending_review` |
| TCESP - despesas agregadas | O [Guia Técnico de Transparência Municipal](https://www.tce.sp.gov.br/sites/default/files/publicacoes/Guia%20T%C3%A9cnico%20de%20Transpar%C3%AAncia%20Municipal%20-%202019.pdf) descreve os requisitos de dados abertos, acesso automatizado e reutilização no contexto da LAI | O guia é orientação normativa, não termo específico da API de despesas utilizada; não prova sozinho permissão de republicar derivados pela aplicação | `pending_review` |
| Prefeitura de Itapevi - LOA e painel LAI | O portal e os documentos são oficiais e o uso local controlado foi aprovado | Não foi localizado termo específico de redistribuição para a exportação do painel, o PDF da LOA ou seus derivados | `pending_review` |

## Cópias locais fornecidas pelo decisor

Em 29/10/2026, Marcelo forneceu cópias locais dos documentos institucionais abaixo. Elas permanecem em `Downloads`, fora do repositório e não foram publicadas ou adicionadas ao Git.

| Documento | SHA-256 local | Uso nesta revisão |
|---|---|---|
| `Plano_de_Dados_Abertos_IBGE_2024_2025.pdf` | `9C56D0C952A326D9489E2E829FA12795570AE8FB65D34633268F03B22B599E02` | confirma a cópia analisada do PDA citado na evidência oficial; não substitui confirmação de licença/atribuição do indicador 29171 |
| `Guia Técnico de Transparência Municipal - 2019.pdf` | `7686A32A975A8AAA50CB59CF7A341CD1FC72518E3585958B014994DC02E950EC` | confirma a cópia analisada do guia do TCE-SP; não substitui termo específico da API ou dos dados municipais |

### Leitura local verificada

O leitor local `pypdf 6.21.4` foi usado somente para consulta dos arquivos em `Downloads`; nenhum texto extraído ou PDF foi adicionado ao Git.

- O PDA do IBGE apresenta, nas páginas 7, 9 e 20 do PDF, sua finalidade de disseminação de dados abertos, a vinculação à Política de Dados Abertos e a publicação de conjuntos em formato aberto.
- O guia do TCE-SP, nas páginas impressas 52 a 54 (páginas 54 a 56 do arquivo), afirma acesso livre, formatos abertos e não proprietários e descreve dados abertos como utilizáveis, reutilizáveis e distribuíveis. O próprio guia cita a LAI e orientações gerais de transparência.

Essas passagens fortalecem a justificativa de transparência e abertura, mas não identificam um termo de uso, licença, atribuição ou escopo específico para a API do TCESP, o painel LAI de Itapevi ou os derivados deste projeto. Por isso, os estados permanecem `pending_review`.

## Critério para liberar um dataset na prévia privada

O responsável pela revisão deve confirmar e registrar, para cada dataset:

1. URL oficial do termo, licença ou metadado aplicável ao recurso exato;
2. condição de reutilização, atribuição, atualização e redistribuição de derivados;
3. se há restrição por dados pessoais, sigilo, finalidade ou contexto;
4. quais campos e agregações entram na allowlist;
5. decisão, responsável e data de revisão.

Só após isso podem ser atualizados, de forma coerente: `sources.redistribution_status = allowed`, `datasets.status = active` e `artifacts.publication_status = approved_for_publication`.

## O que não é suficiente

- a informação estar visível em portal público;
- a licença Apache-2.0 do código;
- uma orientação genérica sobre transparência;
- a autorização para teste local controlado;
- a inexistência de bloqueio técnico de download.

## Próximo ato humano recomendado

Começar pelo indicador populacional do IBGE, por ser agregado, sem dado pessoal no recorte e já usado no conector. Confirmar no canal oficial do IBGE a licença/atribuição aplicável ao indicador 29171 e registrar a decisão antes de disponibilizá-lo na prévia privada.
