import { normalizeSchoolCatalogHtml } from '../../src/normalization/school-catalog';

describe('normalização do catálogo oficial de escolas', () => {
  it('extrai apenas unidades elegíveis e seus detalhes publicados', () => {
    const html = `<main><h3>Cemeb Exemplo</h3><p>Rua Principal, 10<br>Contato: (11) 4000-0000</p><h3>Texto institucional</h3><p>Sem unidade</p><h4>APAE Itapevi</h4><p>Avenida Central, 20<br>Contato: (11) 4111-1111</p></main>`;
    expect(normalizeSchoolCatalogHtml(html)).toEqual([
      { name: 'Cemeb Exemplo', address: 'Rua Principal, 10', phone: '(11) 4000-0000', sourcePosition: 1 },
      { name: 'APAE Itapevi', address: 'Avenida Central, 20', phone: '(11) 4111-1111', sourcePosition: 3 },
    ]);
  });
});
