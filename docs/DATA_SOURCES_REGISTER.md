# Registro de fontes e condições de uso

**Referência de publicação:** [CURRENT_PUBLIC_PRODUCT_STATUS.md](CURRENT_PUBLIC_PRODUCT_STATUS.md).
**Leitura jurídica/operacional:** este registro não é parecer jurídico e não transforma a licença Apache-2.0 do código em licença de dados. A publicação atual usa recortes agregados, rastreáveis e aprovados pelo responsável do projeto; a confirmação institucional arquivável de termos específicos por dataset continua como trabalho de governança.

Em 31/10/2026, Marcelo confirmou ao projeto que os recursos municipais oficiais aqui indicados podem ser acessados, baixados e usados no projeto e na demonstração pública governada. A decisão não autoriza publicar arquivos brutos indiscriminadamente: cada resposta permanece vinculada a origem, edição/período, recorte, checksum e evidência.

| ID | Fonte | Uso atual | Estado | Termos e redistribuição |
|---|---|---|---|---|
| SRC-IBGE-001 | API de localidades e indicador populacional do IBGE | identificacao municipal e estimativa populacional de Itapevi, codigo 3522505, indicador 29171 | allowlist publica limitada | Uso limitado ao valor agregado do indicador 29171, com atribuição ao IBGE, URL da consulta, ano, data de coleta e limites obrigatórios. Não libera outros indicadores nem dados individualizados. |
| SRC-DO-001 | Gazeta SP, publicidade legal de Itapevi | Busca de títulos, datas e links de publicações | experimental | evidência preliminar: [portal de publicidade legal](https://publicidadelegal.gazetasp.com.br/); não foi localizada permissão explícita de redistribuição no levantamento inicial; validar termos e scraping antes de uso derivado |
| SRC-PREF-DO-001 | Prefeitura de Itapevi, Diário Oficial | edições oficiais, leis, atos e publicações administrativas | aprovado para coleta e uso no projeto | [página oficial](https://itapevi.sp.gov.br/diario-oficial/) lista edições por número/data e fornece PDF para download; Marcelo confirmou em 31/10/2026 o uso no projeto. PDFs brutos permanecem fora do Git; respostas devem citar edição, data, página e URL. |
| SRC-MM-001 | MeuMunicípio, perfil de Itapevi | Indicadores baseados no Censo 2010 | experimental | evidência preliminar: [termos de uso](https://meumunicipio.org.br/termos-de-uso); confirmar permissões de coleta e redistribuição antes de uso derivado |
| SRC-PLACEHOLDER-001 | Despesas | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-002 | Demandas | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-003 | Legislação | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-004 | Licitações | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-CAMARA-LEG-001 | Câmara de Itapevi, atividade legislativa | LOA, proposituras, emendas e anexos | candidato F1 | e-SIC oficial informa que o ícone Legislativo disponibiliza proposituras, legislação e subdocumentos, incluindo emendas; confirmar URL específica do documento e termos antes de coleta |
| SRC-CAMARA-TRANS-001 | Transparência da Câmara de Itapevi | adiantamentos, diárias, gastos e folha | candidato F1 | e-SIC oficial informa que o portal contém fases de empenho, liquidação e pagamento, relatórios orçamentários e remuneração; confirmar rota, formato e termos antes de coleta |
| SRC-PREF-TRANS-001 | Prefeitura de Itapevi, transparência | página institucional de entrada para despesas e execução financeira | referência oficial | [portal atual](https://itapevi.sp.gov.br/transparencia/) aponta para transparência/e-Transparência; não substitui os identificadores específicos dos datasets publicados abaixo |
| SRC-PREF-TRANS-LEGACY-001 | Prefeitura de Itapevi, portal legado | despesas e balancetes | referência histórica | URL informada (`portaltransparencia/home/index.php`) é oficial, mas a seção visível de despesas lista períodos até 2014; não usar para execução atual sem revalidação |
| SRC-LOA-2026-001 | Prefeitura de Itapevi, Lei nº 3.551/2025 (LOA 2026) | orçamento aprovado e tabelas orçamentárias | aprovado para coleta e uso no projeto | [PDF oficial](https://itapevi.sp.gov.br/wp-content/uploads/2026/01/loa-lei-no-3.551-2025.pdf), 341 páginas; confirmação de uso por Marcelo em 31/10/2026; cada derivado público deve manter recorte, fonte e limites, sem inferir emendas individualizadas ou execução financeira. |
| SRC-PREF-LAI-001 | Prefeitura de Itapevi, painel LAI de empenhos detalhados | pagamentos mensais com referência explícita a pronto-socorro ou SAMU | publicado como agregado governado | painel em `https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418`; publicação limitada ao vínculo textual explícito, período e agregação retornados. Não expõe linhas brutas. |
| SRC-PREF-LAI-BUDGET-001 | Prefeitura de Itapevi, painel LAI Previsto e Empenhado | exportação agregada por programa, ação e órgão responsável | publicado como agregado governado | painel em `https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418`; recorte JSON de setembro e recorte CSV de outubro de 2026 foram normalizados com período, filtro e checksum. O CSV não traz os filtros no arquivo; `Data de Empenho`, 01/10/2026–31/10/2026, foi confirmado pelo operador a partir da tela oficial e é identificado como tal na proveniência. Publicação mantém períodos separados, sem soma automática. |
| SRC-PREF-LAI-PROCUREMENT-001 | Prefeitura de Itapevi, painel LAI Compras por Tipo de Licitação | exportação de compras por modalidade, em CSV | publicado como agregado governado | painel em `https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418`; o portal mostra totais/modalidades e preserva processo/objeto no artefato local. |
| SRC-PREF-LAI-CONTRACTS-001 | Prefeitura de Itapevi, painel LAI de contratos | exportação agregada de contratos por secretaria | publicado como agregado governado | painel em `https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418`; o portal mostra somente agregados e vincula cada resposta ao checksum e à cobertura carregada. |

## Campos obrigatórios antes de ampliar publicação

- URL e órgão responsável;
- finalidade e escopo da coleta;
- periodicidade e mecanismo de atualização;
- licença, termos de uso e condição de redistribuição;
- contato/responsável pela validação;
- data da última revisão;
- método de coleta, limitações e evidência de origem.

## Regra de manutenção

Um novo dataset só entra no portal após constar neste registro, ter artefato/checksum, recorte e agregação definidos, teste de resposta, trilha de auditoria e atualização de [capacidades](CAPABILITIES.md) e do estado público.
