import json,re,html,hashlib,copy
from PIL import Image
from prepare_english import ROOT,key,strip,p
from math_b_reviewed import table

def read(name):return json.loads((ROOT/name).read_text(encoding='utf8'))
def write(name,data):(ROOT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
def crop(form,n,page,box,width=None,suffix='figure'):
 name=f'pdf-2021-2022-{form}-q{n:03}-{suffix}.png';im=Image.open(ROOT/form/f'page-{page:02}.png').crop(box);im.save(ROOT/'assets'/name)
 return f'<p><img src="/exam-images/{name}" width="{width or round(im.width*96/150)}" alt="Source diagram for question {n}"></p>'
def number_latex(s):
 # Batch-only annotation of source-verified numeric tokens. Existing LaTeX is retained.
 def chunk(v):
  return re.sub(r'\$?\d[\d,]*(?:\.\d+)?(?:%|:\d+)?',lambda m:r'\('+m[0].replace('$',r'\$').replace('%',r'\%').replace(',',r'{,}').replace(':',r'{:}')+r'\)',v)
 return ''.join(v if i%2 else chunk(v) for i,v in enumerate(re.split(r'(\\\(.*?\\\)|\\\[.*?\\\])',s,flags=re.S)))

a=read('math-a-existing.json');ext=read('a-extracted.json')
emphasis={62:['product'],68:['at least'],69:['excluding'],73:['not'],76:['not'],78:['not'],86:['feet per second'],95:['additional'],97:['neither'],98:['odd'],99:['not'],102:['greatest'],103:['overall'],104:['greatest'],109:['profit']}
for q in a:
 n=int(q['id'].split('q')[-1]);body=q['prompt']
 if n==58:body=body.replace('PQRS',r'\(\mathrm{PQRS}\)')
 if n==69:body=body.replace('MNPQ',r'\(\mathrm{MNPQ}\)').replace(r'\overline{RS}',r'\overline{\mathrm{RS}}')
 if n==93:body=body.replace(r'LN=',r'\mathrm{LN}=').replace('point L',r'point \(\mathrm{L}\)').replace('point N',r'point \(\mathrm{N}\)').replace('Point M',r'Point \(\mathrm{M}\)').replace('for M',r'for \(\mathrm{M}\)')
 if n==101:body=r'On the number line above, points \(\mathrm{W},\mathrm{X},\mathrm{Y},\) and \(\mathrm{Z}\) are integers, and \(\mathrm{WX}{:}\mathrm{XY}{:}\mathrm{YZ}=4{:}2{:}3\). What is the value of \(\mathrm{WY}\)?'
 if n==111:
  for v in ['JK','JM','LM']:body=body.replace(v+'=',r'\mathrm{'+v+'}=')
  body=body.replace('point L',r'point \(\mathrm{L}\)')
 if n==104:
  for v in ['M','N','P','Q','R']:body=re.sub(r'\b'+v+r'\b',lambda m:r'\(\mathrm{'+v+r'}\)',body)
 body=number_latex(body)
 # Complete equalities remain a single expression.
 if n==74:body=body.replace(r'\(1\) dollar = \(7\) lorgs',r'\(1\text{ dollar}=7\text{ lorgs}\)').replace(r'\(1\) dollar = \(0.5\) dalt',r'\(1\text{ dollar}=0.5\text{ dalt}\)')
 if n==79:
  for x,u,y,v in [('1','sind','4','lorgs'),('2','plunks','5','dalts'),('5','sinds','2','harps'),('1','plunk','3','harps')]:body=body.replace(r'\('+x+r'\) '+u+' = '+r'\('+y+r'\) '+v,r'\('+x+r'\text{ '+u+'}='+y+r'\text{ '+v+r'}\)')
 if n==86:body=body.replace(r'\(1\) mile = \(5{,}280\) feet',r'\(1\text{ mile}=5{,}280\text{ feet}\)')
 if n==110:body=body.replace(r'\(2.54\) centimeters = \(1\) inch',r'\(2.54\text{ centimeters}=1\text{ inch}\)')
 rendered=p(body)
 if n in [100,105]:rendered=re.sub(r'^<p>\\\[([\s\S]*?)\\\]</p>',lambda m:'<p data-align="center">'+r'\(\displaystyle '+m[1]+r'\)</p>',rendered)
 if n==61:
  chunks=body.split('\n\n');rendered='<p>'+chunks[0]+'</p><ul>'+''.join('<li>'+v.removeprefix('• ')+'</li>' for v in chunks[1].splitlines())+'</ul><p>'+chunks[2]+'</p>'
 for word in emphasis.get(n,[]):rendered=re.sub(r'\b'+word+r'\b','<strong>'+word+'</strong>',rendered)
 q['prompt']=body;q['promptHtml']=rendered
 for c in q.get('choices',[]):
  if c.get('math') or c.get('html','').find('<img')>=0:continue
  text=c['text']
  if re.fullmatch(r'\$?[\d,.]+%?',text):c['math']=text.replace('$',r'\$').replace('%',r'\%').replace(',',r'{,}');c.pop('html',None)
  else:c['html']=number_latex(html.escape(text))
 for k in ['importNeedsEditing','importNotes','importSource']:q.pop(k,None)
 q['review']={'sourceFile':'20212022_form_a.pdf','sourcePages':[ext[str(n)]['page']],'sourceQuestion':str(n),'sourceChoiceIds':list('ABCD' if n%2 else 'EFGH') if n>=63 else [],'sourceReviewed':False,'completenessReviewed':False,'classificationReviewed':False,'topicSource':'teacher','difficulty':'','warnings':[]}
 if n<63:q['correctTextAnswers']=[key('a')[n]]
 else:q['correctChoiceId']='ABCD'['ABCDEFGH'.index(key('a')[n])%4]

qa={int(q['id'].split('q')[-1]):q for q in a}
for n,page,box in [(58,38,(165,490,595,750)),(69,41,(700,225,1160,595)),(75,43,(220,205,545,540)),(81,44,(700,225,1160,850)),(93,47,(785,240,1115,335)),(101,49,(740,850,1155,930)),(104,50,(650,230,1115,665)),(111,52,(175,630,590,755))]:qa[n]['promptHtml']=crop('a',n,page,box)+qa[n]['promptHtml']
for i,y in enumerate([278,368,458,548]):qa[71]['choices'][i]['html']=crop('a',71,42,(190,y,570,y+62),250,'choice-'+'ABCD'[i])
tables={
68:('PEOPLE PER VEHICLE AT CHECKPOINT',['Number of People in Vehicle','Percent of Vehicles'],[['1','40%'],['2','35%'],['3','15%'],['4','7%'],['5 or more','3%']]),
84:('SCORES ON MATH QUIZ',['Score','Number of Students'],[['85','4'],['75','4'],['65','2']]),
103:('SCORES ON BIOLOGY TEST',['Section','Lowest Score','Range'],[['I','65','28'],['II','62','25'],['III','67','22']]),
113:('SERVINGS OF FRUITS AND VEGETABLES',['Number of Servings of Fruits and Vegetables','Number of Students'],[['0','5'],['1','7'],['2','3'],['3','4'],['4','0'],['5','1']])}
for n,(title,headers,rows) in tables.items():qa[n]['promptHtml']=table(title,headers,[[number_latex(v) for v in row] for row in rows]).replace('<p>'+title+'</p><table>','<table><caption data-align="center">'+title+'</caption>')+qa[n]['promptHtml']
write('math-a-working.json',a)

for form in 'ab':
 d=read(f'form-{form}-english-working.json');qs={int(q['review']['sourceQuestion']):q for pa in d['passages'] for q in pa['questions']};qs.update({int(q['review']['sourceQuestion']):q for q in d['englishQuestions']})
 for n,q in qs.items():
  for field in ['promptHtml','stimulusHtml']:
   if field in q:q[field]=q[field].replace('&nbsp;',' ')
  if q['prompt'].startswith('Read') and n>4:
   if form=='a' and n==14:q['prompt']='Read this sentence from paragraph 4.\n\nIn both experiments, the ravens waited patiently for up to seventeen hours for the researcher to return.\n\nHow does this sentence fit into the overall structure of the passage and contribute to the development of ideas?'
   chunks=q['prompt'].split('\n\n')
   if len(chunks)==1:chunks=q['prompt'].split('\n')
   assert len(chunks)>=3,(form,n,chunks)
   middle='\n\n'.join(chunks[1:-1]);middle=html.escape(middle)
   if form=='b' and n==31:middle=middle.replace('11)\n','11)\n\n')
   if (form,n) not in [('a',34),('a',38)]:middle=re.sub(r'(?<!\n)\n(?!\n)',' ',middle)
   middle='<strong>'+middle+'</strong>'
   middle=re.sub(r'\s*(\((?:paragraph|lines?) [^)]*\))',r'</strong> \1<strong>',middle)
   middle=middle.replace('<strong></strong>','').replace('\n\n','<br><br>').replace('\n','<br>')
   q['promptHtml']='<p>'+html.escape(chunks[0])+'</p><blockquote>'+middle+'</blockquote><p>'+html.escape(chunks[-1])+'</p>'
  elif n>4:q['promptHtml']=p(q['prompt']) # no invented emphasis on best/most
  for c in q['choices']:
   c['html']=c.get('html',html.escape(c['text'])).replace('&nbsp;',' ')
   c['text']=re.sub(r'\s+',' ',strip(c['html'])).strip()
 if form=='a':
  for c,w in zip(qs[1]['choices'],['agile','first','only','States']):c['text']='Insert a comma after '+w+'.';c['html']='Insert a comma after <strong><em>'+w+'</em></strong>.'
  qs[2].update(instructions='Read this sentence.',stimulus='The engineers tried some other things in the hope of finding a more effective insulation for the compartment.',stimulusHtml='<p><u>The engineers tried some other things</u> in the hope of finding a more effective insulation for the compartment.</p>',prompt='What is the most precise revision for the words The engineers tried some other things?',promptHtml='<p>What is the most precise revision for the words <strong><em>The engineers tried some other things</em></strong>?</p>')
  for n in [51,53,54]:
   qs[n]['prompt']=re.sub(r'(\d+)-(\d+)',r'\1–\2',qs[n]['prompt']);qs[n]['promptHtml']=p(qs[n]['prompt'])
  qs[56]['choices'][0]['text']=qs[56]['choices'][0]['text'].rstrip(',')+'.';qs[56]['choices'][0]['html']=qs[56]['choices'][0]['text']
 else:
  qs[4]['stimulusHtml']=qs[4]['stimulusHtml'].replace('<u>wonder</u>:','<u>wonder:</u>')
  for c in qs[4]['choices']:
   c['html']=re.sub(r'to <strong><em>(.*?)</em></strong>',r'to <strong>\1</strong>',c['html'])
 for n,q in qs.items():
  if n<=4:
   q.setdefault('instructions','Read these sentences.' if form=='b' and n==1 else 'Read this paragraph.' if n>=3 or (form=='b' and n==2) else 'Read this sentence.')
   q['instructionsHtml']=p(q['instructions'])
 for pa in d['passages']:
  if form=='b' and pa['title'].startswith('Martial'):
   pa['richText']=pa['richText'].replace('higher ranks or levels','higher levels').replace('A martial arts class','A karate class')
  if form=='b' and 'First Flight' in pa['title']:
   for field in ['blurb','blurbHtml']:pa[field]=pa[field].replace('conducted experiments','conducted various experiments')
  pa['richText']=pa['richText'].replace('</span> —ah','</span>—ah')
  if form=='b' and pa['title']=='A Memory Revolution':
   crop('b',50,34,(180,695,1105,1090),500,'memory-diagram')
   pa['image']={'src':'/exam-images/pdf-2021-2022-b-q050-memory-diagram.png','alt':'How Memory Works: information passes through sensory, short-term, and long-term memory, with rehearsal, storage, and retrieval.','width':500}
  pa['text']=strip(pa['richText'])
  if pa['format']=='poem':pa['text']=html.unescape(re.sub('<[^>]+>','',pa['richText'].replace('</div>','\n').replace('</p>','\n\n'))).strip()
 d['mathQuestions']=read(f'math-{form}-working.json')
 explanations=read(form+'-explanations.json')
 allq=list(qs.values())+d['mathQuestions']
 for q in allq:
  n=q['review']['sourceQuestion'];e=explanations[n]
  q['explanation']=e['explanation'];q['explanationHtml']=e['explanationHtml']
  q['review']['answerSource']={'sourceFile':f'20212022_form_{form}_-_answers.pdf','sourcePages':[46 if form=='a' else 50]}
  q['review']['explanationSource']={'sourceFile':f'20212022_form_{form}_-_answers.pdf','sourcePages':e['sourcePages'],'regions':e['regions']}
  q['review']['warnings'].append({'code':'POSSIBLE_FORMATTING_LOSS','message':'Official explanation is preserved as a source image with original printed answer labels. Editable OCR text should be checked against that image.','state':'unresolved'})
 filename=f'20212022_form_{form}.pdf';source=__import__('pathlib').Path('C:/Users/Nathan Im/Downloads')/filename
 d['source'].update(sourceFile=filename,sha256=hashlib.sha256(source.read_bytes()).hexdigest())
 write(f'form-{form}-import.json',d)
 write(f'form-{form}-math.json',{'format':d['format'],'source':d['source'],'mathQuestions':d['mathQuestions']})
 print(form,len(d['passages']),'passages',len(qs),'English',len(d['mathQuestions']),'Math')
