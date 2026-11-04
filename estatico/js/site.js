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
