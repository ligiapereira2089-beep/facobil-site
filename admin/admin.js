// Painel do site Facobil — edita conteudo/rascunho.json e publica em conteudo/site.json através da API do GitHub.
import { gerarSite, FONTES, NAO_TRADUZ } from "./gerar.mjs";

const DONO = "ligiapereira2089-beep";
const REPO = "facobil-site";
const RAMO = "main";
const F_SITE = "conteudo/site.json";
const F_RASC = "conteudo/rascunho.json";
const API = `https://api.github.com/repos/${DONO}/${REPO}`;

const $ = (s) => document.querySelector(s);
let token = "";
let rascunho = null;      // conteúdo em edição
let shaRasc = null;       // sha do rascunho no GitHub (null = ainda não existe)
let shaSite = null;
let alterado = false;     // há alterações por guardar
let seccaoAtual = "geral";
const blobs = {};         // imagens enviadas nesta sessão: caminho -> URL local (para a pré-visualização)

// ---------- nomes legíveis ----------
const SECCOES = [
  ["geral", "Dados gerais e contactos"], ["aparencia", "Cores e letras"],
  ["paginas.inicio", "Página Início"], ["paginas.sobre", "Página Sobre nós"], ["paginas.brist", "Página BRIST"],
  ["paginas.danca", "Página Dança"], ["paginas.qualidade", "Página Qualidade"], ["paginas.projetos", "Página Projetos"], ["paginas.contactos", "Página Contactos"],
  ["paginas.codigo_conduta", "Código de Conduta"], ["paginas.privacidade", "Política de Privacidade"],
];
// versão inglesa: as mesmas secções, só com os campos de texto
const SECCOES_EN = SECCOES.filter(([c]) => c !== "aparencia").map(([c, n]) => ["en." + c, "EN · " + n.replace(/^Página /, "")]);
const TODAS = [...SECCOES, ...SECCOES_EN];
const ROTULOS = {
  nome_empresa: "Nome da empresa", nome_legal: "Nome legal", nipc: "NIPC", ano_fundacao: "Ano de fundação",
  email: "E-mail", telefone: "Telefone", morada: "Morada (uma linha por linha da morada)", localidade: "Localidade (rodapé)",
  dominio: "Endereço do site (domínio)", logotipo_cabecalho: "Logótipo do cabeçalho (fundo escuro)", logotipo_rodape: "Logótipo do rodapé",
  imagem_partilha: "Imagem ao partilhar nas redes (1200×630)", texto_rodape: "Texto do rodapé", servicos_rodape: "Serviços (rodapé)",
  cor_verde: "Verde da marca", cor_verde_escuro: "Verde dos botões e ligações", cor_cinza: "Cinza (cabeçalho e rodapé)",
  cor_preto: "Preto (faixa dos números)", cor_texto: "Cor do texto", cor_fundo_alternado: "Fundo das secções alternadas",
  letra_titulos: "Letra dos títulos", letra_texto: "Letra do texto", tamanho_texto: "Tamanho do texto (px)",
  titulo_separador: "Título no separador do navegador e no Google", descricao_google: "Descrição para o Google",
  topo_imagem: "Imagem de topo", topo_titulo: "Título de topo", topo_subtitulo: "Subtítulo de topo", topo_texto: "Texto de topo",
  botao_1: "Botão 1", botao_2: "Botão 2", numeros: "Números", numero: "Número (AUTO = anos desde a fundação)", legenda: "Legenda",
  faixa_titulo: "Título da faixa", faixa_imagem: "Imagem de fundo da faixa", essencia_destaque: "Frase de destaque",
  essencia_paragrafos: "Parágrafos", caixa_etiqueta: "Etiqueta da caixa", caixa_titulo: "Título da caixa", caixa_texto: "Texto da caixa",
  caixa_botao: "Botão da caixa", cartoes: "Cartões com download", ficheiro_pdf: "Ficheiro PDF", galeria: "Galeria",
  apelo_titulo: "Faixa final: título", apelo_texto: "Faixa final: texto", apelo_botao: "Faixa final: botão",
  intro_titulo: "Introdução: título", intro_texto: "Introdução: texto", intro_paragrafos: "Introdução: parágrafos",
  marcos: "Marcos da história", ano: "Ano", descricao_imagem: "Descrição da imagem (para quem não vê)",
  compromisso_titulo: "Compromisso: título", compromisso_intro: "Compromisso: introdução", compromisso_lista: "Compromisso: lista",
  compromisso_imagem: "Compromisso: imagem", botao_catalogo: "Botão do catálogo", vantagens: "Vantagens",
  modelos_titulo: "Modelos: título", modelos: "Modelos", nome: "Nome", hangtag_imagem: "Imagem do hangtag",
  declaracao_pdf: "Declaração de conformidade (PDF)", instagram_brist: "Instagram da BRIST",
  controlo_titulo: "Controlo: título", controlo_texto: "Controlo: texto", controlo_etiqueta: "Controlo: etiqueta",
  etapas: "Etapas", valores: "Valores", sustentabilidade_titulo: "Sustentabilidade: título",
  sustentabilidade_imagem: "Sustentabilidade: imagem", sustentabilidade_paragrafos: "Sustentabilidade: parágrafos",
  seccoes: "Secções", paragrafos: "Parágrafos (linhas começadas por \"- \" formam uma lista)", titulo: "Título", texto: "Texto", imagem: "Imagem",
  facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn",
  logotipo_fundo_claro: "Logótipo para fundos claros (Google)", caracteristicas: "Características", caracteristicas_titulo: "Características: título", intro_imagem: "Introdução: imagem", intro_descricao_imagem: "Introdução: descrição da imagem (para quem não vê)", galeria_titulo: "Galeria: título",
};
const rotulo = (k) => ROTULOS[k] || (k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, " "));
const eImagem = (k, v) => /imagem|logotipo/.test(k) && !/descricao/.test(k) && typeof v === "string";
const ePdf = (k) => /pdf/.test(k);
const eTextoLongo = (k, v) => /texto|paragrafo|morada|descricao_google|destaque/.test(k) || String(v).length > 80 || String(v).includes("\n");

