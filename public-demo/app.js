const topics = {
  orcamento: { name: 'Execução orçamentária', value: '67,4', suffix: '%', caption: 'do valor previsto no recorte selecionado', note: 'Este resultado descreve somente o período e o conjunto de registros selecionados. Ele não determina desempenho, legalidade ou responsabilidade.', rows: [['Previsto', '100%', 'R$ 8,4 mi', ''], ['Realizado', '67.4%', 'R$ 5,7 mi', 'green']] },
  compras: { name: 'Compras por modalidade', value: '42', suffix: '%', caption: 'em uma modalidade no recorte demonstrativo', note: 'A distribuição é ilustrativa. Um agrupamento não demonstra concorrência, regularidade ou intenção de qualquer participante.', rows: [['Modalidade A', '100%', 'R$ 4,0 mi', ''], ['Modalidade B', '42%', 'R$ 1,7 mi', 'green']] },
  populacao: { name: 'Variação populacional', value: '3,1', suffix: '%', caption: 'em comparação simulada entre períodos', note: 'Indicadores demográficos exigem fonte, metodologia e data de referência explícitas antes de qualquer comparação.', rows: [['Referência anterior', '100%', '240 mil', ''], ['Referência atual', '76%', '247 mil', 'green']] }
};
const answerTexts = {
  'Qual é a execução por órgão?': 'Em uma versão com dados liberados, a resposta mostraria o órgão, o período, o valor previsto, o realizado e a fonte. Nesta demo, o valor é apenas ilustrativo.',
  'Como foram distribuídas as compras?': 'A resposta apresentaria totais por modalidade dentro de um recorte declarado. Ela não classificaria fornecedores, contratos ou órgãos como regulares ou irregulares.',
  'De onde vem esse indicador?': 'O painel de evidências mostraria a fonte, o artefato coletado, data, filtros, regra de cálculo, cobertura e limitações da resposta.'
};
function renderTopic(key) {
  const t = topics[key];
  document.querySelector('.metric-name').textContent = t.name;
  document.querySelector('.metric').innerHTML = t.value + '<span>' + t.suffix + '</span>';
  document.querySelector('.metric-caption').textContent = t.caption;
  document.querySelector('.insight-note').textContent = t.note;
  document.querySelector('.bar-chart').innerHTML = t.rows.map(([label, width, total, color]) => '<div class="bar-row"><span>' + label + '</span><i><b class="' + color + '" style="width:' + width + '"></b></i><strong>' + total + '</strong></div>').join('');
}
document.querySelectorAll('.topic-card').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.topic-card').forEach((item) => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
    button.classList.add('active'); button.setAttribute('aria-pressed', 'true'); renderTopic(button.dataset.topic);
  });
});
document.querySelectorAll('[data-question]').forEach((button) => {
  button.addEventListener('click', () => {
    const question = button.dataset.question;
    document.getElementById('answer-box').innerHTML = '<span class="answer-icon">✓</span><p><strong>' + question + '</strong><br>' + answerTexts[question] + '</p>';
  });
});
const dialog = document.getElementById('evidence-modal');
document.querySelectorAll('[data-modal-open]').forEach((button) => button.addEventListener('click', () => dialog.showModal()));
document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
