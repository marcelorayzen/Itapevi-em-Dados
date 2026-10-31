# Registro inicial de fontes

_Registro técnico inicial. Licenças, termos de uso, redistribuição e periodicidade ainda precisam de validação humana antes de qualquer publicação de dados derivados._

_Em 31/10/2026, Marcelo confirmou ao projeto que os recursos municipais oficiais aqui indicados podem ser acessados, baixados e usados no projeto. A confirmação não autoriza publicar arquivos brutos indiscriminadamente: cada resposta pública continua vinculada a origem, edição/período, recorte e evidência._

| ID | Fonte | Uso atual | Estado | Termos e redistribuição |
|---|---|---|---|---|
| SRC-IBGE-001 | API de localidades e indicador populacional do IBGE | identificacao municipal e estimativa populacional de Itapevi, codigo 3522505, indicador 29171 | allowlist publica limitada | Aprovado por Marcelo em 31/10/2026 somente para o valor agregado do indicador 29171, com atribuicao ao IBGE, URL da consulta, ano, data de coleta e limites obrigatorios; ver `docs/P0_DATA_LICENSE_REVIEW.md`. Nao libera outros indicadores nem dados individualizados. |
| SRC-DO-001 | Gazeta SP, publicidade legal de Itapevi | Busca de títulos, datas e links de publicações | experimental | evidência preliminar: [portal de publicidade legal](https://publicidadelegal.gazetasp.com.br/); não foi localizada permissão explícita de redistribuição no levantamento inicial; validar termos e scraping antes de uso derivado |
| SRC-PREF-DO-001 | Prefeitura de Itapevi, Diário Oficial | edições oficiais, leis, atos e publicações administrativas | aprovado para coleta e uso no projeto | [página oficial](https://itapevi.sp.gov.br/diario-oficial/) lista edições por número/data e fornece PDF para download; Marcelo confirmou em 31/10/2026 o uso no projeto. PDFs brutos permanecem fora do Git; respostas devem citar edição, data, página e URL. |
| SRC-MM-001 | MeuMunicípio, perfil de Itapevi | Indicadores baseados no Censo 2010 | experimental | evidência preliminar: [termos de uso](https://meumunicipio.org.br/termos-de-uso); confirmar permissões de coleta e redistribuição antes de uso derivado |
| SRC-PLACEHOLDER-001 | Despesas | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-002 | Demandas | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-003 | Legislação | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-004 | Licitações | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-CAMARA-LEG-001 | Câmara de Itapevi, atividade legislativa | LOA, proposituras, emendas e anexos | candidato F1 | e-SIC oficial informa que o ícone Legislativo disponibiliza proposituras, legislação e subdocumentos, incluindo emendas; confirmar URL específica do documento e termos antes de coleta |
| SRC-CAMARA-TRANS-001 | Transparência da Câmara de Itapevi | adiantamentos, diárias, gastos e folha | candidato F1 | e-SIC oficial informa que o portal contém fases de empenho, liquidação e pagamento, relatórios orçamentários e remuneração; confirmar rota, formato e termos antes de coleta |
| SRC-PREF-TRANS-001 | Prefeitura de Itapevi, transparência | despesas e execução financeira | candidato F1 | [portal atual](https://itapevi.sp.gov.br/transparencia/) foi revisado em 25/10/2026 e aponta para transparência/e-Transparência; não foi localizada permissão explícita de redistribuição na pesquisa inicial; disponibilidade e formato de exportação precisam ser validados |
| SRC-PREF-TRANS-LEGACY-001 | Prefeitura de Itapevi, portal legado | despesas e balancetes | referência histórica | URL informada (`portaltransparencia/home/index.php`) é oficial, mas a seção visível de despesas lista períodos até 2014; não usar para execução atual sem revalidação |
| SRC-LOA-2026-001 | Prefeitura de Itapevi, Lei nº 3.551/2025 (LOA 2026) | orçamento aprovado e tabelas orçamentárias | aprovado para coleta e uso no projeto | [PDF oficial](https://itapevi.sp.gov.br/wp-content/uploads/2026/01/loa-lei-no-3.551-2025.pdf), 341 páginas; confirmação de uso por Marcelo em 31/10/2026; cada derivado público deve manter recorte, fonte e limites, sem inferir emendas individualizadas ou execução financeira. |
| SRC-PREF-LAI-BUDGET-001 | Prefeitura de Itapevi, painel LAI Previsto e Empenhado | exportação agregada por programa, ação e órgão responsável | aprovado para coleta e uso no projeto | painel em `transparencia.itapevi.sp.gov.br`; exportação ZIP/JSON de convidado validada em 27/10/2026; confirmação de uso por Marcelo em 31/10/2026. Publicação deve manter filtros, período e totalizações da exportação. |
| SRC-PREF-LAI-PROCUREMENT-001 | Prefeitura de Itapevi, painel LAI Compras por Tipo de Licitação | exportação de compras por modalidade, em CSV | aprovado para coleta e uso no projeto | painel em `transparencia.itapevi.sp.gov.br`; exportação ZIP/CSV de convidado validada em 27/10/2026; confirmação de uso por Marcelo em 31/10/2026. O piloto começa por totais/modalidades e preserva processo/objeto no artefato local. |

## Campos obrigatórios antes de produção

- URL e órgão responsável;
- finalidade e escopo da coleta;
- periodicidade e mecanismo de atualização;
- licença, termos de uso e condição de redistribuição;
- contato/responsável pela validação;
- data da última revisão;
- método de coleta, limitações e evidência de origem.