// ---------- GitHub ----------
async function gh(caminho, opcoes = {}) {
  const r = await fetch(API + caminho, {
    ...opcoes,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(opcoes.headers || {}) },
  });
  if (r.status === 404 && opcoes.permitir404) return null;
  if (!r.ok) {
    let m = ""; try { m = (await r.json()).message; } catch {}
    const e = new Error(m || `Erro ${r.status}`); e.status = r.status; throw e;
  }
  return r.status === 204 ? null : r.json();
}
const paraB64 = (texto) => { const b = new TextEncoder().encode(texto); let s = ""; for (const x of b) s += String.fromCharCode(x); return btoa(s); };
const deB64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, "")), (c) => c.charCodeAt(0)));
const blobParaB64 = (blob) => new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(",")[1]); r.readAsDataURL(blob); });

async function lerJson(f) {
  const r = await gh(`/contents/${f}?ref=${RAMO}`, { permitir404: true });
  return r ? { dados: JSON.parse(deB64(r.content)), sha: r.sha } : null;
}
async function escrever(f, b64, sha, mensagem) {
  const corpo = { message: mensagem, content: b64, branch: RAMO };
  if (sha) corpo.sha = sha;
  const r = await gh(`/contents/${f}`, { method: "PUT", body: JSON.stringify(corpo) });
  return r.content.sha;
}
async function shaAtual(f) { const r = await gh(`/contents/${f}?ref=${RAMO}`, { permitir404: true }); return r ? r.sha : null; }

// ---------- avisos e estado ----------
function aviso(texto, tipo = "ok") {
  const a = $("#aviso"); a.textContent = texto; a.className = "aviso " + tipo; a.hidden = false;
  clearTimeout(aviso.t); aviso.t = setTimeout(() => (a.hidden = true), tipo === "erro" ? 9000 : 4500);
}
function estado(texto) { $("#estado").textContent = texto; }
function marcarAlterado() {
  alterado = true; estado("Alterações por guardar");
  try { localStorage.setItem("facobil-copia", JSON.stringify(rascunho)); } catch {}
}
window.addEventListener("beforeunload", (e) => { if (alterado) { e.preventDefault(); e.returnValue = ""; } });

