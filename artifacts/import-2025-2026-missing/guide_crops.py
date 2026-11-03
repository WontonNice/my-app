import pathlib,json,subprocess
import pdfplumber
from PIL import Image,ImageChops
R=pathlib.Path(__file__).parent; D=R/'guide-crops';D.mkdir(exist_ok=True); manifest={}
scopes={'20202021_form_a_-_answers':list(range(1,11))+list(range(58,115)),'20202021_form_b_-_answers':list(range(1,10)),'20242025_form_a_-_answers':list(range(1,5)),'20252026_form_a_-_math_answers':[84,96,97,98,100,101,102,103,104,105,107,108,109,110,111,112,113],'20252026_form_b_-_math_answers':[60]+list(range(63,115))}
for name,wanted in scopes.items():
 starts=json.loads((R/(name+'-starts.json')).read_text());starts=[s for s in starts if (s['x']<60 or (name.startswith('2020') and s['n']>=58))]
 if name=='20202021_form_a_-_answers':starts.append(dict(n=60,page=31,x=351,top=132))
 if name.startswith('20242025'):starts.extend([dict(n=1,page=1,x=48,top=190),dict(n=2,page=1,x=48,top=403)])
 starts={s['n']:s for s in starts};pdf=pdfplumber.open(R/(name+'.pdf'));rendered={}
 for n in wanted:
  s=starts[n];nxt=starts.get(n+1);multi=name=='20202021_form_a_-_answers' and n>=58;col=1 if multi and s['x']>200 else 0
  endpage=nxt['page'] if nxt else s['page'];endcol=1 if multi and nxt and nxt['x']>200 else 0
  chunks=[];pages=[]
  for pn in range(s['page'],endpage+1):
   page=pdf.pages[pn-1];w,h=page.width,page.height
   if pn not in rendered:
    pref=D/(name+f'-page{pn}');subprocess.run(['pdftoppm','-f',str(pn),'-l',str(pn),'-r','144','-singlefile','-png',str(R/(name+'.pdf')),str(pref)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);rendered[pn]=Image.open(str(pref)+'.png').convert('RGB')
   im=rendered[pn];sx,sy=im.width/w,im.height/h
   for c in range(2 if multi else 1):
    if pn==s['page'] and c<col:continue
    if nxt and pn==endpage and c>endcol:continue
    top=s['top']-4 if pn==s['page'] and c==col else (64 if multi else 50)
    bottom=nxt['top']-10 if nxt and pn==endpage and c==endcol else h-40
    if bottom<=top+2:continue
    rightstarts=[v['x'] for v in starts.values() if v['page']==pn and v['x']>200];split=min(rightstarts)-18 if rightstarts else 315
    left=(split+3 if c else 42) if multi else 42;right=(w-39 if c else split-3) if multi else w-42
    crop=im.crop((int(left*sx),int(top*sy),int(right*sx),int(bottom*sy)))
    box=ImageChops.difference(crop,Image.new('RGB',crop.size,'white')).point(lambda x:255 if x>45 else 0).getbbox()
    if not box:continue
    crop=crop.crop((max(0,box[0]-5),max(0,box[1]-5),min(crop.width,box[2]+5),min(crop.height,box[3]+5)));file=D/(name+f'-q{n}-{len(chunks)+1}.png');crop.save(file);chunks.append(str(file.relative_to(R)));pages.append(pn)
  manifest[name+':'+str(n)]={'files':chunks,'pages':sorted(set(pages))}
 print(name,len(wanted),flush=True)
(R/'guide-crops.json').write_text(json.dumps(manifest,indent=2))
