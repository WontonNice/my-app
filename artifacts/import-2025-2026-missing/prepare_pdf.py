import pathlib,json,re,copy,html,importlib.util
import pdfplumber
OUT=pathlib.Path(__file__).parent
spec=importlib.util.spec_from_file_location('inv',OUT/'pdf_inventory.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
state=h.state
def load(n):return json.loads((OUT/n).read_text(encoding='utf8'))
def dump(n,d):(OUT/n).write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
def review(name,n,page):return dict(sourceFile=name+'.pdf',sourceQuestion=str(n),sourcePages=[page],sourceReviewed=False,classificationReviewed=False,completenessReviewed=False,answerSource=dict(sourceFile=name+'_-_answers.pdf',sourcePages=[49 if name=='20202021_form_a' else 52 if name=='20202021_form_b' else 65]))
def question(name,n):
 r=load(name+'-inventory.json')[str(n)];q={k:r[k] for k in ['prompt','promptHtml','choices']};q.update(id=name.replace('_','-')+f'-q{n:03}',type='multiple_choice',points=1,explanation='',topic='',review=review(name,n,r['page']))
 q['correctChoiceId']=load(name+'-keys.json')[str(n)]
 # These underlines are visible source rules which the older PDF stores as curves.
 if name=='20202021_form_b' and n in [1,3]:
  terms=['continents, at','surface. Additionally,','Panthalassa, much','crust. In fact,'] if n==1 else ['Rome,','Italy','World,','built']
  for term in terms:q['promptHtml']=q['promptHtml'].replace(term,'<u>'+term+'</u>',1)
 return q
for name,nums,title,start in [('20202021_form_a',[1,5],'Find Time to Volunteer',6),('20202021_form_b',[1,2,3,4],'The Free College Debate',5),('20242025_form_a',[1,2,3,4],None,0)]:
 year='2020-2021' if name.startswith('2020') else '2024-2025';form=name[-1];label=f'{year} Form {form.upper()}';source=dict(sourceFamily='official_shsat',sourceFormat='pdf',playerProfile='testnav',label=label,year=year,form=form.upper(),url='https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/'+name+'.pdf')
 d=dict(format='nathan-tutors-official-passage-v1',source=source,englishQuestions=[question(name,n) for n in nums],passages=[],mathQuestions=[])
 if title:
  with pdfplumber.open(OUT/(name+'.pdf')) as pdf:
   cs=[c for c in h.h.chars_in(pdf.pages[4],[45,190,570,606 if form=='a' else 635]) if not(c['size']<8 and c['text'].isdigit())];text,rich=h.h.rich(cs)
   if form=='a':rich=rich.replace('Mayo Clinic','<span data-glossary-definition="a nonprofit medical organization dedicated to treatment and research" role="link" tabindex="0">Mayo Clinic</span>',1)
  p=dict(title=title,author='',format='sentence_prose',passageType='informational',passageCategory='official_handbook',section='revising_editing_a',label=label,versionLabel=label,text=text,richText=rich,questions=[question(name,n) for n in range(start,start+5)],review=dict(sourceFile=name+'.pdf',sourcePages=[5,6,7],expectedQuestionCount=5,sourceReviewed=False,completenessReviewed=False))
  d['passages']=[p]
 if name=='20202021_form_a':
  template=next(m for m in state['mathSections'] if m['fileName']=='2024-2025-form-aMath.ts');keys=load(name+'-keys.json');inv=load(name+'-inventory.json')
  for old in template['questions']:
   q=copy.deepcopy(old);n=int(re.search(r'q(\d+)$',q['id'])[1]);q['id']=f'pdf-shsat-2020-2021-a-q{n:03}';q['explanation']='';q.pop('explanationHtml',None);q.pop('importSource',None);q.pop('importNotes',None);q.pop('importNeedsEditing',None);q['review']=review(name,n,inv[str(n)]['page']);q['review']['sourceChoiceIds']=[c['id'] for c in inv[str(n)]['choices']]
   if n>=63:q['correctChoiceId']='ABCD'['EFGH'.index(keys[str(n)])] if keys[str(n)] in 'EFGH' else keys[str(n)]
   else:q['correctTextAnswers']=[keys[str(n)]]
   if n==86:q['choices'][2]['numberLine']['endClosed']=True;q['choices'][2]['text']='Closed circle at 3; ray to the right.'
   if n==92:q['prompt']='Evaluate:\n\\[\\left|(-8)-12+(-17)-(-31)\\right|-|24|\\]';q.pop('promptHtml',None)
   if 'promptHtml' not in q:q['promptHtml']=''.join('<p>'+html.escape(t)+'</p>' for t in q['prompt'].split('\n') if t)
   for c in q.get('choices',[]):
    if 'math' in c:c['html']='\\('+c['math']+'\\)'
    elif 'html' not in c:c['html']=html.escape(c['text'])
   d['mathQuestions'].append(q)
  d['review']=dict(expectedQuestionCount=57,sourceReviewed=False,completenessReviewed=False)
 dump(name+'-prepared.json',d)
 print(name,len(d['mathQuestions']),len(d['englishQuestions']),len(d['passages']))
