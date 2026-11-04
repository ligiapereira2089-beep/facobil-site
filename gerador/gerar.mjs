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

export const IDIOMAS = ["pt", "en"];
const TXT = {
  pt: {
    nav: { "index.html": "Início", "sobre-nos.html": "Sobre nós", "brist.html": "BRIST", "danca.html": "Dança", "qualidade.html": "Qualidade", "projetos.html": "Projetos", "contactos.html": "Contactos" },
    inicial: "página inicial", principal: "Principal", saltar: "Saltar para o conteúdo",
    ligacoes: "Ligações rápidas", solucoes: "Soluções e produção", servicos: "Serviços", contactos: "Contactos",
    siga: "Siga-nos nas nossas redes sociais", direitos: "Todos os direitos reservados.",
    conduta: "Código de Conduta e Ética", privacidade: "Política de Privacidade e Cookies",
    localizacao: "Localização", telefone: "Telefone", email: "E-mail", redes: "Redes sociais",
    enviar: "Enviar e-mail", ligar: "Ligar", assunto: "Pedido de informações", assunto_catalogo: "Pedido de catálogo BRIST",
    hangtag: "Hangtag BRIST – Certified Footwear", hangtag_desc: "Descrição detalhada dos modelos BRIST.", hangtag_alt: "Descrição detalhada do modelo BRIST",
    voltar_brist: "Voltar à BRIST", declaracao: "Declaração de Conformidade", info_comerciais: "Informações comerciais",
    modelo: "Modelo BRIST", nao_encontrada: "Página não encontrada", nao_existe: "A página que procura não existe ou foi movida.",
    voltar_inicio: "Voltar ao início", idioma: "Idioma", locale: "pt_PT", html: "pt-PT",
  },
  en: {
    nav: { "index.html": "Home", "sobre-nos.html": "About us", "brist.html": "BRIST", "danca.html": "Dance", "qualidade.html": "Quality", "projetos.html": "Projects", "contactos.html": "Contact" },
    inicial: "home page", principal: "Main", saltar: "Skip to content",
    ligacoes: "Quick links", solucoes: "Solutions and production", servicos: "Services", contactos: "Contact",
    siga: "Follow us on social media", direitos: "All rights reserved.",
    conduta: "Code of Conduct and Ethics", privacidade: "Privacy and Cookies Policy",
    localizacao: "Location", telefone: "Phone", email: "E-mail", redes: "Social media",
    enviar: "Send e-mail", ligar: "Call", assunto: "Information request", assunto_catalogo: "BRIST catalogue request",
    hangtag: "BRIST Hangtag – Certified Footwear", hangtag_desc: "Detailed description of the BRIST models.", hangtag_alt: "Detailed description of the BRIST model",
    voltar_brist: "Back to BRIST", declaracao: "Declaration of Conformity", info_comerciais: "Sales information",
    modelo: "BRIST model", nao_encontrada: "Page not found", nao_existe: "The page you are looking for does not exist or has been moved.",
    voltar_inicio: "Back to home", idioma: "Language", locale: "en_GB", html: "en",
  },
};
let T = TXT.pt, LANG = "pt";
const NAV_ORDEM = ["index.html", "sobre-nos.html", "brist.html", "danca.html", "qualidade.html", "projetos.html", "contactos.html"];
let NAV = [];

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

