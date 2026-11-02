import json,re,pathlib,hashlib
from PIL import Image
import extract as ex
from prepare_english import key
ROOT=ex.ROOT
def extract(form):
 name=form+'-answers';count=46 if form=='a' else 50;mathstart=31 if form=='a' else 39
 out={};current=None
 for page in range(1,count+1):
  if form=='a' and page==46:continue
  for col in ([0,1] if page>=mathstart else [None]):
   for ln in ex.lines(name,page,col):
    text=ln['text'];box=ln['box']
    if form=='b' and page==50 and box[1]>800:continue
    m=re.match(r'^(\d{1,3})\.\s+(?:The question|\(|B\))',text)
    if m and (box[0]<130 or col==1 and 630<box[0]<720):
     current=int(m[1]);out.setdefault(current,[])
    if current is None:continue
    if re.match(r'REVISING|READING COMPREHENSION|SAMPLE TEST|OF CORRECT|Form[abAB ]|FORM',text) or (page<mathstart and (text in ['Cracking the Code','The Best Laid Plans of Ravens','Ode to Fireworks','Massachusetts: Lowell National Historical Park','Martial Arts for the Mind and Body','Wolves of the Sea','A Miracle Mile','Serpent Mound','A Memory Revolution'] or text.startswith('Excerpt from '))):
     continue
    out[current].append(dict(page=page,col=col,**ln))
 assert set(out)==set(range(1,115)),set(range(1,115))-set(out)
 assets=[];results={}
 folder=ROOT/'assets';folder.mkdir(exist_ok=True)
 for n,ls in out.items():
  text='\n'.join(l['text'] for l in ls)
  if n<58:
   correct=re.findall(r'\b([A-H])c?[.,]\s*CORRECT\.',text)
  else:
   correct=re.findall(r'^\d+\.\s*\(([^)]+)\)',text)
  if correct!=[key(form)[n]]:print('KEY CHECK',form,n,correct,'expected',key(form)[n])
  groups={}
  for ln in ls:groups.setdefault((ln['page'],ln['col']),[]).append(ln)
  imgs=[];regions=[]
  for i,((page,col),part) in enumerate(groups.items()):
   # Tight text bounds retain equations/figures between source text lines.
   b=[min(l['box'][0] for l in part)-5,min(l['box'][1] for l in part)-5,max(l['box'][2] for l in part)+5,max(l['box'][3] for l in part)+5]
   image=Image.open(ROOT/name/f'page-{page:02}.png')
   file=f'pdf-2021-2022-{form}-q{n:03}-explanation-{i+1}.png';dest=folder/file
   image.crop(b).save(dest)
   width=round((b[2]-b[0])*96/150)
   imgs.append(f'<p><img src="/exam-images/{file}" width="{width}" alt="Official explanation for source question {n}; original printed answer labels retained."></p>')
   regions.append({'page':page,'box':b})
   assets.append({'file':str(dest),'sourceFile':f'20212022_form_{form}_-_answers.pdf','sourcePage':page,'box':b,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()})
  results[n]={'explanation':re.sub(r'^\d+\.\s*','',text),'explanationHtml':''.join(imgs),'sourcePages':sorted(set(l['page'] for l in ls)),'regions':regions}
 (ROOT/f'{form}-explanations.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
 (ROOT/f'{form}-explanation-assets.json').write_text(json.dumps(assets,indent=2),encoding='utf8')
 print(form,len(results),'explanations',len(assets),'source crops')
for form in 'ab':extract(form)
