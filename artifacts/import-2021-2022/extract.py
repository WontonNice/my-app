"""Source-only OCR inventory. Output remains a review aid, never a formatter/importer."""
import pathlib,json,re,difflib,html
ROOT=pathlib.Path(__file__).parent
state=json.loads((ROOT/'editor-before.json').read_text())
def load(key,p):return json.loads((ROOT/key/f'{p}.json').read_text())
def lines(key,p,col=None):
 out=[]
 for b in load(key,p)['blocks']:
  for para in b['paragraphs']:
   for ln in para['lines']:
    ws=[w for w in ln['words'] if col is None or (w['bbox']['x0']<630)==(col==0)]
    if not ws:continue
    x0=min(w['bbox']['x0'] for w in ws);x1=max(w['bbox']['x1'] for w in ws)
    y0=min(w['bbox']['y0'] for w in ws);y1=max(w['bbox']['y1'] for w in ws)
    if y0>1530:continue
    out.append(dict(text=' '.join(w['text'] for w in ws),box=[x0,y0,x1,y1],words=ws))
 return sorted(out,key=lambda l:l['box'][1])
def plain(ls):return ' '.join(l['text'] for l in ls).strip()
def norm(s):
 s=html.unescape(re.sub('<[^>]+>','',s)).lower()
 s=re.sub(r'\\(?:frac|overline|left|right|text|mathrm|times|cdot)','',s)
 return re.sub(r'[^a-z0-9]','',s)
def score(a,b):return difflib.SequenceMatcher(None,norm(a),norm(b),autojunk=False).ratio()
allq=[(p['id'],q) for p in state['passages'] for q in p['questions']]+[('standalone',q) for q in state['standaloneItems']]+[(m['fileName'],q) for m in state['mathSections'] for q in m['questions']]
def matches(q):
 a=q['prompt']+' '+q.get('stimulus','')+' '+' '.join(c['text'] for c in q['choices'])
 # Coarse word-overlap filter before precise edit-distance comparison.
 tokens=set(re.findall('[a-z]{3,}',a.lower()))
 candidates=[]
 for parent,c in allq:
  b=c['prompt']+' '+c.get('stimulus','')+' '+' '.join(x.get('text','') for x in c.get('choices',[]))
  ts=set(re.findall('[a-z]{3,}',b.lower()));coarse=len(tokens&ts)/max(1,len(tokens|ts))
  candidates.append((coarse,parent,c,b))
 ranked=sorted(candidates,key=lambda v:v[0],reverse=True)[:12]
 ranked=sorted([(score(a,b),parent,c) for _,parent,c,b in ranked],key=lambda v:v[0],reverse=True)[:3]
 return [dict(score=round(v,4),parent=parent,id=c['id']) for v,parent,c in ranked]
def question_regions(key,maxpage):
 regs={}
 for p in range(1,maxpage+1):
  math=(p>=38 if key=='a' else p>=40)
  for col in ([0,1] if math else [None]):
   ls=lines(key,p,col)
   starts=[]
   for i,l in enumerate(ls):
    m=re.match(r'^(\d{1,3})[.,](?:\s|$)',l['text'])
    if m and 1<=int(m[1])<=114 and (l['box'][0]<125 or math and 635<l['box'][0]<710):starts.append((int(m[1]),i))
   for j,(n,i) in enumerate(starts):
    end=starts[j+1][1] if j+1<len(starts) else len(ls)
    regs[n]=dict(page=p,col=col,lines=ls[i:end],box=[85 if col!=1 else 660,ls[i]['box'][1]-8,1190 if col!=0 else 610,ls[end]['box'][1]-15 if end<len(ls) else 1510])
 return regs
def questions(key,maxpage):
 regs=question_regions(key,maxpage);out={}
 for n,reg in sorted(regs.items()):
  ls=reg['lines'];groups=[];current=[];label=None
  for i,l in enumerate(ls):
   l=dict(l);t=l['text']
   if i==0:t=re.sub(r'^\d+[.,]\s*','',t)
   m=re.match(r'^([A-Hc])c?[.,](?:\s+(.*)|$)',t)
   if m and (125<l['box'][0]<160 or 680<l['box'][0]<740):
    groups.append((label,current));label=m[1].upper();current=[];t=m[2] or ''
   l['text']=t;current.append(l)
  groups.append((label,current))
  choices=[dict(id=label,text=plain(ls),lines=ls) for label,ls in groups if label]
  q=dict(number=n,page=reg['page'],box=reg['box'],prompt=plain(groups[0][1]),promptLines=groups[0][1],choices=choices)
  q['matches']=matches(q);out[n]=q
 return out
if __name__=='__main__':
 for key,count in [('a',53),('b',54)]:
  qs=questions(key,count)
  (ROOT/(key+'-extracted.json')).write_text(json.dumps(qs,ensure_ascii=False,indent=2),encoding='utf8')
  (ROOT/(key+'-matches.txt')).write_text('\n'.join(str(n)+' '+str(q['matches'][:1])+'\n'+q['prompt']+'\n'+' | '.join(c['id']+': '+c['text'] for c in q['choices']) for n,q in qs.items()),encoding='utf8')
  print(key,len(qs),'missing',set(range(1,115))-set(qs),'choice errors',[(n,len(q['choices'])) for n,q in qs.items() if len(q['choices'])!=(0 if 58<=n<=62 else 4)])