// ---------- entrar ----------
function guardarToken(t, lembrar) {
  try { (lembrar ? localStorage : sessionStorage).setItem("facobil-token", t); } catch {}
}
function lerToken() {
  try { return localStorage.getItem("facobil-token") || sessionStorage.getItem("facobil-token") || ""; } catch { return ""; }
}
function sair() {
  try { localStorage.removeItem("facobil-token"); sessionStorage.removeItem("facobil-token"); } catch {}
  location.reload();
}

async function arrancar() {
  token = lerToken();
  if (!token) return mostrarEntrar();
  try {
    estado("A carregar…");
    const [site, rasc] = await Promise.all([lerJson(F_SITE), lerJson(F_RASC)]);
    if (!site) throw new Error("Não encontrei conteudo/site.json no repositório.");
    shaSite = site.sha;
    rascunho = rasc ? rasc.dados : structuredClone(site.dados);
    shaRasc = rasc ? rasc.sha : null;
    completar(rascunho, site.dados);
    // cópia local mais recente do que o rascunho guardado?
    let local = null; try { local = JSON.parse(localStorage.getItem("facobil-copia") || "null"); } catch {}
    if (local && JSON.stringify(local) !== JSON.stringify(rascunho) && confirm("Há alterações deste computador que não chegaram a ser guardadas. Recuperá-las?")) {
      rascunho = local; alterado = true;
    }
    mostrarEditor();
    estado(alterado ? "Alterações por guardar" : rasc ? "Rascunho carregado" : "Sem rascunho: a editar o site publicado");
  } catch (e) {
    if (e.status === 401 || e.status === 403) { sair(); return; }
    mostrarEntrar(); $("#erro-entrar").textContent = "Não foi possível carregar: " + e.message;
  }
}
function mostrarEntrar() { $("#entrar").hidden = false; $("#editor").hidden = true; $("#chave").focus(); }

$("#form-entrar").addEventListener("submit", async (e) => {
  e.preventDefault();
  token = $("#chave").value.trim();
  $("#erro-entrar").textContent = "";
  try {
    const r = await gh("");
    if (!r.permissions || !r.permissions.push) throw new Error("A chave não tem permissão de escrita (Contents: Read and write).");
    guardarToken(token, $("#lembrar").checked);
    $("#entrar").hidden = true; arrancar();
  } catch (err) {
    $("#erro-entrar").textContent = err.status === 401 ? "Chave inválida ou expirada." : err.status === 404 ? "A chave não tem acesso ao repositório facobil-site." : err.message;
  }
});

// ---------- estrutura ----------
// acrescenta ao rascunho o que existe no site publicado e lhe falta (ex.: página nova), sem mexer no que já tem
function completar(dest, orig) {
  for (const [k, v] of Object.entries(orig)) {
    if (k.startsWith("_")) continue;
    if (!(k in dest)) dest[k] = structuredClone(v);
    else if (v && typeof v === "object" && !Array.isArray(v) && dest[k] && typeof dest[k] === "object") completar(dest[k], v);
  }
}
// deixa a versão inglesa com a mesma forma da portuguesa (só campos de texto; vazio = usa o português)
function espelhar(pt, en) {
  if (Array.isArray(pt)) {
    const a = Array.isArray(en) ? en : [];
    a.length = pt.length;
    for (let i = 0; i < pt.length; i++) a[i] = espelhar(pt[i], a[i]);
    return a;
  }
  if (pt && typeof pt === "object") {
    const o = en && typeof en === "object" && !Array.isArray(en) ? en : {};
    for (const [k, v] of Object.entries(pt)) {
      if (k.startsWith("_")) continue;
      if (NAO_TRADUZ.test(k) && typeof v !== "object") { delete o[k]; continue; }
      o[k] = espelhar(v, o[k]);
    }
    for (const k of Object.keys(o)) if (!(k in pt)) delete o[k];
    return o;
  }
  return typeof en === "string" ? en : "";
}
function prepararEn() {
  rascunho.en = espelhar({ geral: rascunho.geral, paginas: rascunho.paginas }, rascunho.en);
}

