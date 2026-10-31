# P0 - Revisão de termos e licenças das fontes

## Resultado desta rodada

Esta é uma revisão documental inicial, não parecer jurídico. Em 31/10/2026, Marcelo confirmou o acesso, download e uso no projeto das fontes municipais oficiais já catalogadas (LOA, exportações LAI e Diário Oficial), além da exceção já registrada para o agregado populacional do IBGE. A confirmação exige atribuição, recorte e evidência em cada resposta; não transforma a licença Apache-2.0 do código em licença dos arquivos brutos nem autoriza conclusões sem contexto.

## Evidências encontradas

| Fonte/dataset | Evidência oficial | Leitura conservadora | Estado após revisão |
|---|---|---|---|
| IBGE - indicador 29171, estimativa populacional de Itapevi | [Dados Abertos do IBGE](https://www.ibge.gov.br/acesso-informacao/dados-abertos.html) publica o Plano de Dados Abertos; o [PDA 2024-2025](https://www.ibge.gov.br/np_download/novoportal/documentos_institucionais/Plano_de_Dados_Abertos_IBGE_2024_2025.pdf) define dados abertos como disponibilizados sob licença aberta | Em 31/10/2026, Marcelo aprovou a publicacao limitada do valor agregado deste indicador no portal, com atribuicao ao IBGE, URL da consulta, ano de referencia, data de coleta e limitacoes visiveis. A decisao nao se estende a outros indicadores ou a dados individualizados. | `allowed_for_public_aggregate` |
| TCESP - despesas agregadas | O [Guia Técnico de Transparência Municipal](https://www.tce.sp.gov.br/sites/default/files/publicacoes/Guia%20T%C3%A9cnico%20de%20Transpar%C3%AAncia%20Municipal%20-%202019.pdf) descreve os requisitos de dados abertos, acesso automatizado e reutilização no contexto da LAI | O guia é orientação normativa, não termo específico da API de despesas utilizada; não prova sozinho permissão de republicar derivados pela aplicação | `pending_review` |
| Prefeitura de Itapevi - LOA e painel LAI | O portal e os documentos são oficiais; Marcelo confirmou em 31/10/2026 acesso, download e uso no projeto | Os derivados devem preservar fonte, período, filtros e limites. A confirmação institucional arquivável continua recomendada, mas não bloqueia a coleta e a demonstração baseada em evidência autorizadas pelo responsável. | `allowed_for_project_use` |
| Prefeitura de Itapevi - Diário Oficial | [Página oficial do Diário Oficial](https://itapevi.sp.gov.br/diario-oficial/) identifica edições por número/data e disponibiliza PDF; a edição 1612 de 30/10/2026 foi verificada localmente | Marcelo confirmou em 31/10/2026 coleta e uso no projeto. O primeiro recorte é metadados e trechos estruturais citáveis, com edição, data, página e URL; PDF bruto fica fora do Git. | `allowed_for_project_use` |

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

## Decisao operacional registrada: IBGE 29171

O indicador populacional 29171 para o municipio 3522505 esta na allowlist publica do Worker. A decisao se baseia na fonte institucional aberta, no recorte municipal agregado e na aprovacao humana registrada em 31/10/2026. A API deve manter atribuicao, URL, ano, coleta, cobertura e limites em toda resposta.

Esta decisao operacional nao e parecer juridico e nao libera automaticamente localidades, outros indicadores, microdados ou qualquer fonte municipal.

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

## Verificação de disponibilidade do portal municipal

Em 31/10/2026 foi feita nova tentativa técnica de consulta ao painel municipal `https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418`, procurando termos de uso, privacidade, LGPD, dados abertos e reutilização. O servidor respondeu `HTTP 503 Service Unavailable`; portanto, a indisponibilidade não é evidência de ausência de termos e não altera o estado do dataset.

## Decisão operacional municipal registrada

Marcelo confirmou em 31/10/2026 que os dados municipais oficiais já identificados podem ser acessados e baixados para uso no projeto. A decisão permite avançar com coleta, normalização, consultas e demonstração orientada a evidências. O projeto preserva os seguintes limites: não versionar PDFs/ZIPs brutos, não retirar contexto de período/filtros e não usar fatos extraídos para acusações ou conclusões de irregularidade.

O modelo em [MUNICIPAL_DATA_REUSE_REQUEST.md](MUNICIPAL_DATA_REUSE_REQUEST.md) continua útil para obter confirmação institucional arquivável, mas deixa de bloquear a coleta técnica autorizada pelo responsável do projeto.
