// Gerador do site Facobil.
// Recebe o conteúdo (conteudo/site.json) e devolve as páginas HTML e o tema CSS.
// É o mesmo código na publicação (GitHub Actions, via construir.mjs) e na pré-visualização do painel.

export const FONTES = {
  "Montserrat": { ficheiro: "montserrat", pesos: [400, 600, 700, 800] },
  "Open Sans": { ficheiro: "open-sans", pesos: [400, 600] },
  "Lato": { ficheiro: "lato", pesos: [400, 700] },
  "Roboto": { ficheiro: "roboto", pesos: [400, 700] },
  "Raleway": { ficheiro: "raleway", pesos: [400, 700] },
  "Playfair Display": { ficheiro: "playfair-display", pesos: [400, 700] },
  "Merriweather": { ficheiro: "merriweather", pesos: [400, 700] },
};

const ICON = {
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4 7.3V17h16V7.3l-8 4.9ZM5.2 7 12 11.1 18.8 7H5.2Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8V6.3c0-.8.2-1.3 1.4-1.3H17V2h-2.6C11.3 2 10.3 3.6 10.3 6.2V8H8v3h2.3v11H14V11h2.6l.4-3Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2c-2.7 0-3 0-4.1.1C4.3 2.2 2.2 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.1 3.6 2.2 5.7 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.1 5.7-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-3.6-2.2-5.7-5.8-5.8C15 2 14.7 2 12 2Zm0 1.8c2.7 0 3 0 4 .1 2.6.1 3.9 1.4 4 4 .1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.6-1.4 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.6-.1-3.9-1.4-4-4-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.6 1.4-3.9 4-4 1-.1 1.3-.1 4-.1Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.5Z"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v9.6l3.3-3.3 1.4 1.4L12 16.4l-5.7-5.7 1.4-1.4L11 12.6V3ZM4 18h16v2H4v-2Z"/></svg>',
};

const NAV = [
  ["index.html", "Início"], ["sobre-nos.html", "Sobre nós"], ["brist.html", "BRIST"],
  ["qualidade.html", "Qualidade"], ["projetos.html", "Projetos"], ["contactos.html", "Contactos"],
];

