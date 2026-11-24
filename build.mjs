import { mkdirSync, writeFileSync, cpSync, rmSync } from 'fs';
import { site, pages } from './pages.mjs';
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
for (const f of ['style.css', 'app.js', 'favicon.svg']) cpSync(f, 'dist/' + f);
const url = p => `${site}/${p.slug ? p.slug + '/' : ''}`;
const nav = pages.filter(p => ['', 'urdu-voice-to-text', 'urdu-youtube-script-generator', 'urdu-blog-article-writer', 'urdu-social-media-captions'].includes(p.slug))
  .map(p => `<a href="/${p.slug ? p.slug + '/' : ''}">${p.slug ? p.h1 : 'ہوم'}</a>`).join('');
const tool = p => !p.format ? '' : `<section class="tool" data-format="${p.format}">
<div class="bar"><button id="mic" type="button" aria-label="مائیک">🎙 بولیں</button>${p.format === 'transcript' ? '' : '<button id="gen" type="button" class="go">تحریر بنائیں</button>'}<button id="copy" type="button">کاپی</button></div>
<label for="src">آپ کا متن</label><textarea id="src" rows="6" placeholder="یہاں بولیں یا لکھیں..."></textarea>
${p.format === 'transcript' ? '' : '<label for="out">نتیجہ</label><div id="out" class="out" aria-live="polite"></div>'}
<p id="msg" class="msg" role="status"></p></section><noscript><p>اس ٹول کے لیے جاوا اسکرپٹ ضروری ہے۔</p></noscript>`;
const ld = p => p.slug ? '' : `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Urdu Voice-to-Content', url: url(p), applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', inLanguage: ['ur', 'en'], description: p.desc })}</script>`;
for (const p of pages) {
  const dir = p.slug ? `dist/${p.slug}` : 'dist'; mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><meta name="google-site-verification" content="kVzrtxtps4NZsp3dO2X-IM14ZqBp4mzgRr_wHbltjmk"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title><meta name="description" content="${p.desc}"><link rel="canonical" href="${url(p)}">
<meta property="og:title" content="${p.title}"><meta property="og:description" content="${p.desc}"><meta property="og:url" content="${url(p)}"><meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&family=Noto+Nastaliq+Urdu:wght@600&display=swap">
<link rel="stylesheet" href="/style.css">${ld(p)}</head><body>
<header><nav aria-label="مین مینو">${nav}</nav></header>
<main><h1>${p.h1}</h1><p class="lead">${p.lead}</p>${tool(p)}${p.body.join('')}</main>
<footer><a href="/about/">ہمارے بارے میں</a> <a href="/privacy/">پرائیویسی</a> <span>© ${new Date().getFullYear()}</span></footer>
${p.format ? '<script src="/app.js" defer></script>' : ''}</body></html>`);
}
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => p.sitemap !== false).map(p => `<url><loc>${url(p)}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`Built ${pages.length} pages for ${site}`);