// ---------- editor ----------
const obter = (caminho) => caminho.split(".").reduce((o, k) => o[k], rascunho);

function mostrarEditor() {
  $("#editor").hidden = false;
  const nav = $("#seccoes"); nav.innerHTML = "";
  if (seccaoAtual.startsWith("en.")) prepararEn();
  for (const [c, nome] of TODAS) {
    if (c === "en.geral") { const t = document.createElement("p"); t.className = "nota sep-idioma"; t.textContent = "English (versão inglesa)"; nav.appendChild(t); }
    const b = document.createElement("button"); b.type = "button"; b.textContent = nome; b.dataset.c = c;
    if (c === seccaoAtual) b.setAttribute("aria-current", "true");
    b.onclick = () => { seccaoAtual = c; mostrarEditor(); };
    nav.appendChild(b);
  }
  const main = $("#campos"); main.innerHTML = "";
  const h = document.createElement("h1"); h.textContent = TODAS.find((s) => s[0] === seccaoAtual)[1]; main.appendChild(h);
  if (seccaoAtual.startsWith("en.")) {
    const p = document.createElement("p"); p.className = "nota";
    p.textContent = "Versão inglesa (site/en/). Aqui só se traduzem textos: imagens, cores, contactos e ficheiros vêm da versão portuguesa. Um campo vazio mostra o texto português.";
    main.appendChild(p);
  }
  if (seccaoAtual === "aparencia") main.appendChild(notaContraste());
  main.appendChild(desenharObjeto(obter(seccaoAtual), seccaoAtual));
}

function notaContraste() {
  const p = document.createElement("p"); p.className = "nota";
  p.textContent = "Dica: o texto branco sobre o \"verde dos botões\" deve ter contraste de pelo menos 4,5:1 (norma WCAG) para ser legível. O painel avisa se a cor escolhida não cumprir.";
  return p;
}

function desenharObjeto(obj, caminho) {
  const div = document.createElement("div"); div.className = "grupo";
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("_")) continue;
    div.appendChild(desenharCampo(obj, k, v, `${caminho}.${k}`));
  }
  return div;
}

