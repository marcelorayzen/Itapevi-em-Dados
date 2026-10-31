const API_URL = 'https://api-dados.rayzen.com.br/v1/ask';

const topics = {
  orcamento: { name: 'Execução orçamentária', value: '67,4', suffix: '%', caption: 'do valor previsto no recorte selecionado', note: 'Este resultado é ilustrativo até que a fonte municipal correspondente seja liberada para publicação.', rows: [['Previsto', '100%', 'R$ 8,4 mi', ''], ['Realizado', '67.4%', 'R$ 5,7 mi', 'green']] },
  compras: { name: 'Compras por modalidade', value: '42', suffix: '%', caption: 'em uma modalidade no recorte demonstrativo', note: 'A distribuição é ilustrativa. Dados reais só entram após liberação da fonte e preservam as limitações do recorte.', rows: [['Modalidade A', '100%', 'R$ 4,0 mi', ''], ['Modalidade B', '42%', 'R$ 1,7 mi', 'green']] },
  populacao: { name: 'População de Itapevi', value: '—', suffix: '', caption: 'consulte a pergunta livre para a fonte oficial atual', note: 'A pergunta livre consulta a fonte oficial do IBGE e apresenta o ano de referência.', rows: [['Fonte oficial', '100%', 'IBGE', 'green']] }
};

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

function renderTopic(key) {
  const t = topics[key];
  document.querySelector('.metric-name').textContent = t.name;
  document.querySelector('.metric').innerHTML = t.value + '<span>' + t.suffix + '</span>';
  document.querySelector('.metric-caption').textContent = t.caption;
  document.querySelector('.insight-note').textContent = t.note;
  document.querySelector('.bar-chart').innerHTML = t.rows.map(([label, width, total, color]) => '<div class="bar-row"><span>' + label + '</span><i><b class="' + color + '" style="width:' + width + '"></b></i><strong>' + total + '</strong></div>').join('');
}

function renderAnswer(payload) {
  const evidence = payload.evidence?.[0];
  const evidenceHtml = evidence ? '<p class="answer-evidence"><strong>Fonte:</strong> <a href="' + escapeHtml(evidence.url) + '" target="_blank" rel="noreferrer">' + escapeHtml(evidence.source) + '</a> · Indicador ' + escapeHtml(evidence.indicator) + '</p>' : '';
  const limitHtml = payload.limitations?.length ? '<p class="answer-limit"><strong>Limites:</strong> ' + escapeHtml(payload.limitations[0]) + '</p>' : '';
  document.getElementById('answer-box').innerHTML = '<span class="answer-icon">✓</span><p><strong>' + escapeHtml(payload.answer || payload.message) + '</strong></p>' + evidenceHtml + limitHtml;
}

async function ask(question) {
  const box = document.getElementById('answer-box');
  box.innerHTML = '<span class="answer-icon">…</span><p>Consultando dados publicados...</p>';
  try {
    const result = await fetch(API_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question }) });
    const payload = await result.json();
    renderAnswer(payload);
  } catch {
    box.innerHTML = '<span class="answer-icon">!</span><p><strong>A API pública ainda está em ativação.</strong> Tente novamente em alguns instantes. A demonstração não substitui a fonte oficial.</p>';
  }
}

document.querySelectorAll('.topic-card').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.topic-card').forEach((item) => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
    button.classList.add('active'); button.setAttribute('aria-pressed', 'true'); renderTopic(button.dataset.topic);
  });
});
document.querySelectorAll('[data-question]').forEach((button) => button.addEventListener('click', () => ask(button.dataset.question)));
document.getElementById('question-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const question = document.getElementById('question-input').value.trim();
  if (question) ask(question);
});
const dialog = document.getElementById('evidence-modal');
document.querySelectorAll('[data-modal-open]').forEach((button) => button.addEventListener('click', () => dialog.showModal()));
document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
