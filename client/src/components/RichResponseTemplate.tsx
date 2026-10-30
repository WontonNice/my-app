import {createElement, type ReactNode} from 'react';

/** Safe source layout around live controls; never execute source scripts/styles. */
export function RichResponseTemplate({html, renderText}: {html:string; renderText:(text:string,key:string)=>ReactNode}) {
  const doc = new DOMParser().parseFromString(html,'text/html');
  const tags = new Set('p div span strong em u s sub sup br table caption thead tbody tfoot tr th td ul ol li blockquote'.split(' '));
  function render(node:Node,key:string):ReactNode {
    // HTML source-code whitespace collapses inline. Only authored br/block
    // elements create visible breaks; plain-text templates keep their own rules.
    if (node.nodeType === Node.TEXT_NODE) return renderText((node.textContent || '').replace(/[\t\r\n\f ]+/g,' '),key);
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const element=node as Element, tag=element.tagName.toLowerCase();
    if (!tags.has(tag)) return null;
    const props:Record<string,unknown>={key};
    for (const [attribute,prop] of [['colspan','colSpan'],['rowspan','rowSpan']]) {
      const n=Number(element.getAttribute(attribute));if(n>=1 && n<=100)props[prop]=n;
    }
    const align=element.getAttribute('data-align');if(align)props['data-align']=align;
    if(element.getAttribute('data-no-break')==='true')props['data-no-break']='true';
    const dropdownWidth=element.getAttribute('data-dropdown-width');
    if(['60','90','150','210','270'].includes(dropdownWidth || ''))props['data-dropdown-width']=dropdownWidth;
    if(tag==='th')props.scope=element.getAttribute('scope') || 'col';
    return createElement(tag,props,tag==='br' ? undefined : Array.from(element.childNodes).map((child,i)=>render(child,`${key}-${i}`)));
  }
  return <div className="exam-rich-text exam-rich-response-template">{Array.from(doc.body.childNodes).map((node,i)=>render(node,String(i)))}</div>;
}
