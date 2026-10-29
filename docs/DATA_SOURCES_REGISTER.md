# Registro inicial de fontes

_Registro técnico inicial. Licenças, termos de uso, redistribuição e periodicidade ainda precisam de validação humana antes de qualquer publicação de dados derivados._

| ID | Fonte | Uso atual | Estado | Termos e redistribuição |
|---|---|---|---|---|
| SRC-IBGE-001 | API de localidades e indicador populacional do IBGE | identificação municipal e estimativa populacional de Itapevi, código 3522505, indicador 29171 | integração existente | [PDA do IBGE](https://www.ibge.gov.br/acesso-informacao/dados-abertos.html) indica política de dados abertos, mas a licença/atribuição específica do indicador/API ainda exige decisão humana; ver `docs/P0_DATA_LICENSE_REVIEW.md` |
| SRC-DO-001 | Gazeta SP, publicidade legal de Itapevi | Busca de títulos, datas e links de publicações | experimental | evidência preliminar: [portal de publicidade legal](https://publicidadelegal.gazetasp.com.br/); não foi localizada permissão explícita de redistribuição no levantamento inicial; validar termos e scraping antes de uso derivado |
| SRC-MM-001 | MeuMunicípio, perfil de Itapevi | Indicadores baseados no Censo 2010 | experimental | evidência preliminar: [termos de uso](https://meumunicipio.org.br/termos-de-uso); confirmar permissões de coleta e redistribuição antes de uso derivado |
| SRC-PLACEHOLDER-001 | Despesas | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-002 | Demandas | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-003 | Legislação | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-PLACEHOLDER-004 | Licitações | Dados em memória no conector | mock/placeholder | não há fonte registrada; não usar como dado público |
| SRC-CAMARA-LEG-001 | Câmara de Itapevi, atividade legislativa | LOA, proposituras, emendas e anexos | candidato F1 | e-SIC oficial informa que o ícone Legislativo disponibiliza proposituras, legislação e subdocumentos, incluindo emendas; confirmar URL específica do documento e termos antes de coleta |
| SRC-CAMARA-TRANS-001 | Transparência da Câmara de Itapevi | adiantamentos, diárias, gastos e folha | candidato F1 | e-SIC oficial informa que o portal contém fases de empenho, liquidação e pagamento, relatórios orçamentários e remuneração; confirmar rota, formato e termos antes de coleta |
| SRC-PREF-TRANS-001 | Prefeitura de Itapevi, transparência | despesas e execução financeira | candidato F1 | [portal atual](https://itapevi.sp.gov.br/transparencia/) foi revisado em 25/10/2026 e aponta para transparência/e-Transparência; não foi localizada permissão explícita de redistribuição na pesquisa inicial; disponibilidade e formato de exportação precisam ser validados |
| SRC-PREF-TRANS-LEGACY-001 | Prefeitura de Itapevi, portal legado | despesas e balancetes | referência histórica | URL informada (`portaltransparencia/home/index.php`) é oficial, mas a seção visível de despesas lista períodos até 2014; não usar para execução atual sem revalidação |
| SRC-LOA-2026-001 | Prefeitura de Itapevi, Lei nº 3.551/2025 (LOA 2026) | orçamento aprovado e tabelas orçamentárias | amostra F1 aprovada para uso controlado | [PDF oficial](https://itapevi.sp.gov.br/wp-content/uploads/2026/01/loa-lei-no-3.551-2025.pdf), 341 páginas; teste local com dados reais aprovado pelo decisor em 25/10/2026; não comprova emendas individualizadas nem autoriza, por si só, redistribuição de derivados; revisão em `docs/P0_DATA_LICENSE_REVIEW.md` |
| SRC-PREF-LAI-001 | Prefeitura de Itapevi, painel LAI Previsto e Empenhado | exportação agregada por programa, ação e órgão responsável | amostra municipal aprovada para uso controlado | painel em `transparencia.itapevi.sp.gov.br`; exportação ZIP/JSON de convidado validada em 27/10/2026 com termos de redistribuição pendentes; usar somente localmente até revisão humana |
| SRC-PREF-LAI-001 | Prefeitura de Itapevi, painel LAI Compras por Tipo de Licitação | exportação de compras por modalidade, em CSV | amostra municipal aprovada para uso controlado | painel em `transparencia.itapevi.sp.gov.br`; exportação ZIP/CSV de convidado validada em 27/10/2026 com termos de redistribuição pendentes; o piloto derivado guarda apenas totais e modalidades, e mantém processos/objetos somente no arquivo local |

## Campos obrigatórios antes de produção

- URL e órgão responsável;
- finalidade e escopo da coleta;
- periodicidade e mecanismo de atualização;
- licença, termos de uso e condição de redistribuição;
- contato/responsável pela validação;
- data da última revisão;
- método de coleta, limitações e evidência de origem.
