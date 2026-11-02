import pathlib,json,re,html,copy,difflib
from html.parser import HTMLParser
from PIL import Image
import extract as ex
ROOT=ex.ROOT
state=ex.state
manifest=json.loads((ROOT/'source-manifest.json').read_text())
byid={p['id']:p for p in state['passages']}
qb={q['id']:q for p in state['passages'] for q in p['questions']}
qb.update({q['id']:q for q in state['standaloneItems']})
def strip(s):
 s=re.sub(r'<br\s*/?>','\n',s)
 s=re.sub(r'</(?:p|div|h[23])>','\n\n',s)
 return html.unescape(re.sub('<[^>]+>','',s)).strip()
def p(s):return ''.join('<p>'+html.escape(t).replace('\n','<br>')+'</p>' for t in s.split('\n\n'))
def key(form):return {i*13+j+1:v for i,col in enumerate(manifest['keyColumns'][form]) for j,v in enumerate(col.split())}
def cloneq(raw,n,form):
 out={k:copy.deepcopy(v) for k,v in raw.items() if k in ['type','points','prompt','promptHtml','promptParts','stimulus','stimulusHtml','instructions','instructionsHtml','choices','topic']}
 out.update(id=f'pdf-shsat-2021-2022-{form}-q{n:03}',type='multiple_choice',points=1)
 out['correctChoiceId']='ABCD'['ABCDEFGH'.index(key(form)[n])%4]
 out['choices']=[{k:v for k,v in c.items() if k in ['id','text','html','math','image']} for c in out['choices']]
 for i,c in enumerate(out['choices']):c['id']='ABCD'[i];c.setdefault('html',html.escape(c['text']))
 out.setdefault('promptHtml',p(out['prompt']))
 out.pop('promptParts',None)
 return out
def fromocr(raw):
 return {'prompt':raw['prompt'],'promptHtml':p(raw['prompt']),'choices':[{'id':'ABCD'[i],'text':c['text'],'html':html.escape(c['text'])} for i,c in enumerate(raw['choices'])]}
def paragraph_html(base,form,spec):
 r=base['richText'] or p(base['text'])
 # Remove authoring-only spans from already source-matched text; retain glossary.
 r=re.sub(r'<span(?![^>]*data-glossary-definition)[^>]*>','',r)
 # Paired spans require an HTML parser; no span unwrapping is applied below.
 r=base['richText'] or p(base['text'])
 r=re.sub(r'<p([^>]*)>\s*\d{1,2}\s+(?=[A-Za-z“‘.])',r'<p\1>',r)
 if base['format']=='prose':
  r=re.sub(r'<p(?:\s[^>]*)?>', '<p data-numbered="true">',r)
  # Source headline blocks remain h3 and do not advance the paragraph counter.
  r=re.sub(r'<p data-numbered="true">(<img[^>]+>)</p>',r'<p data-numbered="false">\1</p>',r)
 if 'lowell' in spec['base']:
  for term,meaning in [('Yankee','native to New England'),('Niagara','a town in northwestern New York State well known as the location of Niagara Falls, a series of waterfalls on the Canadian border'),('domestic work','household duties like cooking and cleaning')]:
   r=r.replace(term,'<span data-glossary-definition="'+html.escape(meaning,quote=True)+'" role="link" tabindex="0">'+term+'</span>',1)
 if 'spirit-of-the-herd' in spec['base']:
  for term,meaning in [('tablelands','plateaus, flat areas of land sharply elevated from the surrounding area'),('tapaderos','leather covers for stirrups')]:
   r=r.replace(term,'<span data-glossary-definition="'+html.escape(meaning,quote=True)+'" role="link" tabindex="0">'+term+'</span>',1)
 if 'first-flight' in spec['base']:
  r=re.sub(r'<span data-glossary-definition="[^"]+" role="link" tabindex="0">(“Richard” hand anemometer)</span>',r'\1',r)
 if base['format']=='poem':
  body=re.findall(r'<(?:p|div)[^>]*>(.*?)</(?:p|div)>',r,re.S)
  body=[v for v in body if strip(v).strip() and strip(v).strip()!='Ohio, 1846']
  assert len(body)==spec['verseLines'],(spec['base'],len(body))
  if 'serpent' in spec['base']:
   ls=[l for l in ex.lines(form,spec['pages'][0]) if 340<l['box'][1]<1465]
   assert len(ls)==41,len(ls)
   indents=[]
   for l in ls:
    ws=[w for w in l['words'] if w['bbox']['x0']>=125]
    indents.append(round((ws[0]['bbox']['x0']-128)/30)*3)
  else:indents=[0]*len(body)
  result=['<p data-numbered="false">Ohio, 1846</p>'] if 'serpent' in spec['base'] else []
  for i,v in enumerate(body):
   v=re.sub(r'^(?:\s|&nbsp;)+','',v)
   result.append('<div data-poetry-line="true">'+'&nbsp;'*indents[i]+v+'</div>')
   if i+1 in spec['stanzaBreaksAfter']:result.append('<div></div>')
  r=''.join(result)
 return r