let idSeq = 0;
function desenharCampo(pai, k, v, caminho) {
  const id = "c" + (++idSeq);
  const caixa = document.createElement("div"); caixa.className = "campo";
  const lab = document.createElement("label"); lab.htmlFor = id; lab.textContent = rotulo(k);
  if (Array.isArray(v)) return desenharLista(pai, k, v, caminho);
  if (v && typeof v === "object") {
    const fs = document.createElement("fieldset"); const lg = document.createElement("legend"); lg.textContent = rotulo(k);
    fs.append(lg, desenharObjeto(v, caminho)); return fs;
  }
  caixa.appendChild(lab);
  if (k.startsWith("cor_")) {
    const linha = document.createElement("div"); linha.className = "linha";
    const cor = document.createElement("input"); cor.type = "color"; cor.id = id; cor.value = v;
    const hex = document.createElement("input"); hex.type = "text"; hex.value = v; hex.size = 8; hex.setAttribute("aria-label", rotulo(k) + " (código)");
    const av = document.createElement("span"); av.className = "contraste";
    const atualizar = (val) => { pai[k] = val; marcarAlterado(); avaliar(); };
    const avaliar = () => {
      if (k === "cor_verde_escuro") { const c = contraste(pai[k], "#ffffff"); av.textContent = `Contraste com branco: ${c.toFixed(2)}:1 ${c >= 4.5 ? "✓" : "⚠ abaixo de 4,5:1"}`; av.classList.toggle("mau", c < 4.5); }
    };
    cor.oninput = () => { hex.value = cor.value; atualizar(cor.value); };
    hex.onchange = () => { if (/^#[0-9a-fA-F]{6}$/.test(hex.value)) { cor.value = hex.value; atualizar(hex.value); } else aviso("Código de cor inválido. Use o formato #5d993d.", "erro"); };
    linha.append(cor, hex, av); caixa.appendChild(linha); avaliar(); return caixa;
  }
  if (k.startsWith("letra_")) {
    const s = document.createElement("select"); s.id = id;
    for (const f of Object.keys(FONTES)) { const o = document.createElement("option"); o.textContent = f; o.selected = f === v; s.appendChild(o); }
    s.onchange = () => { pai[k] = s.value; marcarAlterado(); };
    caixa.appendChild(s); return caixa;
  }
  if (eImagem(k, v)) return desenharImagem(pai, k, v, caixa, lab, id);
  if (ePdf(k)) return desenharPdf(pai, k, v, caixa, id);
  if (typeof v === "number") {
    const n = document.createElement("input"); n.type = "number"; n.id = id; n.value = v;
    n.onchange = () => { pai[k] = Number(n.value); marcarAlterado(); };
    caixa.appendChild(n); return caixa;
  }
  const el = eTextoLongo(k, v) ? document.createElement("textarea") : document.createElement("input");
  el.id = id; el.value = v ?? "";
  if (el.tagName === "TEXTAREA") { el.rows = Math.min(10, Math.max(2, Math.ceil(String(v).length / 90) + String(v).split("\n").length - 1)); }
  el.oninput = () => { pai[k] = el.value; marcarAlterado(); };
  caixa.appendChild(el); return caixa;
}

function desenharLista(pai, k, arr, caminho) {
  const fs = document.createElement("fieldset"); fs.className = "lista";
  const lg = document.createElement("legend"); lg.textContent = rotulo(k); fs.appendChild(lg);
  arr.forEach((item, i) => {
    const linha = document.createElement("div"); linha.className = "item";
    if (item && typeof item === "object") linha.appendChild(desenharObjeto(item, `${caminho}.${i}`));
    else {
      const t = document.createElement("textarea"); t.value = item; t.rows = Math.min(8, Math.max(2, Math.ceil(String(item).length / 90) + String(item).split("\n").length - 1));
      t.setAttribute("aria-label", `${rotulo(k)} ${i + 1}`);
      t.oninput = () => { arr[i] = t.value; marcarAlterado(); };
      linha.appendChild(t);
    }
    const ctl = document.createElement("div"); ctl.className = "controlos";
    const mk = (txt, titulo, fn, dis) => { const b = document.createElement("button"); b.type = "button"; b.className = "b b-pequeno"; b.textContent = txt; b.title = titulo; b.setAttribute("aria-label", titulo); b.disabled = !!dis; b.onclick = fn; return b; };
    ctl.append(
      mk("↑", "Subir", () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; marcarAlterado(); mostrarEditor(); }, i === 0),
      mk("↓", "Descer", () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; marcarAlterado(); mostrarEditor(); }, i === arr.length - 1),
      mk("Remover", "Remover este item", () => { if (confirm("Remover este item?")) { arr.splice(i, 1); marcarAlterado(); mostrarEditor(); } }),
    );
    linha.appendChild(ctl); fs.appendChild(linha);
  });
  const add = document.createElement("button"); add.type = "button"; add.className = "b"; add.textContent = "+ Acrescentar";
  add.onclick = () => {
    const modelo = arr[0];
    arr.push(modelo && typeof modelo === "object" ? vazio(modelo) : "");
    marcarAlterado(); mostrarEditor();
  };
  fs.appendChild(add); return fs;
}
const vazio = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? [] : typeof v === "object" && v ? vazio(v) : typeof v === "number" ? 0 : ""]));

// ---------- imagens ----------
function urlImagem(caminho) { return blobs[caminho] || `../${caminho}`; }

