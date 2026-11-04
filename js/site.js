// Menu no telemóvel
const t=document.querySelector('.nav-toggle'),n=document.querySelector('.site-header nav');
if(t&&n)t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)});
// Preenche o assunto quando se chega pelo botão "Pedir catálogo"
const a=document.getElementById('assunto'),q=new URLSearchParams(location.search).get('assunto');
if(a&&q==='catalogo-brist')a.value='Pedido de catálogo BRIST';
// Atualiza sozinho os anos de experiência (desde 1981)
document.querySelectorAll('[data-desde]').forEach(e=>{e.textContent=new Date().getFullYear()-Number(e.dataset.desde)});
// Depois de enviar o formulário, o Web3Forms volta para a página de agradecimento deste site
const r=document.getElementById('redirect');if(r)r.value=new URL('obrigado.html',location.href).href;
