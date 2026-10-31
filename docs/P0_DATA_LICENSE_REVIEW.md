# P0 - Revisão de termos e licenças das fontes

## Resultado desta rodada

Esta é uma revisão documental inicial, não parecer jurídico. Em 31/10/2026 houve uma exceção estreita e registrada: o agregado populacional do indicador 29171 do IBGE foi liberado pelo responsável do projeto para consulta pública, com atribuição e limites obrigatórios. Todas as demais fontes continuam a exigir evidência específica de licença/termos e decisão humana registrada por dataset antes de qualquer publicação.

## Evidências encontradas

| Fonte/dataset | Evidência oficial | Leitura conservadora | Estado após revisão |
|---|---|---|---|
| IBGE - indicador 29171, estimativa populacional de Itapevi | [Dados Abertos do IBGE](https://www.ibge.gov.br/acesso-informacao/dados-abertos.html) publica o Plano de Dados Abertos; o [PDA 2024-2025](https://www.ibge.gov.br/np_download/novoportal/documentos_institucionais/Plano_de_Dados_Abertos_IBGE_2024_2025.pdf) define dados abertos como disponibilizados sob licença aberta | Em 31/10/2026, Marcelo aprovou a publicacao limitada do valor agregado deste indicador no portal, com atribuicao ao IBGE, URL da consulta, ano de referencia, data de coleta e limitacoes visiveis. A decisao nao se estende a outros indicadores ou a dados individualizados. | `allowed_for_public_aggregate` |
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

## Próximo ato humano recomendado

Solicitar à Prefeitura de Itapevi a confirmação formal para os datasets municipais candidatos, usando o modelo em [MUNICIPAL_DATA_REUSE_REQUEST.md](MUNICIPAL_DATA_REUSE_REQUEST.md). A resposta precisa indicar recurso, atribuição, redistribuição, campos/granularidade e periodicidade. Enquanto ela não existir, LOA e exportações LAI ficam em uso local controlado.