function desenharImagem(pai, k, v, caixa, lab, id) {
  caixa.classList.add("campo-imagem");
  const img = document.createElement("img"); img.alt = ""; img.src = v ? urlImagem(v) : "";
  img.onerror = () => { img.classList.add("sem"); };
  const info = document.createElement("span"); info.className = "nota"; info.textContent = v || "(sem imagem)";
  const f = document.createElement("input"); f.type = "file"; f.id = id; f.accept = "image/jpeg,image/png,image/webp";
  f.onchange = async () => {
    const ficheiro = f.files[0]; if (!ficheiro) return;
    try {
      estado("A preparar a imagem…");
      const logotipo = /logotipo|icone/.test(k) || /icone/.test(v || "");
      const { blob, ext } = await reduzir(ficheiro, /topo|faixa|partilha/.test(k) ? 1920 : logotipo ? 600 : 1400, logotipo);
      const base = (v || "img/imagem").replace(/^img\//, "").replace(/\.[a-z]+$/i, "").replace(/-\d{10,}$/, "");
      const caminho = `img/${base}-${Date.now()}.${ext}`;
      estado("A enviar a imagem…");
      await escrever(`estatico/${caminho}`, await blobParaB64(blob), null, `Painel: nova imagem ${caminho}`);
      blobs[caminho] = URL.createObjectURL(blob);
      rascunho._imagens_novas = [...new Set([...(rascunho._imagens_novas || []), caminho])];
      pai[k] = caminho; marcarAlterado();
      img.src = blobs[caminho]; img.classList.remove("sem"); info.textContent = `${caminho} (${Math.round(blob.size / 1024)} KB)`;
      aviso("Imagem enviada. Guarde o rascunho para não perder a alteração.");
      estado("Alterações por guardar");
    } catch (e) { aviso("Não foi possível enviar a imagem: " + e.message, "erro"); estado(""); }
  };
  const dica = document.createElement("span"); dica.className = "nota"; dica.textContent = "A imagem é reduzida automaticamente antes de ser enviada.";
  caixa.append(img, info, f, dica);
  return caixa;
}

// Reduz a imagem no navegador: lado maior até "max" px; JPEG com qualidade 0,82 (PNG para logótipos com transparência)
async function reduzir(ficheiro, max, manterPng) {
  const bmp = await createImageBitmap(ficheiro);
  const escala = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * escala), h = Math.round(bmp.height * escala);
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  const png = manterPng && ficheiro.type === "image/png";
  if (!png) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); }
  ctx.drawImage(bmp, 0, 0, w, h);
  const blob = await new Promise((ok) => c.toBlob(ok, png ? "image/png" : "image/jpeg", 0.82));
  if (blob.size > 20 * 1024 * 1024) throw new Error("A imagem continua demasiado grande.");
  return { blob, ext: png ? "png" : "jpg" };
}

