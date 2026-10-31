// Small inert DOM adapter for reader tests. It never executes source markup.
const decode = value => value.replace(/&(?:amp|lt|gt|quot|apos|nbsp);|&#(?:x[\da-f]+|\d+);/gi, v => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' '}[v] ?? String.fromCodePoint(v[2].toLowerCase() === 'x' ? parseInt(v.slice(3),16) : parseInt(v.slice(2),10))));
class Element {
  constructor(tag = 'div', attributes = {}) {
    this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attributes = attributes; this.childNodes = [];
    this.classList = {contains: name => (attributes.class || '').split(/\s+/).includes(name)};
    this.style = Object.fromEntries((attributes.style || '').split(';').filter(s => s.includes(':')).map(s => {const i=s.indexOf(':'); return [s.slice(0,i).trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),s.slice(i+1).trim()];}));
  }
  get className() {return this.attributes.class || '';}
  get id() {return this.attributes.id || '';}
  get children() {return this.childNodes.filter(n => n.nodeType === 1);}
  get textContent() {return this.childNodes.map(n=>n.textContent).join('');}
  get innerText() {return this.textContent;}
  get disabled() {return Object.hasOwn(this.attributes,'disabled');}
  get checked() {return Object.hasOwn(this.attributes,'checked');}
  getAttribute(name) {return this.attributes[name] ?? null;}
  getClientRects() {return [{}];}
  contains(node) {return node === this || this.children.some(n=>n.contains(node));}
  matches(selector) {
    const parts = selector.trim().split(/\s+(?![^\[]*\])/);
    const last = parts.pop();
    const tag = last.match(/^[\w-]+/);
    if (tag && this.tagName.toLowerCase() !== tag[0]) return false;
    for (const match of last.matchAll(/\.([\w-]+)|#([\w-]+)|\[([\w-]+)(?:=["']?([^\]"']*)["']?)?\]/g)) {
      if (match[1] && !this.classList.contains(match[1]) || match[2] && this.id !== match[2] || match[3] && (this.getAttribute(match[3]) === null || match[4] !== undefined && this.getAttribute(match[3]) !== match[4])) return false;
    }
    if (!parts.length) return true;
    let parent = this.parentElement;
    while (parent) {if (parent.matches(parts.join(' '))) return true; parent=parent.parentElement;}
    return false;
  }
  querySelectorAll(selector) {const selectors=selector.split(','); return this.children.flatMap(n=>[...(selectors.some(s=>n.matches(s))?[n]:[]),...n.querySelectorAll(selector)]);}
  querySelector(selector) {return this.querySelectorAll(selector)[0] || null;}
}
function parse(html) {
  const root = new Element(), stack=[root];
  for (const token of html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || []) {
    if (token.startsWith('<!--') || token.startsWith('<!')) continue;
    if (token.startsWith('</')) {const tag=token.slice(2,-1).trim().toUpperCase(); const i=stack.findLastIndex(n=>n.tagName===tag); if(i>0)stack.length=i; continue;}
    const parent=stack.at(-1);
    if (token[0] !== '<') {parent.childNodes.push({nodeType:3,textContent:decode(token),parentElement:parent}); continue;}
    const tag=token.match(/^<([\w-]+)/)?.[1]; if(!tag)continue;
    const attrs={}; for(const m of token.slice(tag.length+1,-1).matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[m[1]]=decode(m[2]??m[3]??m[4]??'');
    const node=new Element(tag,attrs); node.parentElement=parent;parent.childNodes.push(node);
    if(!['input','img','br','hr','meta','link','source','area'].includes(tag) && !token.endsWith('/>'))stack.push(node);
  }
  return root;
}
module.exports={parse,Element};
