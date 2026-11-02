const API_URL = 'https://api-dados.rayzen.com.br/v1/ask';
const PUBLIC_CONFIG_URL = 'https://api-dados.rayzen.com.br/v1/public-config';
let turnstileConfig = { turnstileEnabled: false, turnstileSiteKey: null };
let turnstileToken = '';
let turnstileWidgetId = null;

const topics = {
  orcamento: { name: 'Execução orçamentária', value: '67,4', suffix: '%', caption: 'do valor previsto no recorte selecionado', note: 'Este resultado é ilustrativo até que a fonte municipal correspondente seja liberada para publicação.', rows: [['Previsto', '100%', 'R$ 8,4 mi', ''], ['Realizado', '67.4%', 'R$ 5,7 mi', 'green']] },
  compras: { name: 'Compras por modalidade', value: '42', suffix: '%', caption: 'em uma modalidade no recorte demonstrativo', note: 'A distribuição é ilustrativa. Dados reais só entram após liberação da fonte e preservam as limitações do recorte.', rows: [['Modalidade A', '100%', 'R$ 4,0 mi', ''], ['Modalidade B', '42%', 'R$ 1,7 mi', 'green']] },
  populacao: { name: 'População de Itapevi', value: '—', suffix: '', caption: 'consulte a pergunta livre para a fonte oficial atual', note: 'A pergunta livre consulta a fonte oficial do IBGE e apresenta o ano de referência.', rows: [['Fonte oficial', '100%', 'IBGE', 'green']] }
};

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const checksumMarkup = (value) => (Array.isArray(value) ? value : [value]).filter(Boolean).map((item) => { const text = String(item); return `<button class="checksum" type="button" data-checksum="${escapeHtml(text)}" title="Copiar checksum completo">${escapeHtml(text.length > 24 ? `${text.slice(0, 12)}…${text.slice(-8)}` : text)}</button>`; }).join(' ');

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
  const source = evidence?.source || evidence?.sourceId || 'Fonte identificada';
  const sourceHtml = evidence?.url ? '<a href="' + escapeHtml(evidence.url) + '" target="_blank" rel="noreferrer">' + escapeHtml(source) + '</a>' : escapeHtml(source);
  const evidenceHtml = evidence ? '<p class="answer-evidence"><strong>Evidência:</strong> ' + sourceHtml + (evidence.datasetId ? ' · Dataset ' + escapeHtml(evidence.datasetId) : '') + (evidence.artifactSha256 ? ' · Checksum ' + checksumMarkup(evidence.artifactSha256) : '') + '</p>' : '';
  const coverageHtml = payload.coverage?.scope ? '<p class="answer-limit"><strong>Cobertura:</strong> ' + escapeHtml(payload.coverage.scope) + '</p>' : '';
  const limitHtml = payload.limitations?.length ? '<p class="answer-limit"><strong>Limites:</strong> ' + escapeHtml(payload.limitations[0]) + '</p>' : '';
  document.getElementById('answer-box').innerHTML = '<span class="answer-icon">✓</span><p><strong>' + escapeHtml(payload.answer || payload.message) + '</strong></p>' + evidenceHtml + coverageHtml + limitHtml;
}

async function ask(question) {
  const box = document.getElementById('answer-box');
  if (turnstileConfig.turnstileEnabled && !turnstileToken) {
    box.innerHTML = '<span class="answer-icon">!</span><p><strong>Conclua a verificacao de seguranca antes de enviar a pergunta.</strong></p>';
    return;
  }
  box.innerHTML = '<span class="answer-icon">…</span><p>Consultando dados publicados...</p>';
  try {
    const result = await fetch(API_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question, turnstileToken }) });
    const payload = await result.json();
    renderAnswer(payload);
    if (turnstileWidgetId !== null && window.turnstile) { window.turnstile.reset(turnstileWidgetId); turnstileToken = ''; }
  } catch {
    box.innerHTML = '<span class="answer-icon">!</span><p><strong>A API pública ainda está em ativação.</strong> Tente novamente em alguns instantes. A demonstração não substitui a fonte oficial.</p>';
  }
}

async function configureTurnstile() {
  const slot = document.getElementById('turnstile-slot');
  try {
    const result = await fetch(PUBLIC_CONFIG_URL);
    turnstileConfig = await result.json();
    if (!turnstileConfig.turnstileEnabled || !turnstileConfig.turnstileSiteKey || !window.turnstile) return;
    turnstileWidgetId = window.turnstile.render(slot, {
      sitekey: turnstileConfig.turnstileSiteKey,
      theme: 'dark',
      size: 'flexible',
      action: 'itapevi-question',
      callback: (token) => { turnstileToken = token; slot.classList.add('turnstile-complete'); },
      'expired-callback': () => { turnstileToken = ''; },
      'error-callback': () => { turnstileToken = ''; },
    });
  } catch {
    slot.textContent = '';
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
configureTurnstile();
