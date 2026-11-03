import fs from 'node:fs';import {load} from 'cheerio';
const p='artifacts/import-2025-2026-missing/';
for(const n of [60,72,75,90,110]){const r=JSON.parse(fs.readFileSync(p+'testnav-b.json')).find(x=>x.number===n),$=load(r.html);$('.MathJax_CHTML,.MathJax_Preview,.MJX_Assistive_MathML').remove();$('script[type="math/mml"]').each((i,e)=>$(e).replaceWith($(e).html()));fs.writeFileSync(p+'b-'+n+'.html',$.html());console.log(n,$('[data-module]').map((i,e)=>$(e).attr('data-module')).get());console.log($('body').text().replace(/\s+/g,' ').slice(0,2500));}
