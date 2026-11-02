import json,re,difflib,html
from extract import ROOT,lines
from prepare_english import strip
boxes={
'a':[[[3,400,1200]],[[7,210,1375]],[[11,325,1340],[12,150,1410],[13,150,365]],[[17,210,1315],[18,150,555]],[],[[25,270,1500],[26,150,1340],[27,150,840]],[[31,375,1435],[32,150,1170]]],
'b':[[[5,400,1290]],[[9,210,1490],[10,150,200]],[[13,380,1285],[14,150,550]],[[19,400,1420],[20,150,1190]],[[25,210,1500],[26,150,200]],[],[[33,210,1430],[34,150,660]]]
}
def normwords(s):return re.findall(r'[a-z0-9]+',s.lower())
for f in 'ab':
 d=json.loads((ROOT/f'form-{f}-english-working.json').read_text())
 report=[]
 for i,p in enumerate(d['passages']):
  if not boxes[f][i]:continue
  src=[]
  for pg,y0,y1 in boxes[f][i]:
   for l in lines(f,pg):
    if y0<=l['box'][1]<=y1:
     ws=[w for w in l['words'] if p['format']=='sentence_prose' or w['bbox']['x0']>=125]
     src.append(' '.join(w['text'] for w in ws))
  a=normwords(' '.join(src));b=normwords(p['text']);sm=difflib.SequenceMatcher(None,a,b,autojunk=False)
  changes=[]
  for op,a0,a1,b0,b1 in sm.get_opcodes():
   if op!='equal':changes.append({'source':' '.join(a[a0:a1]),'working':' '.join(b[b0:b1]),'context':' '.join(a[max(0,a0-5):a1+5])})
  report.append({'title':p['title'],'ratio':sm.ratio(),'differences':changes})
 (ROOT/f'{f}-passage-comparison.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
 print(f,json.dumps(report,ensure_ascii=False,indent=2))
