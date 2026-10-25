# Reuso e implantação

## Adaptação por município

Uma implantação deve revisar código IBGE, URLs, conectores, schemas, fontes, periodicidade de coleta e critérios de validação. Não existe garantia de que os conectores de Itapevi funcionem para outra cidade sem essa adaptação.

## Requisitos atuais

- Node.js 18 ou superior;
- npm;
- variáveis de ambiente necessárias ao ambiente local;
- execução local do projeto e das verificações disponíveis.

## Checklist

1. Validar licença, termos e confiabilidade de cada fonte.
2. Configurar URLs e identificadores municipais.
3. Revisar schemas, limites e critérios de validação.
4. Manter credenciais fora do repositório.
5. Executar build e testes locais.
6. Verificar respostas contra fontes oficiais.
7. Definir operação, monitoramento e responsável institucional.

Cada órgão é responsável por validar fontes, permissões, adequação legal e operação de sua implantação.