function cabecalho(g, ativo, ficheiro) {
  const links = NAV.map(([h, t]) => `<li><a href="${h}"${h === ativo ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");
  const pag = ficheiro || "index.html";
  const outro = LANG === "pt" ? { l: "en", href: `en/${pag}`, nome: "English" } : { l: "pt", href: `../${pag}`, nome: "Português" };
  const atual = `<span aria-current="true">${LANG.toUpperCase()}</span>`, link = `<a href="${outro.href}" hreflang="${outro.l}" lang="${outro.l}" title="${outro.nome}">${outro.l.toUpperCase()}</a>`;
  const seletor = `<li class="idiomas"><span class="so-leitor">${T.idioma}: </span>${LANG === "pt" ? atual + " " + link : link + " " + atual}</li>`;
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="index.html" aria-label="${attr(g.nome_empresa)}, ${T.inicial}">
      <img src="${attr(g.logotipo_cabecalho)}" alt="${attr(g.nome_empresa)}" width="132" height="36">
    </a>
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav aria-label="${T.principal}"><ul id="menu">${links}${seletor}</ul></nav>
  </div>
</header>`;
}

function rodape(g) {
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <img src="${attr(g.logotipo_rodape)}" alt="${attr(g.nome_empresa)}" width="200" height="54" class="footer-logo">
      <p>${esc(g.texto_rodape)}</p>
    </div>
    <div>
      <h2>${T.ligacoes}</h2>
      <ul>
        <li><a href="sobre-nos.html">${T.nav["sobre-nos.html"]}</a></li>
        <li><a href="index.html#solucoes">${T.solucoes}</a></li>
        <li><a href="brist.html">BRIST</a></li>
        <li><a href="projetos.html">${T.nav["projetos.html"]}</a></li>
      </ul>
    </div>
    <div>
      <h2>${T.servicos}</h2>
      <ul>${(g.servicos_rodape || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </div>
    <div>
      <h2>${T.contactos}</h2>
      <ul class="contact-list">
        <li>${ICON.pin}${esc(g.localidade)}</li>
        <li>${ICON.phone}<a href="${telHref(g.telefone)}">${telTxt(g.telefone)}</a></li>
        <li>${ICON.mail}<a href="mailto:${attr(g.email)}">${esc(g.email)}</a></li>
      </ul>
      <p class="follow">${T.siga}</p>
      <div class="social">${social(g)}</div>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span>© ${esc(g.nome_empresa)}. ${T.direitos}</span>
    <span><a href="codigo-de-conduta.html">${T.conduta}</a> · <a href="privacidade.html">${T.privacidade}</a></span>
  </div>
</footer>`;
}

function jsonld(g) {
  const d = String(g.dominio || "").replace(/\/$/, "");
  const o = {
    "@context": "https://schema.org", "@type": "Organization", name: g.nome_legal, alternateName: g.nome_empresa,
    url: d, logo: `${d}/${g.logotipo_fundo_claro || g.logotipo_rodape}`, foundingDate: String(g.ano_fundacao), telephone: g.telefone, email: g.email,
    address: { "@type": "PostalAddress", streetAddress: String(g.morada || "").split("\n")[0], addressLocality: g.localidade, addressCountry: "PT" },
    sameAs: [g.facebook, g.instagram, g.linkedin].filter(Boolean),
  };
  return `\n<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
}

function documento(c, ficheiro, titulo, descricao, corpo, ativo, opcoes = {}) {
  const g = c.geral;
  const d = String(g.dominio || "").replace(/\/$/, "");
  const rel = (l) => `${l === "pt" ? "" : l + "/"}${ficheiro === "index.html" ? "" : ficheiro}`;
  const url = `${d}/${rel(LANG)}`;
  const alternativos = ficheiro === "404.html" ? "" : IDIOMAS.map((l) => `\n<link rel="alternate" hreflang="${l}" href="${attr(d + "/" + rel(l))}">`).join("") + `\n<link rel="alternate" hreflang="x-default" href="${attr(d + "/" + rel("pt"))}">`;
  return `<!DOCTYPE html>
<html lang="${T.html}">
<head>
<meta charset="utf-8">${opcoes.noindex ? '\n<meta name="robots" content="noindex">' : ""}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${attr(descricao)}">
<meta property="og:title" content="${attr(titulo)}">
<meta property="og:description" content="${attr(descricao)}">
<link rel="canonical" href="${attr(url)}">${alternativos}
<meta property="og:type" content="website">
<meta property="og:locale" content="${T.locale}">
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
<a class="skip" href="#conteudo">${T.saltar}</a>
${cabecalho(g, ativo ?? ficheiro, ficheiro)}
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

const mailCatalogo = (g) => `mailto:${g.email}?subject=${encodeURIComponent(T.assunto_catalogo)}`;

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
  const mods = (p.modelos || []).map((m) => `<figure class="model"><img src="${attr(m.imagem)}" alt="${T.modelo} ${attr(m.nome)}" loading="lazy"><figcaption>${esc(m.nome)}</figcaption></figure>`).join("");
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
      <a href="brist-hangtag.html">${T.hangtag}</a>
      ${p.declaracao_pdf ? `<a href="${attr(urlOk(p.declaracao_pdf))}">${T.declaracao}</a>` : ""}
    </p>
  </div>
</section>
${p.instagram_brist ? `<section class="section"><div class="wrap center"><h2>${T.info_comerciais}</h2><p><a class="inline-social" href="${attr(urlOk(p.instagram_brist))}" target="_blank" rel="noopener">${ICON.instagram}Instagram BRIST</a></p></div></section>` : ""}
` + apelo(p.apelo_titulo, p.apelo_texto, p.botao_catalogo, mailCatalogo(g));
  const hang = `<section class="section"><div class="wrap center">
  <h1>${T.hangtag}</h1>
  <img class="rounded hangtag" src="${attr(p.hangtag_imagem)}" alt="${T.hangtag_alt}" loading="lazy">
  <p><a class="btn" href="brist.html">${T.voltar_brist}</a></p>
</div></section>`;
  return {
    "brist.html": documento(c, "brist.html", p.titulo_separador, p.descricao_google, corpo),
    "brist-hangtag.html": documento(c, "brist-hangtag.html", `${T.hangtag} | Facobil`, T.hangtag_desc, hang, "brist.html"),
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
        <dt>${ICON.pin}${T.localizacao}</dt><dd>${String(g.morada || "").split("\n").map(esc).join("<br>")}</dd>
        <dt>${ICON.phone}${T.telefone}</dt><dd><a href="${telHref(g.telefone)}">${telTxt(g.telefone)}</a></dd>
        <dt>${ICON.mail}${T.email}</dt><dd><a href="mailto:${attr(g.email)}">${esc(g.email)}</a></dd>
        <dt>${T.redes}</dt><dd class="social dark">${social(g)}</dd>
      </dl>
    </div>
    <div class="panel contact-card">
      <h2>${esc(p.caixa_titulo)}</h2>
      <p>${esc(p.caixa_texto)}</p>
      <div class="btns">
        <a class="btn" href="mailto:${attr(g.email)}?subject=${encodeURIComponent(T.assunto)}">${ICON.mail}${T.enviar}</a>
        <a class="btn btn-outline" href="${telHref(g.telefone)}">${ICON.phone}${T.ligar}</a>
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

const e404 = (c) => documento(c, "404.html", `${T.nao_encontrada} | Facobil`, T.nao_encontrada,
  `<section class="section"><div class="wrap narrow center"><h1>${T.nao_encontrada}</h1><p>${T.nao_existe}</p><a class="btn" href="index.html">${T.voltar_inicio}</a></div></section>`, "", { noindex: true });

function danca(c) {
  const p = c.paginas.danca;
  const lista = p.caracteristicas || [];
  const car = lista.map((v) => `<div class="feature"><h3>${esc(v.titulo)}</h3>${v.paragrafos ? paragrafos(v.paragrafos) : `<p>${esc(v.texto)}</p>`}</div>`).join("");
  const gal = (p.galeria || []).map((x) => `<figure><img src="${attr(x.imagem)}" alt="${attr(x.descricao_imagem)}" loading="lazy"></figure>`).join("");
  const corpo = topo(p.topo_imagem, p.topo_titulo, p.topo_subtitulo) + `
<section class="section">
  ${p.intro_imagem
    ? `<div class="wrap two-col"><div><h2>${esc(p.intro_titulo)}</h2>${paragrafos(p.intro_paragrafos)}</div><img class="foto-produto" src="${attr(p.intro_imagem)}" alt="${attr(p.intro_descricao_imagem)}" width="574" height="648"></div>`
    : `<div class="wrap narrow"><h2>${esc(p.intro_titulo)}</h2>${paragrafos(p.intro_paragrafos)}</div>`}
  ${car ? `${p.caracteristicas_titulo ? `<div class="wrap narrow"><h2 class="center">${esc(p.caracteristicas_titulo)}</h2></div>` : ""}<div class="wrap features${lista.length % 2 === 0 ? " duas" : ""}">${car}</div>` : ""}
</section>
${gal ? `<section class="section alt"><div class="wrap">${p.galeria_titulo ? `<h2 class="center">${esc(p.galeria_titulo)}</h2>` : ""}<div class="gallery">${gal}</div></div></section>` : ""}
` + apelo(p.apelo_titulo, p.apelo_texto, p.apelo_botao, "contactos.html");
  return documento(c, "danca.html", p.titulo_separador, p.descricao_google, corpo);
}

// ---------- idiomas ----------
// A versão inglesa guarda só os textos; imagens, PDFs e contactos vêm sempre da versão portuguesa.
export const NAO_TRADUZ = /(?<!descricao_)imagem|logotipo|pdf|^cor_|^letra_|tamanho|email|telefone|dominio|facebook|instagram|linkedin|nipc|ano_fundacao|numero$/;
export function juntar(base, trad) {
  if (Array.isArray(base)) return base.map((x, i) => juntar(x, Array.isArray(trad) ? trad[i] : undefined));
  if (base && typeof base === "object") {
    const o = {};
    for (const [k, v] of Object.entries(base)) o[k] = NAO_TRADUZ.test(k) && typeof v !== "object" ? v : juntar(v, trad ? trad[k] : undefined);
    return o;
  }
  return trad === undefined || trad === null || trad === "" ? base : trad;
}

function prefixar(html, P) {
  if (!P) return html;
  return html.replace(/(src|href)="(img|css|js|docs|fonts)\//g, `$1="${P}$2/`).replace(/href="favicon\.png"/g, `href="${P}favicon.png"`);
}

function paginasDe(c) {
  const ex = (k) => c.paginas && c.paginas[k];
  NAV = NAV_ORDEM.filter((f) => f !== "danca.html" || ex("danca")).map((f) => [f, T.nav[f]]);
  const out = {
    "index.html": inicio(c),
    "sobre-nos.html": sobre(c),
    ...brist(c),
    "qualidade.html": qualidade(c),
    "projetos.html": projetos(c),
    "contactos.html": contactos(c),
    "codigo-de-conduta.html": legal(c, "codigo_conduta", "codigo-de-conduta.html"),
    "privacidade.html": legal(c, "privacidade", "privacidade.html"),
  };
  if (ex("danca")) out["danca.html"] = danca(c);
  return out;
}

// ---------- tudo ----------
export function gerarSite(conteudo) {
  const d = String(conteudo.geral.dominio || "").replace(/\/$/, "");
  const hoje = new Date().toISOString().slice(0, 10);
  const res = {}; const urls = [];
  for (const l of IDIOMAS) {
    LANG = l; T = TXT[l];
    if (l !== "pt" && !conteudo[l]) continue;
    const c = l === "pt" ? conteudo : { ...juntar({ geral: conteudo.geral, paginas: conteudo.paginas }, conteudo[l]), aparencia: conteudo.aparencia };
    const pags = paginasDe(c);
    if (l === "pt") pags["404.html"] = e404(c);
    const pasta = l === "pt" ? "" : l + "/";
    for (const [f, html] of Object.entries(pags)) {
      res[pasta + f] = prefixar(html, l === "pt" ? "" : "../").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");
      if (f !== "404.html") urls.push(`  <url><loc>${esc(d)}/${pasta}${f === "index.html" ? "" : f}</loc><lastmod>${hoje}</lastmod></url>`);
    }
  }
  LANG = "pt"; T = TXT.pt;
  return {
    ...res,
    "css/tema.css": gerarTema(conteudo.aparencia || {}, conteudo.paginas?.inicio?.faixa_imagem),
    "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
    "robots.txt": `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${d}/sitemap.xml\n`,
  };
}
