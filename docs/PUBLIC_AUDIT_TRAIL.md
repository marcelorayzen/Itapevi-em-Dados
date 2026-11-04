# Trilha de auditoria pública

## Compromisso

O Itapevi em Dados não deve pedir confiança cega. Toda resposta factual pública deve permitir que uma pessoa responda:

1. **Qual foi a fonte?**
2. **Qual recorte foi usado?**
3. **Qual dataset e artefato sustentam o número?**
4. **Como eu confiro na origem?**
5. **O que essa resposta não prova?**

## O que aparece no portal

Ao abrir **Ver trilha de auditoria**, o portal apresenta:

| Campo | Função |
|---|---|
| Fonte e identificador | informa o órgão e o registro interno da origem |
| Dataset | identifica o recorte processado |
| Consulta oficial | abre o painel ou API oficial de origem |
| Como conferir | descreve filtros, período ou indicador necessários para refazer a leitura |
| Checksum | identifica o artefato local que originou o agregado |
| Cobertura e limites | evita transformar o recorte em afirmação mais ampla |

## Exemplo: execução orçamentária

Para a execução por órgão, o portal abre o [painel LAI da Transparência de Itapevi](https://transparencia.itapevi.sp.gov.br/tdaportalclient.aspx?418). A resposta informa o recorte efetivamente usado: **Data de Empenho de 01/09/2026 a 30/09/2026** ou **Data de Empenho de 01/10/2026 a 31/10/2026**. O cidadão deve selecionar a consulta de previsto e empenhado, reaplicar o período da resposta e então conferir o órgão apresentado. O portal não soma meses distintos automaticamente.

O link abre a fonte oficial, mas não substitui os filtros documentados: o painel é dinâmico e pode mostrar outra visão se o usuário alterar os campos.

## Limites

- O checksum não publica o ZIP bruto nem dados pessoais; ele permite identificar exatamente o artefato preservado localmente.
- Um link oficial não torna o número automaticamente completo: a cobertura e as limitações da resposta continuam obrigatórias.
- Perguntas sem fato publicado recebem uma explicação de cobertura, não uma evidência artificial.