def build():
 for form in 'ab':
  extracted=json.loads((ROOT/(form+'-extracted.json')).read_text())
  questions={}
  for n in range(1,58):
   raw=extracted[str(n)];best=raw['matches'][0]
   if best['score']>=.99:source=qb[best['id']]
   else:source=fromocr(raw)
   if len(source['choices'])!=4:
    # OCR C/F label confusion is corrected using the source-matched record;
    # all such cases are listed for visual review in comparison reports.
    source=qb[best['id']]
   q=cloneq(source,n,form)
   q['review']={'sourceFile':f'20212022_form_{form}.pdf','sourcePages':[raw['page']],'sourceQuestion':str(n),'sourceChoiceIds':list('ABCD' if n%2 else 'EFGH'),'answerSource':{'sourceFile':f'20212022_form_{form}_-_answers.pdf','sourcePages':[46 if form=='a' else 50]},'expectedChoiceCount':4,'sourceReviewed':False,'completenessReviewed':False,'classificationReviewed':False,'topicSource':'inferred' if q.get('topic') else 'unknown','topicConfidence':.8 if q.get('topic') else None,'difficulty':'','difficultySource':'unknown','warnings':[]}
   questions[n]=q
  ps=[]
  for spec in manifest['passages'][form]:
   base=byid[spec['base']]
   passage={k:copy.deepcopy(base.get(k,'')) for k in ['title','titleHtml','author','byline','blurb','blurbHtml','format','passageType','sourceNote','sourceNoteHtml','subtitle']}
   passage.update(passageCategory='official_handbook',section='revising_editing_a' if base['format']=='sentence_prose' else 'reading',versionLabel=f'2021-2022 Form {form.upper()}',label=f'2021-2022 Form {form.upper()}',preserveSourceLayout=True)
   passage['richText']=paragraph_html(base,form,spec)
   passage['text']=strip(passage['richText'])
   if passage['format']=='poem':
    passage['text']=html.unescape(re.sub('<[^>]+>','',passage['richText'].replace('</div>','\n').replace('</p>','\n\n'))).strip()
   passage['questions']=[questions[n] for n in range(spec['questions'][0],spec['questions'][1]+1)]
   passage['teacherSource']=f'Supplied 2021–2022 Form {form.upper()}; source PDF pages '+', '.join(map(str,spec['pages']))+'. Source-matched text and formatting audited separately; teacher review flags remain false.'
   passage['review']={'sourceFile':f'20212022_form_{form}.pdf','sourcePages':spec['pages'],'expectedQuestionCount':len(passage['questions']),'sourceReviewed':False,'completenessReviewed':False,'warnings':[]}
   ps.append(passage)
  out={'format':'nathan-tutors-official-passage-v1','source':{'sourceFamily':'official_shsat','sourceFormat':'pdf','playerProfile':'testnav','sourceId':f'official-shsat-2021-2022-form-{form}','label':f'2021-2022 Form {form.upper()}','year':'2021-2022','form':form.upper()},'passages':ps,'englishQuestions':[questions[n] for n in range(1,5)]}
  (ROOT/f'form-{form}-english-working.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
  print(form,'English prepared',sum(len(p['questions']) for p in ps)+4)
if __name__=='__main__':build()
