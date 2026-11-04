const API_URL = 'https://api-dados.rayzen.com.br/v1/ask';
const PUBLIC_CONFIG_URL = 'https://api-dados.rayzen.com.br/v1/public-config';
let turnstileConfig = { turnstileEnabled: false, turnstileSiteKey: null };
let turnstileToken = '';
let turnstileWidgetId = null;
let latestAnswer = null;

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const checksumMarkup = (value) => (Array.isArray(value) ? value : [value]).filter(Boolean).map((item) => { const text = String(item); return `<button class="checksum" type="button" data-checksum="${escapeHtml(text)}" title="Copiar checksum completo">${escapeHtml(text.length > 24 ? `${text.slice(0, 12)}…${text.slice(-8)}` : text)}</button>`; }).join(' ');
const sourceLink = (url, label) => url ? `<a class="audit-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>` : escapeHtml(label);

function renderAnswer(payload) {
  latestAnswer = payload;
  const evidence = payload.evidence?.[0];
  const source = evidence?.source || evidence?.sourceId || 'Fonte identificada';
  const sourceHtml = sourceLink(evidence?.url, source);
  const evidenceHtml = evidence ? '<p class="answer-evidence"><strong>Evidência auditável:</strong> ' + sourceHtml + (evidence.sourceId ? ' · Fonte ' + escapeHtml(evidence.sourceId) : '') + (evidence.datasetId ? ' · Dataset ' + escapeHtml(evidence.datasetId) : '') + (evidence.artifactSha256 ? ' · Checksum ' + checksumMarkup(evidence.artifactSha256) : '') + '</p>' : '';
  const coverageHtml = payload.coverage?.scope ? '<p class="answer-limit"><strong>Cobertura:</strong> ' + escapeHtml(payload.coverage.scope) + '</p>' : '';
  const limitHtml = payload.limitations?.length ? '<p class="answer-limit"><strong>Limites:</strong> ' + escapeHtml(payload.limitations[0]) + '</p>' : '';
  document.getElementById('answer-box').innerHTML = '<span class="answer-icon">✓</span><p><strong>' + escapeHtml(payload.answer || payload.message) + '</strong></p>' + evidenceHtml + coverageHtml + limitHtml + (evidence ? '<button class="evidence-trigger" type="button" data-response-evidence>Ver trilha de auditoria</button>' : '');
}

function openResponseEvidence() {
  if (!latestAnswer) return;
  const evidence = latestAnswer.evidence?.[0] || {};
  const dialog = document.getElementById('evidence-modal');
  dialog.querySelector('#modal-title').textContent = 'Trilha de auditoria da resposta';
  const fields = [
    ['Fonte', evidence.source || evidence.sourceId || 'Não informada', false],
    ['Identificador da fonte', evidence.sourceId || 'Não informado', false],
    ['Dataset', evidence.datasetId || 'Não informado', false],
    ['Consulta oficial', evidence.url ? sourceLink(evidence.url, 'Abrir fonte oficial') : 'Não informada', Boolean(evidence.url)],
    ['Como conferir', evidence.verification || 'Consulte a fonte, o período e o checksum apresentados.', false],
    ['Checksum', Array.isArray(evidence.artifactSha256) ? evidence.artifactSha256.join('\n') : (evidence.artifactSha256 || 'Não informado'), false],
    ['Cobertura e limites', `${latestAnswer.coverage?.scope || 'Não informada'}\n${latestAnswer.limitations?.[0] || 'Sem limite adicional informado.'}`, false],
  ];
  dialog.querySelector('.evidence-list').innerHTML = fields.map(([label, value, trustedHtml]) => `<li><span>•</span><div><b>${escapeHtml(label)}</b><p style="white-space:pre-wrap;overflow-wrap:anywhere">${trustedHtml ? value : escapeHtml(value)}</p></div></li>`).join('');
  dialog.showModal();
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
    box.innerHTML = '<span class="answer-icon">!</span><p><strong>Não foi possível consultar os dados neste momento.</strong> Tente novamente em alguns instantes.</p>';
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

document.querySelectorAll('[data-question]').forEach((button) => {
  if (/empresas.*licitac/i.test(button.dataset.question)) {
    button.dataset.question = 'Quantas licitações constam nos recortes publicados?';
    button.textContent = 'Quantas licitações constam nos recortes publicados?';
  }
  button.addEventListener('click', () => ask(button.dataset.question));
});
document.addEventListener('click', (event) => { if (event.target.closest('[data-response-evidence]')) openResponseEvidence(); });
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