function desenharPdf(pai, k, v, caixa, id) {
  const info = document.createElement("span"); info.className = "nota"; info.textContent = v || "(sem ficheiro)";
  const f = document.createElement("input"); f.type = "file"; f.id = id; f.accept = "application/pdf";
  f.onchange = async () => {
    const ficheiro = f.files[0]; if (!ficheiro) return;
    if (ficheiro.size > 20 * 1024 * 1024) return aviso("O PDF tem mais de 20 MB. Reduza-o antes de o enviar.", "erro");
    try {
      estado("A enviar o PDF…");
      const caminho = v && /^docs\/[\w\-.]+\.pdf$/.test(v) ? v : `docs/${ficheiro.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
      await escrever(caminho, await blobParaB64(ficheiro), await shaAtual(caminho), `Painel: PDF ${caminho}`);
      pai[k] = caminho; marcarAlterado(); info.textContent = `${caminho} (${Math.round(ficheiro.size / 1024)} KB)`;
      aviso("PDF enviado. Fica disponível no site depois de publicar.");
    } catch (e) { aviso("Não foi possível enviar o PDF: " + e.message, "erro"); }
    estado("Alterações por guardar");
  };
  caixa.append(info, f);
  return caixa;
}

// ---------- contraste (WCAG) ----------
function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contraste(a, b) { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); }

// ---------- guardar, publicar, descartar ----------
const json = (o) => JSON.stringify(o, null, 2) + "\n";

async function guardar() {
  estado("A guardar…");
  try {
    shaRasc = await escrever(F_RASC, paraB64(json(rascunho)), shaRasc || (await shaAtual(F_RASC)), "Painel: guardar rascunho");
  } catch (e) {
    if (e.status === 409 || e.status === 422) { shaRasc = await shaAtual(F_RASC); shaRasc = await escrever(F_RASC, paraB64(json(rascunho)), shaRasc, "Painel: guardar rascunho"); }
    else throw e;
  }
  alterado = false; try { localStorage.removeItem("facobil-copia"); } catch {}
  estado("Rascunho guardado às " + new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }));
}

$("#b-guardar").onclick = async () => { try { await guardar(); aviso("Rascunho guardado. O site publicado não mudou."); } catch (e) { aviso("Erro ao guardar: " + e.message, "erro"); estado(""); } };

$("#b-publicar").onclick = async () => {
  if (!confirm("Publicar o rascunho no site? As alterações ficam visíveis para todos em 1 a 2 minutos.")) return;
  try {
    await guardar();
    const final = structuredClone(rascunho); delete final._imagens_novas;
    shaSite = await escrever(F_SITE, paraB64(json(final)), await shaAtual(F_SITE), "Painel: publicar alterações");
    rascunho._imagens_novas = []; await guardar();
    aviso("A publicar… o site fica atualizado em 1 a 2 minutos.");
    acompanharPublicacao();
  } catch (e) { aviso("Erro ao publicar: " + e.message, "erro"); estado(""); }
};

async function acompanharPublicacao() {
  const inicio = Date.now();
  estado("A publicar…");
  const passo = async () => {
    try {
      const r = await gh(`/actions/runs?branch=${RAMO}&per_page=1`);
      const run = r.workflow_runs && r.workflow_runs[0];
      if (run && new Date(run.created_at).getTime() > inicio - 60000) {
        if (run.status === "completed") {
          estado(run.conclusion === "success" ? "Publicado ✓" : "A publicação falhou");
          if (run.conclusion !== "success") aviso("A publicação falhou. Veja os detalhes no separador Actions do GitHub.", "erro");
          return;
        }
      }
    } catch { estado("A publicar… (não consigo ver o progresso; confirme no site daqui a 2 minutos)"); return; }
    if (Date.now() - inicio < 6 * 60000) setTimeout(passo, 8000); else estado("A publicação está a demorar. Confirme no separador Actions do GitHub.");
  };
  setTimeout(passo, 6000);
}

$("#b-descartar").onclick = async () => {
  if (!confirm("Descartar o rascunho e voltar ao que está publicado no site?")) return;
  try {
    const site = await lerJson(F_SITE); rascunho = site.dados; rascunho._imagens_novas = [];
    await guardar(); mostrarEditor(); aviso("Rascunho descartado.");
  } catch (e) { aviso("Erro: " + e.message, "erro"); }
  $("#menu-mais").hidden = true;
};
$("#b-sair").onclick = () => { if (!alterado || confirm("Há alterações por guardar. Sair mesmo assim?")) { alterado = false; sair(); } };
$("#b-menu").onclick = () => { const m = $("#menu-mais"); m.hidden = !m.hidden; $("#b-menu").setAttribute("aria-expanded", String(!m.hidden)); };

// ---------- pré-visualização ----------
let paginasPrevia = {}, paginaAtual = "index.html";
const NOMES = { "index.html": "Início", "sobre-nos.html": "Sobre nós", "brist.html": "BRIST", "danca.html": "Dança", "qualidade.html": "Qualidade", "projetos.html": "Projetos", "contactos.html": "Contactos" };
const idiomaDe = (f) => (f.startsWith("en/") ? "en/" : "");
const nomeDe = (f) => f.replace(/^en\//, "");

async function carregarImagensNovas() {
  for (const c of rascunho._imagens_novas || []) {
    if (blobs[c]) continue;
    try {
      const r = await fetch(`${API}/contents/estatico/${c}?ref=${RAMO}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.raw" } });
      if (r.ok) blobs[c] = URL.createObjectURL(await r.blob());
    } catch {}
  }
}

