// Menu no telemóvel
const t=document.querySelector('.nav-toggle'),n=document.querySelector('.site-header nav');
if(t&&n)t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)});
// Atualiza sozinho os anos de experiência (desde 1981)
document.querySelectorAll('[data-desde]').forEach(e=>{e.textContent=new Date().getFullYear()-Number(e.dataset.desde)});

// ---------- interatividade (respeita "reduzir movimento" do sistema) ----------
const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cab = document.querySelector('.site-header');
if (cab) { const f = () => cab.classList.toggle('rolado', scrollY > 10); f(); addEventListener('scroll', f, { passive: true }); }

if (!calmo && 'IntersectionObserver' in window) {
  // Aparecer ao rolar: só para o que ainda não está à vista quando a página abre
  const alvos = document.querySelectorAll('main h2, .card, .feature, .metodo, .milestone, .step, .value, .thumb, .gallery figure, .model, .two-col > *');
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  alvos.forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add('revelar');
      const irmaos = el.parentElement ? [...el.parentElement.children].filter((x) => x.matches(el.tagName)) : [];
      const i = irmaos.indexOf(el); if (i > 0) el.style.transitionDelay = Math.min(i, 5) * 90 + 'ms';
      io.observe(el);
    }
  });

  // Números a contar quando aparecem (ex.: 45 anos, +10 000 projetos)
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, txt = el.textContent, m = txt.match(/\d[\d\s.]*/);
    if (!m) return;
    const alvo = Number(m[0].replace(/[\s.]/g, '')), sep = /\s/.test(m[0]) ? ' ' : /\./.test(m[0]) ? '.' : '';
    const fmt = (v) => sep ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(v);
    const t0 = performance.now(), dur = 1400;
    const passo = (t) => { const k = Math.min(1, (t - t0) / dur), v = Math.round(alvo * (1 - Math.pow(1 - k, 3)));
      el.textContent = txt.replace(m[0], fmt(v)); if (k < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  }), { threshold: 0.6 });
  document.querySelectorAll('.stat strong').forEach((el) => cio.observe(el));
}

// Testemunhos: botões anterior/seguinte (sem passagem automática — WCAG 2.2.2)
document.querySelectorAll('.carrossel').forEach((c) => {
  const f = c.querySelector('.faixa-testemunhos');
  c.querySelectorAll('.b-car').forEach((b) => b.addEventListener('click', () => {
    const item = f.querySelector('li'); const passo = item ? item.getBoundingClientRect().width + 24 : f.clientWidth;
    f.scrollBy({ left: Number(b.dataset.dir) * passo, behavior: calmo ? 'auto' : 'smooth' });
  }));
});
// Perguntas frequentes: filtrar por tema
document.querySelectorAll('.faq-filtro').forEach((g) => {
  const itens = g.parentElement.querySelectorAll('.faq-item');
  g.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    itens.forEach((i) => { i.hidden = !!b.dataset.cat && i.dataset.cat !== b.dataset.cat; });
  });
});
// Mapa: só carrega o Google Maps depois de o visitante pedir
document.querySelectorAll('[data-ver-mapa]').forEach((b) => b.addEventListener('click', () => {
  const m = b.closest('.mapa'); const f = document.createElement('iframe');
  f.src = m.dataset.mapa; f.title = m.dataset.titulo; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
  m.replaceChildren(f); f.focus();
}));

// ---------- textos da interface (PT/EN) ----------
const EN = document.documentElement.lang === 'en';
const TX = EN
  ? { metodos: 'Construction methods', todos: 'See all', ampliar: 'Enlarge image', fechar: 'Close', topo: 'Back to top' }
  : { metodos: 'Métodos de construção', todos: 'Ver todos', ampliar: 'Ampliar imagem', fechar: 'Fechar', topo: 'Voltar ao topo' };

