// Read-only DOM serializer for documented browser evaluate APIs. It reads only
// the visible Test Preview and never uses React state, requests or credentials.
// Store every small batch before navigating further; normalize offline with
// sat-source-normalize.cjs. Call once before and once after Show answer + Explanation.
function captureSatRenderedQuestion() {
  const root=document.querySelector('.testSHSATPreview');
  if(!root)throw Error('The SAT Crash Course Test Preview is not open.');
  function walk(node) {
    if(node.nodeType===3)return {text:node.textContent};
    if(node.nodeType!==1 || ['SCRIPT','STYLE'].includes(node.tagName))return null;
    const style=getComputedStyle(node);
    return {
      tag:node.tagName.toLowerCase(),
      attrs:Object.fromEntries(Array.from(node.attributes).filter(a=>!/^on/i.test(a.name) && !(a.name==='value' && ['INPUT','TEXTAREA','MATH-FIELD'].includes(node.tagName))).map(a=>[a.name,a.value])),
      style:{fontWeight:style.fontWeight,fontStyle:style.fontStyle,textDecorationLine:style.textDecorationLine,display:style.display,visibility:style.visibility,opacity:style.opacity},
      children:Array.from(node.childNodes,walk).filter(Boolean),
      ...(node.shadowRoot?{shadow:Array.from(node.shadowRoot.childNodes,walk).filter(Boolean)}:{}),
      ...(node.tagName==='IMG'?{image:{url:node.currentSrc || node.getAttribute('src'),width:node.width,height:node.height,naturalWidth:node.naturalWidth,naturalHeight:node.naturalHeight}}:{}),
    };
  }
  const progress=root.querySelector('.testSHSATPreview__navigatorToggle')?.textContent.match(/Question\s+(\d+)\s*\/\s*(\d+)/);
  if(!progress)throw Error('Cannot verify the current question number.');
  return {number:Number(progress[1]),total:Number(progress[2]),sourceNumber:Number(root.querySelector('.testSHSATPreview__questionNumber')?.textContent),module:root.querySelector('.testSHSATPreview__title')?.textContent,
    tree:{tag:'div',attrs:{class:'testSHSATPreview'},children:['.testSHSATPreview__moduleSelect','.testSHSATPreview__navigatorToggle','.testSHSATPreview__passage','.testSHSATPreview__question','.testSHSATPreview__popup--explanation'].map(selector=>root.querySelector(selector)).filter(Boolean).map(walk)}};
}
if(typeof module!=='undefined')module.exports=captureSatRenderedQuestion;