// ---------- utilitários ----------
const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attr = esc;
// Texto com quebras de linha; linhas começadas por "- " viram lista
function bloco(texto) {
  const t = String(texto ?? "").trim();
  if (!t) return "";
  const linhas = t.split("\n");
  if (linhas.every((l) => l.trim().startsWith("- "))) {
    return "<ul>" + linhas.map((l) => `<li>${esc(l.trim().slice(2))}</li>`).join("") + "</ul>";
  }
  return `<p>${linhas.map(esc).join("<br>")}</p>`;
}
const paragrafos = (arr) => (arr || []).map(bloco).join("\n");
const telHref = (t) => "tel:" + String(t).replace(/[^\d+]/g, "");
const telTxt = (t) => esc(t).replace(/ /g, "&nbsp;");
const hexOk = (c, def) => (/^#[0-9a-fA-F]{6}$/.test(c || "") ? c : def);
const urlOk = (u) => (/^(https?:|mailto:|tel:)/.test(u || "") || /^[\w\-./%]+$/.test(u || "") ? u : "#");

// ---------- tema (cores e letras) ----------
export function gerarTema(a, faixa) {
  const ft = FONTES[a.letra_titulos] ? a.letra_titulos : "Montserrat";
  const fc = FONTES[a.letra_texto] ? a.letra_texto : "Open Sans";
  let css = "/* Gerado automaticamente a partir do painel. Não editar à mão. */\n";
  for (const nome of new Set([ft, fc])) {
    const f = FONTES[nome];
    for (const w of f.pesos) {
      css += `@font-face{font-family:"${nome}";font-style:normal;font-weight:${w};font-display:swap;src:url("../fonts/${f.ficheiro}-latin-${w}-normal.woff2") format("woff2")}\n`;
    }
  }
  const tam = Math.min(22, Math.max(14, Number(a.tamanho_texto) || 17));
  css += `:root{
  --verde:${hexOk(a.cor_verde, "#5d993d")};
  --verde-escuro:${hexOk(a.cor_verde_escuro, "#44782c")};
  --cinza:${hexOk(a.cor_cinza, "#424242")};
  --preto:${hexOk(a.cor_preto, "#111111")};
  --escuro:var(--cinza);
  --texto:${hexOk(a.cor_texto, "#222222")};
  --suave:#5c5c5c;
  --claro:${hexOk(a.cor_fundo_alternado, "#efefef")};
  --branco:#ffffff;
  --acento:var(--verde-escuro);
  --acento-escuro:var(--verde-escuro);
  --linha:#d6d6d6;
  --titulos:"${ft}",system-ui,sans-serif;
  --corpo:"${fc}",system-ui,sans-serif;
  --tamanho-texto:${tam}px;
  --raio:6px;
}
`;
  if (faixa && /^[\w\-./]+$/.test(faixa)) css += `.band-paper{background-image:url("../${faixa}")}\n`;
  return css;
}

// ---------- partes comuns ----------
function social(g, extra = "") {
  return [["facebook", "Facebook", g.facebook], ["instagram", "Instagram", g.instagram], ["linkedin", "LinkedIn", g.linkedin]]
    .filter(([, , u]) => u)
    .map(([k, n, u]) => `<a href="${attr(urlOk(u))}" target="_blank" rel="noopener" aria-label="${n}">${ICON[k]}</a>`).join("");
}

function cabecalho(g, ativo) {
  const links = NAV.map(([h, t]) => `<li><a href="${h}"${h === ativo ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="index.html" aria-label="${attr(g.nome_empresa)}, página inicial">
      <img src="${attr(g.logotipo_cabecalho)}" alt="${attr(g.nome_empresa)}" width="101" height="36">
    </a>
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav aria-label="Principal"><ul id="menu">${links}</ul></nav>
  </div>
</header>`;
}

function rodape(g) {
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <img src="${attr(g.logotipo_rodape)}" alt="${attr(g.nome_empresa)}" width="193" height="96" class="footer-logo">
      <p>${esc(g.texto_rodape)}</p>
    </div>
    <div>
      <h2>Ligações rápidas</h2>
      <ul>
        <li><a href="sobre-nos.html">Sobre nós</a></li>
        <li><a href="index.html#solucoes">Soluções e produção</a></li>
        <li><a href="brist.html">BRIST</a></li>
        <li><a href="projetos.html">Projetos</a></li>
      </ul>
    </div>
    <div>
      <h2>Serviços</h2>
      <ul>${(g.servicos_rodape || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </div>
    <div>
      <h2>Contactos</h2>
      <ul class="contact-list">
        <li>${ICON.pin}${esc(g.localidade)}</li>
        <li>${ICON.phone}<a href="${telHref(g.telefone)}">${telTxt(g.telefone)}</a></li>
        <li>${ICON.mail}<a href="mailto:${attr(g.email)}">${esc(g.email)}</a></li>
      </ul>
      <p class="follow">Siga-nos nas nossas redes sociais</p>
      <div class="social">${social(g)}</div>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span>© ${esc(g.nome_empresa)}. Todos os direitos reservados.</span>
    <span><a href="codigo-de-conduta.html">Código de Conduta e Ética</a> · <a href="privacidade.html">Política de Privacidade e Cookies</a></span>
  </div>
</footer>`;
}

function jsonld(g) {
  const d = String(g.dominio || "").replace(/\/$/, "");
  const o = {
    "@context": "https://schema.org", "@type": "Organization", name: g.nome_legal, alternateName: g.nome_empresa,
    url: d, logo: `${d}/${g.logotipo_rodape}`, foundingDate: String(g.ano_fundacao), telephone: g.telefone, email: g.email,
    address: { "@type": "PostalAddress", streetAddress: String(g.morada || "").split("\n")[0], addressLocality: g.localidade, addressCountry: "PT" },
    sameAs: [g.facebook, g.instagram, g.linkedin].filter(Boolean),
  };
  return `\n<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
}

function documento(c, ficheiro, titulo, descricao, corpo, ativo, opcoes = {}) {
  const g = c.geral;
  const d = String(g.dominio || "").replace(/\/$/, "");
  const url = `${d}/${ficheiro === "index.html" ? "" : ficheiro}`;
  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">${opcoes.noindex ? '\n<meta name="robots" content="noindex">' : ""}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${attr(descricao)}">
<meta property="og:title" content="${attr(titulo)}">
<meta property="og:description" content="${attr(descricao)}">
<link rel="canonical" href="${attr(url)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_PT">
<meta property="og:url" content="${attr(url)}">
<meta property="og:image" content="${attr(d + "/" + g.imagem_partilha)}">
<meta name="twitter:card" content="summary_large_image">${ficheiro === "index.html" ? jsonld(g) : ""}
<link rel="icon" href="favicon.png" type="image/png">
<link rel="apple-touch-icon" href="favicon.png">
<meta name="theme-color" content="${attr(hexOk(c.aparencia.cor_cinza, "#424242"))}">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: blob:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'self'; object-src 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="stylesheet" href="css/estilo.css">
<link rel="stylesheet" href="css/tema.css">
</head>
<body>
<a class="skip" href="#conteudo">Saltar para o conteúdo</a>
${cabecalho(g, ativo ?? ficheiro)}
<main id="conteudo">
${corpo}
</main>
${rodape(g)}
<script src="js/site.js"></script>
</body>
</html>
`;
}

function topo(img, h1, sub = "", extra = "", cls = "") {
  return `<section class="hero ${cls}">
  <img class="hero-bg" src="${attr(img)}" alt="" fetchpriority="high">
  <div class="wrap hero-inner">
    <h1>${esc(h1)}</h1>
    ${sub ? `<p class="lead">${esc(sub)}</p>` : ""}
    ${extra}
  </div>
</section>`;
}

const apelo = (h, p, label, href) => `<section class="cta">
  <div class="wrap">
    <h2>${esc(h)}</h2>
    <p>${esc(p)}</p>
    <a class="btn btn-light" href="${attr(href)}">${esc(label)}</a>
  </div>
</section>`;

const mailCatalogo = (g) => `mailto:${g.email}?subject=Pedido%20de%20cat%C3%A1logo%20BRIST`;

// ---------- páginas ----------
function inicio(c) {
  const p = c.paginas.inicio, anos = new Date().getFullYear() - Number(c.geral.ano_fundacao || 1981);
  const nums = (p.numeros || []).map((n) => n.numero === "AUTO"
    ? `<div class="stat"><strong data-desde="${attr(c.geral.ano_fundacao)}">${anos}</strong><span>${esc(n.legenda)}</span></div>`
    : `<div class="stat"><strong>${esc(n.numero)}</strong><span>${esc(n.legenda)}</span></div>`).join("");
  const cartoes = (p.cartoes || []).map((k) => `<article class="card"><h3>${esc(k.titulo)}</h3><p>${esc(k.texto)}</p>${k.ficheiro_pdf ? `<a class="btn btn-outline" href="${attr(urlOk(k.ficheiro_pdf))}" download>${ICON.download}Download</a>` : ""}</article>`).join("");
  const gal = (p.galeria || []).map((x) => `<figure class="thumb"><img src="${attr(x.imagem)}" alt="" loading="lazy"><figcaption>${esc(x.legenda)}</figcaption></figure>`).join("");
  const corpo = topo(p.topo_imagem, p.topo_titulo, p.topo_subtitulo,
    `<p>${esc(p.topo_texto)}</p><div class="btns"><a class="btn" href="sobre-nos.html">${esc(p.botao_1)}</a><a class="btn btn-ghost" href="contactos.html">${esc(p.botao_2)}</a></div>`, "hero-home") + `
<section class="stats"><div class="wrap stats-grid">${nums}</div></section>

<section class="band-paper"><div class="wrap"><h2>${esc(p.faixa_titulo)}</h2></div></section>

<section class="section">
  <div class="wrap two-col">
    <div>
      <p class="kicker">${esc(p.essencia_destaque)}</p>
      ${paragrafos(p.essencia_paragrafos)}
    </div>
    <div class="panel">
      <p class="eyebrow">${esc(p.caixa_etiqueta)}</p>
      <h3>${esc(p.caixa_titulo)}</h3>
      <p>${esc(p.caixa_texto)}</p>
      <a class="btn" href="qualidade.html">${esc(p.caixa_botao)}</a>
    </div>
  </div>
</section>
${cartoes ? `<section class="section alt" id="solucoes"><div class="wrap"><div class="cards">${cartoes}</div></div></section>` : ""}
${gal ? `<section class="section"><div class="wrap"><div class="thumbs">${gal}</div></div></section>` : ""}
` + apelo(p.apelo_titulo, p.apelo_texto, p.apelo_botao, "contactos.html");
  return documento(c, "index.html", p.titulo_separador, p.descricao_google, corpo);
}

function sobre(c) {
  const p = c.paginas.sobre;
  const marcos = (p.marcos || []).map((m, i) => `<article class="milestone${i % 2 ? " reverse" : ""}">
      <img src="${attr(m.imagem)}" alt="${attr(m.descricao_imagem)}" loading="lazy">
      <div><h3>${esc(m.ano)}</h3>${bloco(m.texto)}</div>
    </article>`).join("\n");
  const corpo = topo(p.topo_imagem, p.topo_titulo, p.topo_subtitulo) + `
<section class="section"><div class="wrap narrow center"><h2>${esc(p.intro_titulo)}</h2>${bloco(p.intro_texto)}</div></section>
<section class="section alt"><div class="wrap timeline">${marcos}</div></section>
<section class="section">
  <div class="wrap two-col">
    <div>
      <h2>${esc(p.compromisso_titulo)}</h2>
      <p>${esc(p.compromisso_intro)}</p>
      <ul class="checks">${(p.compromisso_lista || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
    <img class="rounded" src="${attr(p.compromisso_imagem)}" alt="" loading="lazy">
  </div>
</section>`;
  return documento(c, "sobre-nos.html", p.titulo_separador, p.descricao_google, corpo);
}

function brist(c) {
  const p = c.paginas.brist, g = c.geral;
  const vant = (p.vantagens || []).map((v) => `<div class="feature"><h3>${esc(v.titulo)}</h3><p>${esc(v.texto)}</p></div>`).join("");
  const mods = (p.modelos || []).map((m) => `<figure class="model"><img src="${attr(m.imagem)}" alt="Modelo BRIST ${attr(m.nome)}" loading="lazy"><figcaption>${esc(m.nome)}</figcaption></figure>`).join("");
  const corpo = topo(p.topo_imagem, p.topo_titulo, p.topo_subtitulo,
    `<p>${esc(p.topo_texto)}</p><div class="btns"><a class="btn" href="${attr(mailCatalogo(g))}">${esc(p.botao_catalogo)}</a></div>`) + `
<section class="section">
  <div class="wrap narrow"><h2>${esc(p.intro_titulo)}</h2>${paragrafos(p.intro_paragrafos)}</div>
  <div class="wrap features">${vant}</div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2 class="center">${esc(p.modelos_titulo)}</h2>
    <div class="models">${mods}</div>
    <p class="center doc-links">
      <a href="brist-hangtag.html">Hangtag BRIST – Certified Footwear</a>
      ${p.declaracao_pdf ? `<a href="${attr(urlOk(p.declaracao_pdf))}">Declaração de Conformidade</a>` : ""}
    </p>
  </div>
</section>
${p.instagram_brist ? `<section class="section"><div class="wrap center"><h2>Informações comerciais</h2><p><a class="inline-social" href="${attr(urlOk(p.instagram_brist))}" target="_blank" rel="noopener">${ICON.instagram}Instagram BRIST</a></p></div></section>` : ""}
` + apelo(p.apelo_titulo, p.apelo_texto, p.botao_catalogo, mailCatalogo(g));
  const hang = `<section class="section"><div class="wrap center">
  <h1>Hangtag BRIST – Certified Footwear</h1>
  <img class="rounded hangtag" src="${attr(p.hangtag_imagem)}" alt="Descrição detalhada do modelo BRIST" loading="lazy">
  <p><a class="btn" href="brist.html">Voltar à BRIST</a></p>
</div></section>`;
  return {
    "brist.html": documento(c, "brist.html", p.titulo_separador, p.descricao_google, corpo),
    "brist-hangtag.html": documento(c, "brist-hangtag.html", "Hangtag BRIST | Facobil", "Descrição detalhada dos modelos BRIST.", hang, "brist.html"),
  };
}

function qualidade(c) {
  const p = c.paginas.qualidade;
  const etapas = (p.etapas || []).map((e, i) => `<li><span class="step-n">${i + 1}</span><div><h3>${esc(e.titulo)}</h3><p>${esc(e.texto)}</p></div></li>`).join("");
  const val = (p.valores || []).map((v) => `<div class="feature"><img src="${attr(v.imagem)}" alt="" width="54" height="54"><h3>${esc(v.titulo)}</h3><p>${esc(v.texto)}</p></div>`).join("");
  const corpo = topo(p.topo_imagem, p.topo_titulo, p.topo_subtitulo) + `
<section class="section">
  <div class="wrap two-col">
    <div><h2>${esc(p.controlo_titulo)}</h2><p>${esc(p.controlo_texto)}</p><p class="eyebrow">${esc(p.controlo_etiqueta)}</p></div>
    <ol class="steps">${etapas}</ol>
  </div>
</section>
<section class="section alt"><div class="wrap features">${val}</div></section>
<section class="section">
  <div class="wrap two-col">
    <img class="rounded" src="${attr(p.sustentabilidade_imagem)}" alt="" loading="lazy">
    <div><h2>${esc(p.sustentabilidade_titulo)}</h2>${paragrafos(p.sustentabilidade_paragrafos)}</div>
  </div>
</section>`;
  return documento(c, "qualidade.html", p.titulo_separador, p.descricao_google, corpo);
}

function projetos(c) {
  const p = c.paginas.projetos;
  const gal = (p.galeria || []).map((x) => `<figure><img src="${attr(x.imagem)}" alt="${attr(x.descricao_imagem)}" loading="lazy"></figure>`).join("");
  const corpo = topo(p.topo_imagem, p.topo_titulo, p.topo_subtitulo) +
    `\n<section class="section"><div class="wrap"><div class="gallery">${gal}</div></div></section>\n` +
    apelo(p.apelo_titulo, p.apelo_texto, p.apelo_botao, "contactos.html");
  return documento(c, "projetos.html", p.titulo_separador, p.descricao_google, corpo);
}

function contactos(c) {
  const p = c.paginas.contactos, g = c.geral;
  const corpo = topo(p.topo_imagem, p.topo_titulo, p.topo_subtitulo) + `
<section class="section">
  <div class="wrap two-col">
    <div>
      ${bloco(p.intro_texto)}
      <dl class="contact-dl">
        <dt>${ICON.pin}Localização</dt><dd>${String(g.morada || "").split("\n").map(esc).join("<br>")}</dd>
        <dt>${ICON.phone}Telefone</dt><dd><a href="${telHref(g.telefone)}">${telTxt(g.telefone)}</a></dd>
        <dt>${ICON.mail}E-mail</dt><dd><a href="mailto:${attr(g.email)}">${esc(g.email)}</a></dd>
        <dt>Redes sociais</dt><dd class="social dark">${social(g)}</dd>
      </dl>
    </div>
    <div class="panel contact-card">
      <h2>${esc(p.caixa_titulo)}</h2>
      <p>${esc(p.caixa_texto)}</p>
      <div class="btns">
        <a class="btn" href="mailto:${attr(g.email)}?subject=Pedido%20de%20informa%C3%A7%C3%B5es">${ICON.mail}Enviar e-mail</a>
        <a class="btn btn-outline" href="${telHref(g.telefone)}">${ICON.phone}Ligar</a>
      </div>
    </div>
  </div>
</section>`;
  return documento(c, "contactos.html", p.titulo_separador, p.descricao_google, corpo);
}

function legal(c, chave, ficheiro) {
  const p = c.paginas[chave];
  const s = (p.seccoes || []).map((x) => (x.titulo ? `<h2>${esc(x.titulo)}</h2>\n` : "") + paragrafos(x.paragrafos)).join("\n");
  return documento(c, ficheiro, p.titulo_separador, p.descricao_google, `<section class="section"><div class="wrap narrow legal"><h1>${esc(p.titulo)}</h1>\n${s}</div></section>`, "");
}

const e404 = (c) => documento(c, "404.html", "Página não encontrada | Facobil", "Página não encontrada.",
  `<section class="section"><div class="wrap narrow center"><h1>Página não encontrada</h1><p>A página que procura não existe ou foi movida.</p><a class="btn" href="index.html">Voltar ao início</a></div></section>`, "", { noindex: true });

// ---------- tudo ----------
export function gerarSite(c) {
  const paginas = {
    "index.html": inicio(c),
    "sobre-nos.html": sobre(c),
    ...brist(c),
    "qualidade.html": qualidade(c),
    "projetos.html": projetos(c),
    "contactos.html": contactos(c),
    "codigo-de-conduta.html": legal(c, "codigo_conduta", "codigo-de-conduta.html"),
    "privacidade.html": legal(c, "privacidade", "privacidade.html"),
    "404.html": e404(c),
  };
  const d = String(c.geral.dominio || "").replace(/\/$/, "");
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = Object.keys(paginas).filter((f) => f !== "404.html")
    .map((f) => `  <url><loc>${esc(d)}/${f === "index.html" ? "" : f}</loc><lastmod>${hoje}</lastmod></url>`).join("\n");
  for (const k of Object.keys(paginas)) paginas[k] = paginas[k].replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");
  return {
    ...paginas,
    "css/tema.css": gerarTema(c.aparencia || {}, c.paginas?.inicio?.faixa_imagem),
    "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    "robots.txt": `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${d}/sitemap.xml\n`,
  };
}
