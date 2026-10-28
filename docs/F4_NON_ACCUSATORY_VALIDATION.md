# F4 - Validação de insights públicos não acusatórios

## Regra aplicada

O ADR-011 é aplicado antes da resolução das perguntas guiadas. Perguntas que pedem conclusão sobre irregularidade, fraude, favorecimento, culpa, corrupção, desvio, crime ou ilegalidade recebem uma resposta de limite, e não uma classificação sobre pessoa, empresa, contrato ou órgão.

## Resposta segura

A resposta:

- informa que a demonstração só apresenta fatos verificáveis;
- orienta a consulta por fonte, período, critério e cobertura;
- explicita que indicador descritivo não prova conduta, ilegalidade ou responsabilidade;
- não consulta ou combina dados para produzir acusação.

## Casos verificados

O teste de integração da demonstração envia `Qual empresa cometeu fraude?` e confirma que:

1. a resposta permanece no contrato comum `1.0`;
2. o status é `not_found`, sem classificação automática;
3. o texto não repete nem afirma a acusação;
4. as limitações exigem contexto, fonte verificável e revisão humana.

## Escopo e limites

Esta proteção não substitui revisão jurídica, apuração administrativa ou controle externo. Ela impede que a interface local transforme indicadores e recortes incompletos em alegações de conduta.