// ---------- Construções: seletor de métodos (separadores acessíveis; sem JS mostra tudo) ----------
document.querySelectorAll('.metodos[data-seletor]').forEach((box) => {
  const arts = [...box.querySelectorAll(':scope > .metodo')];
  if (arts.length < 3) return;
  const lista = document.createElement('div'); lista.className = 'seletor'; lista.setAttribute('role', 'tablist'); lista.setAttribute('aria-label', TX.metodos);
  const tabs = arts.map((a, i) => {
    const h = a.querySelector('h2'); const t = document.createElement('button');
    t.type = 'button'; t.role = 'tab'; t.id = 'sep-' + (a.id || i); t.textContent = h ? h.textContent.replace(/^Constru(ção|ction)\s+|\s+construction$/i, '') : String(i + 1);
    t.setAttribute('aria-controls', a.id); a.setAttribute('role', 'tabpanel'); a.setAttribute('aria-labelledby', t.id); a.tabIndex = 0;
    t.addEventListener('click', () => escolher(i, true));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (d) { e.preventDefault(); escolher((i + d + arts.length) % arts.length, true, true); }
      else if (e.key === 'Home') { e.preventDefault(); escolher(0, true, true); }
      else if (e.key === 'End') { e.preventDefault(); escolher(arts.length - 1, true, true); }
    });
    lista.appendChild(t); return t;
  });
  function escolher(i, hist, foco) {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    arts.forEach((a, j) => { a.hidden = i !== j; a.classList.toggle('entrar', i === j && !calmo); });
    if (foco) tabs[i].focus();
    if (hist && arts[i].id) history.replaceState(null, '', '#' + arts[i].id);
  }
  box.classList.add('com-seletor'); box.before(lista);
  const inicial = Math.max(0, arts.findIndex((a) => '#' + a.id === location.hash));
  escolher(inicial, false);
});

// ---------- Ampliar imagens (janela nativa <dialog>: Esc fecha e o foco fica preso lá dentro) ----------
const ampliaveis = document.querySelectorAll('.metodo img, .gallery img, .thumb img, .milestone img, .model img, .foto-produto, .two-col > img');
if (ampliaveis.length && 'HTMLDialogElement' in window) {
  const dlg = document.createElement('dialog'); dlg.className = 'lupa';
  dlg.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lupa-fechar"></button>';
  const [im, cap, fb] = [dlg.querySelector('img'), dlg.querySelector('figcaption'), dlg.querySelector('button')];
  fb.textContent = '×'; fb.setAttribute('aria-label', TX.fechar);
  fb.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  document.body.appendChild(dlg);
  ampliaveis.forEach((img) => {
    if (!img.alt) return; // imagens decorativas não se ampliam
    img.classList.add('ampliavel'); img.tabIndex = 0; img.setAttribute('role', 'button');
    img.setAttribute('aria-label', TX.ampliar + (img.alt ? ': ' + img.alt : ''));
    const abrir = () => { im.src = img.currentSrc || img.src; im.alt = img.alt; cap.textContent = img.alt; cap.hidden = !img.alt; dlg.showModal(); };
    img.addEventListener('click', abrir);
    img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
  });
}

// ---------- Etapas da qualidade e história: linha que se preenche ao rolar ----------
const linhas = [...document.querySelectorAll('.steps, .timeline')];
if (linhas.length) {
  linhas.forEach((l) => l.classList.add('com-linha'));
  const atualizar = () => linhas.forEach((l) => {
    const r = l.getBoundingClientRect(), meio = innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (meio - r.top) / r.height));
    l.style.setProperty('--p', p.toFixed(3));
    l.querySelectorAll(':scope > li, :scope > .milestone').forEach((it) => it.classList.toggle('atingido', it.getBoundingClientRect().top < meio));
  });
  atualizar(); addEventListener('scroll', atualizar, { passive: true }); addEventListener('resize', atualizar);
}

// ---------- Barra de leitura e botão "voltar ao topo" ----------
{
  const barra = document.createElement('div'); barra.className = 'leitura'; barra.setAttribute('aria-hidden', 'true');
  const topo = document.createElement('a'); topo.href = '#conteudo'; topo.className = 'ao-topo'; topo.setAttribute('aria-label', TX.topo); topo.textContent = '↑';
  topo.addEventListener('click', (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: calmo ? 'auto' : 'smooth' }); const m = document.getElementById('conteudo'); if (m) m.focus({ preventScroll: true }); });
  document.body.append(barra, topo);
  const f = () => { const h = document.documentElement.scrollHeight - innerHeight; barra.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; topo.classList.toggle('ver', scrollY > 700); };
  f(); addEventListener('scroll', f, { passive: true });
}
