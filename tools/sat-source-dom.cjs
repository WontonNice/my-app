// Rehydrate a read-only DOM snapshot. Archived tags are data, never executable.
class SourceElement {
  constructor(record, parent = null) {
    this.nodeType = 1; this.tagName = record.tag.toUpperCase(); this.attributes = record.attrs || {}; this.parentElement = parent;
    this.computedStyle = record.style || {};
    this.classList = { contains: name => (this.attributes.class || '').split(/\s+/).includes(name) };
    this.style = Object.fromEntries((this.attributes.style || '').split(';').filter(s => s.includes(':')).map(s => { const i=s.indexOf(':');return [s.slice(0,i).trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),s.slice(i+1).trim()]; }));
    this.childNodes = (record.children || []).map(n => n.tag ? new SourceElement(n,this) : {nodeType:3,textContent:n.text || '',parentElement:this});
    if (record.shadow) this.shadowRoot = new SourceElement({tag:'shadow-root',children:record.shadow});
    if (record.image) Object.assign(this,{currentSrc:record.image.url,naturalWidth:record.image.naturalWidth,naturalHeight:record.image.naturalHeight,width:record.image.width,height:record.image.height});
  }
  get className(){return this.attributes.class || '';}
  get id(){return this.attributes.id || '';}
  get children(){return this.childNodes.filter(n=>n.nodeType===1);}
  get textContent(){return this.childNodes.map(n=>n.textContent).join('');}
  get innerText(){return this.textContent;}
  get disabled(){return Object.hasOwn(this.attributes,'disabled');}
  getAttribute(name){return this.attributes[name] ?? null;}
  getClientRects(){return this.computedStyle.display==='none'?[]:[{}];}
  contains(node){return node===this || this.children.some(n=>n.contains(node));}
  matches(selector){
    const parts=selector.trim().split(/\s+(?![^\[]*\])/),last=parts.pop(),tag=last.match(/^[\w-]+/);
    if(tag && this.tagName.toLowerCase()!==tag[0].toLowerCase())return false;
    for(const m of last.matchAll(/\.([\w-]+)|#([\w-]+)|\[([\w-]+)(?:=["']?([^\]"']*)["']?)?\]/g))if(m[1]&&!this.classList.contains(m[1]) || m[2]&&this.id!==m[2] || m[3]&&(this.getAttribute(m[3])===null || m[4]!==undefined&&this.getAttribute(m[3])!==m[4]))return false;
    if(!parts.length)return true;
    let parent=this.parentElement;while(parent){if(parent.matches(parts.join(' ')))return true;parent=parent.parentElement;}return false;
  }
  querySelectorAll(selector){const selectors=selector.split(',');return this.children.flatMap(n=>[...(selectors.some(s=>n.matches(s))?[n]:[]),...n.querySelectorAll(selector)]);}
  querySelector(selector){return this.querySelectorAll(selector)[0] || null;}
}
function documentFrom(record){const root=new SourceElement({tag:'main',children:[record]});return {body:root,querySelector:s=>root.querySelector(s),querySelectorAll:s=>root.querySelectorAll(s)};}
module.exports={SourceElement,documentFrom};
