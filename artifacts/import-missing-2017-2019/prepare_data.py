"""One-batch source transcription using existing capture helpers; no application changes."""
import pathlib,json,re,html,copy,importlib.util,subprocess,hashlib
import pdfplumber
from PIL import Image
OUT=pathlib.Path(__file__).parent
ROOT=OUT.parent.parent
spec=importlib.util.spec_from_file_location('capture',ROOT/'artifacts/import-2023-2024/capture_exams.py')
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
STATE=json.loads((OUT/'editor-before.json').read_text(encoding='utf8'))
ASSETS=[]
def dump(name,value): (OUT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf8')
def load(name):return json.loads((OUT/name).read_text(encoding='utf8'))
def plain(s):return html.unescape(re.sub('<[^>]*>','',s))
def markup(t):return ''.join('<p>'+html.escape(p).replace('\n','<br>')+'</p>' for p in t.split('\n\n'))
def crop(source,page,box,name):
    folder=OUT/'assets';folder.mkdir(exist_ok=True);cache=OUT/'rendered';cache.mkdir(exist_ok=True)
    png=cache/f'{source.stem}-{page}.png'
    if not png.exists():subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-r','160','-singlefile','-png',str(source),str(png.with_suffix(''))],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    im=Image.open(png);scale=im.width/612;target=folder/(name+'.png');im.crop(tuple(round(v*scale) for v in box)).save(target)
    src='/exam-images/'+name+'-passage.png'
    ASSETS.append(dict(sourceFile=source.name,sourcePage=page,sourceBox=box,file=str(target.resolve()),passageId=name,url=src,sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
    return '<img src="'+src+'" width="'+str(round((box[2]-box[0])*96/72))+'" alt="'+html.escape(name.replace('-',' '))+'">'
def chars(page,box):return [c for c in page.chars if h.h.contained(c,box,.3)]
def block(pdf,part,numbered=False):
    n,y0,y1=part;cs=chars(pdf.pages[n-1],[45,y0,575,y1]);cs=[c for c in cs if not(numbered and c['size']<8 and c['text'].strip().isdigit())]
    return h.rich(cs,numbered=False)
def modern_passage(pdf,p):
    texts=[];marks=[];fmt=p.get('format','prose')
    for ix,part in enumerate(p['parts']):
        if fmt=='poem':
            n,y0,y1=part;cs=[c for c in chars(pdf.pages[n-1],[60,y0,575,y1]) if not(c['size']<8 and c['text'].strip().isdigit())];ls=h.h.lines_for(cs);tt=[];mm=[];prev=None;base=min(c['x0'] for c in cs)
            for line in ls:
                if prev is not None and line['top']-prev>20:tt.append('');mm.append('<div></div>')
                t,m=h.line_markup(line);indent=max(0,round((min(c['x0'] for c in line['chars'])-base)/3.65));tt.append(' '*indent+t);mm.append('<div data-poetry-line="true">'+'&nbsp;'*indent+m+'</div>');prev=line['top']
            t='\n'.join(tt);m=''.join(mm)
        else:t,m=block(pdf,part,True)
        if ix and fmt!='poem' and p.get('join'):
            first,sep,rest=t.partition('\n\n');texts[-1]+=' '+first;t=rest
            match=re.match('<p>(.*?)</p>(.*)',m,re.S)
            if match:marks[-1]=marks[-1][:-4]+' '+match[1]+'</p>';m=match[2]
        texts.append(t);marks.append(m)
    text=('\n' if fmt=='poem' else '\n\n').join(t for t in texts if t);rich=''.join(marks)
    for term,definition in p.get('glossary',{}).items():
        token=html.escape(term);assert token in rich,(p['title'],term)
        rich=rich.replace(token,'<span data-glossary-definition="'+html.escape(definition,quote=True)+'" role="link" tabindex="0">'+token+'</span>',1)
    if p.get('context'):ct,cm=block(pdf,p['context']);text=ct+'\n\n'+text;rich='<p data-numbered="false">'+cm.removeprefix('<p>').removesuffix('</p>')+'</p>'+rich
    return text,rich
def old_reading(pdf,n):
    # Source line numbers remain accessible at the original words using supported sup markup.
    texts=[];marks=[]
    for left,right in [(45,310),(315,575)]:
        cs=chars(pdf.pages[n-1],[left,180 if n in [9,10] else 50,right,725]);ls=h.h.lines_for(cs);para=[];ps=[];prev=None
        for line in ls:
            body=[c for c in line['chars'] if c['size']>8];labels=[c for c in line['chars'] if c['size']<=8 and c['text'].strip().isdigit()]
            if not body:continue
            line=dict(line,chars=body);t,m=h.line_markup(line)
            if prev is not None and line['top']-prev>18:ps.append(para);para=[]
            if labels:m='<sup>'+''.join(c['text'] for c in sorted(labels,key=lambda c:c['x0']))+'</sup> '+m
            para.append((t,m));prev=line['top']
        if para:ps.append(para)
        t=[' '.join(a for a,b in group) for group in ps];m=[' '.join(b for a,b in group) for group in ps]
        if texts and n!=9:texts[-1]+=' '+t.pop(0);marks[-1]+=' '+m.pop(0)
        texts.extend(t);marks.extend(m)
    # Margin line numbers are source references, not invented paragraph numbers.
    return '\n\n'.join(texts),''.join('<p data-numbered="false">'+m+'</p>' for m in marks)
PROFILES={
'20172018_form_a':[
 dict(title='Unlock, Ride, Return',format='sentence_prose',qs=[7,14],parts=[(4,190,580)]),
 dict(title='Pursuing a Hobby',format='sentence_prose',qs=[15,20],parts=[(7,88,448)]),
 *[dict(title=f'Reading Passage {i+1}',old=pg,qs=qs) for i,(pg,qs) in enumerate([(9,[21,27]),(12,[28,33]),(14,[34,39]),(16,[40,45]),(18,[46,51]),(20,[52,57])])]],
'20172018_form_b':[
 dict(title='The Local Library',format='sentence_prose',qs=[6,13],parts=[(4,191,587)]),
 dict(title='Moving Through Mountains',format='sentence_prose',qs=[14,20],parts=[(7,88,448)]),
 *[dict(title=f'Reading Passage {i+1}',old=pg,qs=qs) for i,(pg,qs) in enumerate([(10,[21,26]),(12,[27,33]),(14,[34,39]),(17,[40,45]),(19,[46,51]),(21,[52,57])])]],
'20192020_form_b':[
 dict(title='Martial Arts for the Mind and Body',format='sentence_prose',qs=[4,9],parts=[(3,198,610)]),
 dict(title='The Best Laid Plans of Ravens',qs=[10,17],parts=[(7,99,655)]),
 dict(title='Looking for the Smallest Spark of Everything',format='poem',qs=[18,26],parts=[(11,149,708),(12,59,124)],blurb=(11,66,105)),
 dict(title='Excerpt from “The Spirit of the Herd”',author='Dallas Lore Sharp',literary=True,qs=[27,34],parts=[(15,190,677),(16,57,544)],blurb=(15,66,118),notes=[(16,567,581)],glossary={'tablelands':'plateaus, flat areas of land sharply elevated from the surrounding area','tapaderos':'leather covers for stirrups'}),
 dict(title='A Memory Revolution',qs=[35,42],parts=[(21,98,703),(22,56,276)],join=True,figure=(22,[126,288,525,485])),
 dict(title='Serpent Mound',format='poem',qs=[43,50],parts=[(25,162,696)],blurb=(25,67,94),context=(25,137,150)),
 dict(title='Massachusetts: Lowell National Historical Park',qs=[51,57],parts=[(29,99,629),(30,58,226)],join=True,notes=[(30,250,262)],glossary={'Yankee':'native to New England','Niagara':'a town in northwestern New York State well known as the location of Niagara Falls, a series of waterfalls on the Canadian border','domestic work':'household duties like cooking and cleaning'})]}
def main():
 for key,profiles in PROFILES.items():
    form=key[-1];year='2017-2018' if key.startswith('2017') else '2019-2020';label=f'{year} Form {form.upper()}';qs=load(key+'-questions.json');keys=load(key+'-keys.json');source=OUT/(key+'.pdf');questions=[]
    base=load('../import-2018-2019/form-'+form+'-import.json') if year=='2017-2018' else load('../import-2023-2024/form-b-import.json')
    math={int(q['review']['sourceQuestion']):q for q in base['mathQuestions']}
    for n in range(1,115):
        raw=qs[str(n)]
        if n>=58 and not(year=='2019-2020' and n in [63,67,79,81,83,94,104,105]):q=copy.deepcopy(math[n]);q['visuals']=[]
        else:q={f:raw[f] for f in ['prompt','promptHtml','choices']};q['type']='multiple_choice';q['topic']='';q['points']=1;q['explanation']='';q['visuals']=[]
        q['id']=f'pdf-shsat-{year}-{form}-q{n:03}';original=[c['id'] for c in raw['choices']];assert len(original)==(0 if 58<=n<=62 else 4),(key,n,original)
        for i,c in enumerate(q.get('choices',[])):c['id']='ABCD'[i]
        q['review']={'sourceFile':source.name,'sourcePages':[raw['page']],'sourceQuestion':str(n),'sourceChoiceIds':original,'expectedChoiceCount':len(original),'answerSource':{'sourceFile':key+'_-_answers.pdf','sourcePages':[17 if key.endswith('a') else 16 if year=='2017-2018' else 34]},'topicSource':'inferred' if q.get('topic') else 'unknown','topicConfidence':.8 if q.get('topic') else None,'sourceReviewed':False,'completenessReviewed':False,'classificationReviewed':False,'difficulty':'','difficultySource':'unknown','warnings':[]}
        if n>=58 and n<=62:q['correctTextAnswers']=[keys[str(n)]]
        else:q['correctChoiceId']='ABCD'[original.index(keys[str(n)])]
        # Boxed standalone source material uses the existing supporting-text field.
        if n<= (6 if key.endswith('a') else 5 if year=='2017-2018' else 3):
            match=re.search(r'<blockquote data-boxed="true">(.*?)</blockquote>',q['promptHtml'],re.S)
            if match:
                q['stimulusHtml']='<p>'+match[1]+'</p>';q['stimulus']=plain(match[1]);q['promptHtml']=q['promptHtml'].replace(match[0],'');q['prompt']=plain(q['promptHtml'].replace('</p><p>','\n\n'))
        questions.append(q)
    passages=[]
    with pdfplumber.open(source) as pdf:
        for p in profiles:
            fmt=p.get('format','prose');text,rich=old_reading(pdf,p['old']) if p.get('old') else modern_passage(pdf,p)
            if p.get('figure'):
                pn,b=p['figure'];rich+='<p data-numbered="false">'+crop(source,pn,b,year+'-'+form+'-memory-figure')+'</p>'
            blurb,bh=block(pdf,p['blurb']) if p.get('blurb') else ('','');notes=[block(pdf,t) for t in p.get('notes',[])]
            note='The source reading passage is untitled. A neutral library title identifies it. Printed line references are retained as superscript markers at their original words.' if p.get('old') else ''
            passage=dict(title=p['title'],titleHtml=html.escape(p['title']),author=p.get('author',''),byline='by '+p['author'] if p.get('author') else '',blurb=blurb,blurbHtml=bh,format=fmt,passageType='poem' if fmt=='poem' else 'literary' if p.get('literary') else 'informational',passageCategory='official_handbook',section='revising_editing_a' if fmt=='sentence_prose' else 'reading',label=label,versionLabel=label,text=text,richText=rich,sourceNote='\n'.join(t for t,m in notes),sourceNoteHtml=''.join(m for t,m in notes),teacherSource=note,questions=questions[p['qs'][0]-1:p['qs'][1]],visuals=[],review={'sourceFile':source.name,'sourcePages':[p['old']] if p.get('old') else sorted(set(x[0] for x in p['parts'])),'expectedQuestionCount':p['qs'][1]-p['qs'][0]+1,'sourceReviewed':False,'completenessReviewed':False,'warnings':[]})
            passages.append(passage)
    standalone=questions[:6 if key.endswith('a') else 5 if year=='2017-2018' else 3]
    # The teacher's established order is reading, revising/editing, standalone.
    passages.sort(key=lambda p:p['section']!='reading')
    result={'format':'nathan-tutors-official-passage-v1','source':{'sourceFamily':'official_shsat','sourceFormat':'pdf','playerProfile':'testnav','sourceId':f'official-shsat-{year}-form-{form}','label':label,'year':year,'form':form.upper(),'url':'https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/'+source.name},'passages':passages,'englishQuestions':standalone,'mathQuestions':questions[57:],'review':{'sourceFile':source.name,'expectedQuestionCount':57,'sourceReviewed':False,'completenessReviewed':False},'batch':{'sourceId':'','jobId':'','sourceLabel':label,'section':'math','requestedScope':'Complete mathematics section, source questions 58–114','expectedQuestions':list(map(str,range(58,115))),'expectedTotal':57,'inventoryConfirmed':True,'chunkId':key+'-complete','completedQuestions':list(map(str,range(58,115))),'unresolvedQuestions':[],'nextScope':''}}
    dump(key+'-working.json',result)
    print(key,len(passages),'passages',sum(len(p['questions']) for p in passages)+len(standalone),'English',len(result['mathQuestions']),'Math')
 dump('assets.json',ASSETS)
if __name__=='__main__':main()

