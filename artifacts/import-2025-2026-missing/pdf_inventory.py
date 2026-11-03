import pathlib,json,re,importlib.util,difflib,html
import pdfplumber
OUT=pathlib.Path(__file__).parent; ROOT=OUT.parent.parent
spec=importlib.util.spec_from_file_location('capture',ROOT/'artifacts/import-2023-2024/capture_exams.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
state=json.loads((OUT/'before.json').read_text())
def norm(t):return re.sub(r'[^a-z0-9]','',re.sub(r'\\(?:frac|text|mathrm|overline|left|right|times|cdot)','',html.unescape(re.sub('<[^>]+>','',t))).lower())
allq=[(m['fileName'],q) for m in state['mathSections'] for q in m['questions']]+[('standalone',q) for q in state['standaloneItems']]
def main():
 for name,lo,hi in [('20202021_form_a',1,53),('20202021_form_b',1,7),('20242025_form_a',3,4)]:
  out={}
  with pdfplumber.open(OUT/(name+'.pdf')) as pdf:
   for pi in range(lo-1,hi):
    page=pdf.pages[pi]; words=page.extract_words(x_tolerance=2,y_tolerance=2)
    starts=[w for w in words if re.fullmatch(r'\d{1,3}\.',w['text']) and (44<=w['x0']<=57 or 313<=w['x0']<=327) and 1<=int(w['text'][:-1])<=114]
    for w in starts:
     n=int(w['text'][:-1]);right=w['x0']>300
     if name=='20202021_form_a' and not(n<=10 or n>=58):continue
     following=[v['top'] for v in starts if (v['x0']>300)==right and v['top']>w['top']+5]
     box=[w['x0']-1,w['top']-7,568 if n<58 or right else 303,min(following)-12 if following else 716]
     labels=[v for v in words if re.fullmatch('[A-H]\\.',v['text']) and h.h.contained(v,box,1) and 23<v['x0']-w['x0']<40]
     cs=h.source_underlines(page,h.chars_in(page,box));cs=[c for c in cs if not h.h.contained(c,[w['x0']-1,w['top']-1,w['x1']+1,w['bottom']+1],1)]
     boxes=[[r['x0'],r['top'],r['x1'],r['bottom']] for r in page.rects if r['stroke'] and r['width']>100 and h.h.contained(r,box,1)] if n<58 else []
     end=min([v['top']-7 for v in labels],default=box[3]);t,m=h.prompt_rich(h.h.fraction_chars([c for c in cs if c['top']<end]),boxes=boxes)
     choices=[]
     for j,v in enumerate(labels):
      end=labels[j+1]['top']-7 if j+1<len(labels) else box[3]
      cc=[c for c in cs if v['top']-7<=c['top']<end and not h.h.contained(c,[v['x0']-1,v['top']-1,v['x1']+1,v['bottom']+1],1)]
      ct,cm=h.rich(h.h.fraction_chars(cc));choices.append(dict(id=v['text'][0],text=ct,html=cm))
     target=t+' '+ ' '.join(c['text'] for c in choices);tokens=set(re.findall('[a-z]{3,}',target.lower()));rank=[]
     for parent,q in allq:
      candidate=q.get('prompt','')+' '+q.get('stimulus','')+' '+' '.join(c.get('text','') for c in q.get('choices',[]));other=set(re.findall('[a-z]{3,}',candidate.lower()));coarse=len(tokens&other)/max(1,len(tokens|other));rank.append((coarse,parent,q,candidate))
     best=sorted([(difflib.SequenceMatcher(None,norm(target),norm(c),autojunk=False).ratio(),parent,q['id']) for _,parent,q,c in sorted(rank,key=lambda x:x[0],reverse=True)[:15]],reverse=True)[:3]
     out[n]=dict(number=n,page=pi+1,box=box,numberBox=[w['x0']-1,w['top']-1,w['x1']+1,w['bottom']+1],prompt=t,promptHtml=m,choices=choices,matches=best)
  (OUT/(name+'-inventory.json')).write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
  print(name,len(out),flush=True)
if __name__=='__main__':main()
