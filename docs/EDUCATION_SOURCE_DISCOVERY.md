# Descoberta de fontes — Educação e Escolas do Futuro

**Estado:** pipeline e modelo prontos; a coleta está pendente porque a página e a API pública municipal retornaram HTTP 500 em 02/11/2026. O catálogo ainda não foi publicado como dataset nem usado em respostas públicas.

## Fontes oficiais identificadas

| Fonte | Conteúdo aproveitável | Uso potencial | Limite atual |
|---|---|---|---|
| [Escolas — Prefeitura de Itapevi](https://itapevi.sp.gov.br/escolas/) | Relação de CEMEBs e entidades, com endereço e contato | Catálogo de unidades escolares | A página não informa, por si só, orçamento, matrícula atual ou status de obra. |
| [Secretaria de Educação](https://itapevi.sp.gov.br/secretaria-de-educacao/) | Atribuições da secretaria, programas e referências a unidades | Contexto institucional e cobertura declarada | Não substitui dados administrativos de matrícula, frequência ou desempenho. |
| [Diário Oficial, edição 1346](https://itapevi.sp.gov.br/wp-content/uploads/2024/11/1346.pdf) | Diretrizes operacionais de Escolas do Futuro em tempo integral | Ato normativo e evidência por página | Exige extração estrutural e revisão humana antes de gerar fatos. |
| [Notícia oficial da 10ª Escola do Futuro](https://noticias.itapevi.sp.gov.br/itapevi-lanca-pedra-fundamental-da-10a-escola-do-futuro-e-cria-capsula-do-tempo-para-marcar-transformacao-da-educacao-ate-2040/) | Contexto e status declarado pela Prefeitura na data da publicação | Linha do tempo e contexto público | É comunicação institucional; não comprova execução financeira nem avanço posterior. |
| [Obras no Jardim Cruzeiro e Vale do Sol](https://noticias.itapevi.sp.gov.br/itapevi-avanca-com-obras-das-escolas-do-futuro-no-jardim-cruzeiro-e-vale-do-sol/) | Percentuais e capacidade declarados na publicação | Evento temporal, se preservados data e fonte | Percentuais têm validade apenas para a data da publicação. |

## Próximo pipeline

1. Coletar cópia rastreável de cada fonte quando a página oficial estiver disponível e registrar checksum, data e condições de uso.
2. Extrair o catálogo de unidades como entidades geográficas/institucionais, sem inferir capacidade ou desempenho.
3. Processar atos do Diário Oficial com Docling, mantendo edição, página e trecho que sustenta cada fato.
4. Relacionar uma obra, contrato ou gasto a uma escola somente quando o identificador ou objeto oficial permitir a vinculação reproduzível.
5. Publicar respostas com data de referência, cobertura e limites; nunca afirmar entrega, execução ou qualidade sem fonte correspondente.

## Perguntas que esta frente poderá responder depois da ingestão

- Quais unidades escolares municipais constam no catálogo oficial?
- Quais atos oficiais mencionam determinada Escola do Futuro?
- Qual era o status declarado de determinada obra em uma publicação oficial, e em qual data?

Perguntas sobre matrículas atuais, desempenho, merenda, segurança, execução financeira ou prazo final permanecem indisponíveis até que exista fonte específica, artefato registrado e critério de cálculo documentado.
