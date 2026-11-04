# Site Facobil

Site estático em HTML, CSS e JavaScript próprios, sem plataforma. Publicado gratuitamente com GitHub Pages.

## Como está organizado
- `conteudo/site.json`: todo o conteúdo publicado (textos, imagens, cores, letras).
- `conteudo/rascunho.json`: o rascunho do painel (não aparece no site até carregar em **Publicar**).
- `estatico/`: CSS, JavaScript, letras, imagens e ícone.
- `docs/`: PDFs para download.
- `gerador/`: o código que constrói as páginas a partir do conteúdo (o mesmo é usado na pré-visualização do painel).
- `admin/`: o painel de edição, em `/admin/` no site.
- `.github/workflows/publicar.yml`: constrói e publica o site sempre que `conteudo/site.json` muda.

## Editar
Abrir `https://ligiapereira2089-beep.github.io/facobil-site/admin/` e entrar com a chave de acesso (instruções no próprio painel).

## Construir localmente (opcional)
`node gerador/construir.mjs` gera o site em `_site/`.