async function previsualizar() {
  estado("A preparar a pré-visualização…");
  await carregarImagensNovas();
  const conteudo = structuredClone(rascunho); delete conteudo._imagens_novas;
  paginasPrevia = gerarSite(conteudo);
  const nav = $("#previa-paginas"); nav.innerHTML = "";
  for (const [f, n] of Object.entries(NOMES)) {
    const b = document.createElement("button"); b.type = "button"; b.className = "b b-pequeno"; b.textContent = n; b.dataset.f = f;
    b.onclick = () => mostrarPagina(idiomaDe(paginaAtual) + f); nav.appendChild(b);
  }
  if (paginasPrevia["en/index.html"]) {
    const b = document.createElement("button"); b.type = "button"; b.className = "b b-pequeno"; b.id = "b-idioma-previa";
    b.onclick = () => mostrarPagina(idiomaDe(paginaAtual) ? nomeDe(paginaAtual) : "en/" + paginaAtual); nav.appendChild(b);
  }
  $("#previa").hidden = false; $("#editor").hidden = true;
  mostrarPagina(paginaAtual);
  estado(alterado ? "Alterações por guardar" : "");
}

function mostrarPagina(f) {
  if (!paginasPrevia[f]) f = idiomaDe(f) + "index.html";
  if (!paginasPrevia[f]) f = "index.html";
  paginaAtual = f;
  for (const b of $("#previa-paginas").children) if (b.dataset.f) b.setAttribute("aria-current", String(b.dataset.f === nomeDe(f)));
  const bi = $("#b-idioma-previa"); if (bi) bi.textContent = idiomaDe(f) ? "Ver em português" : "Ver em inglês";
  const raiz = new URL("../", location.href).href;
  let html = paginasPrevia[f]
    .replace("<head>", `<head>\n<base href="${raiz}${idiomaDe(f)}">`)
    .replace(/<link rel="stylesheet" href="(\.\.\/)?css\/tema\.css">/, "")
    .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\n?/, "")
    .replace(/<script src="(\.\.\/)?js\/site\.js"><\/script>/, "");
  // tema do rascunho como blob, imagens novas como blob
  const tema = URL.createObjectURL(new Blob([paginasPrevia["css/tema.css"].replace(/url\("\.\.\//g, `url("${new URL("../", location.href).href}`)], { type: "text/css" }));
  html = html.replace(/(<link rel="stylesheet" href="(\.\.\/)?css\/estilo\.css">)/, `$1\n<link rel="stylesheet" href="${tema}">`);
  for (const [c, u] of Object.entries(blobs)) html = html.split(`"${c}"`).join(`"${u}"`).split(`"../${c}"`).join(`"${u}"`);
  const fr = $("#previa-frame");
  fr.onload = () => {
    const d = fr.contentDocument; if (!d) return;
    d.addEventListener("click", (e) => {
      const a = e.target.closest("a"); if (!a) return;
      const h = a.getAttribute("href") || "";
      if (h.startsWith("#")) return;
      const alvo = new URL(h.split("#")[0], "http://x/" + f).pathname.slice(1);
      if (paginasPrevia[alvo]) { e.preventDefault(); mostrarPagina(alvo); }
      else if (!h.startsWith("#")) { e.preventDefault(); }
    });
  };
  fr.srcdoc = html;
}

$("#b-previsualizar").onclick = previsualizar;
$("#b-fechar-previa").onclick = () => { $("#previa").hidden = true; $("#editor").hidden = false; };
$("#b-largura").onclick = () => {
  const m = document.querySelector(".previa-moldura"); m.classList.toggle("telemovel");
  $("#b-largura").textContent = m.classList.contains("telemovel") ? "Ver em computador" : "Ver em telemóvel";
};

arrancar();
