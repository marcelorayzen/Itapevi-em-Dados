# Publicação do portal público

## Estado

Em 03 de novembro de 2026, o portal público do Itapevi em Dados está publicado em:

- https://itapevi-em-dados.rayzen.com.br/

O endereco anterior do GitHub Pages permanece disponivel como endereco tecnico:

- https://marcelorayzen.github.io/Itapevi-em-Dados/

## Configuracao confirmada

| Item | Estado |
|---|---|
| Hospedagem | GitHub Pages com workflow GitHub Actions |
| Dominio customizado | itapevi-em-dados.rayzen.com.br |
| DNS | CNAME para marcelorayzen.github.io |
| Certificado HTTPS | Aprovado pelo GitHub Pages |
| HTTPS obrigatorio | Ativo |
| Conteúdo | Interface estática conectada à API pública; respostas factuais usam recortes reais agregados e evidências. |

## Limites da publicacao

Esta publicação não expõe PostgreSQL, credenciais, documentos brutos, ZIPs locais ou tabelas não aprovadas. O portal usa uma API pública separada no Cloudflare Worker e apresenta somente recortes reais agregados com fonte, dataset, checksum, cobertura e limitações. Nenhum elemento ilustrativo deve ser apresentado como resposta factual.

A inclusão ou ampliação de dados reais exige, por dataset:

1. origem e periodo registrados;
2. termos e condicao de redistribuicao revisados;
3. aprovacao dos campos e da granularidade publicados;
4. evidencia e limitacao visiveis na interface;
5. aprovacao humana registrada.

## Próxima evolução

A próxima entrega de dados reais deve ser um recorte agregado, verificável e aprovado para publicação. Ela só entra após atualizar registro de fontes, status de termos, cobertura, testes de interface e documentação canônica.

