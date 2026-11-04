// Menu no telemóvel
const t=document.querySelector('.nav-toggle'),n=document.querySelector('.site-header nav');
if(t&&n)t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)});
// Atualiza sozinho os anos de experiência (desde 1981)
document.querySelectorAll('[data-desde]').forEach(e=>{e.textContent=new Date().getFullYear()-Number(e.dataset.desde)});
