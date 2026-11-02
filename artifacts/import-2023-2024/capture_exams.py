"""Source-specific capture for the two supplied 2023 SHSAT PDFs.
Uses the repository's coordinate/font helpers; never reuses its 2024 profile.
"""
import collections, hashlib, html, importlib.util, json, pathlib, re, shutil, subprocess
from PIL import Image
import pdfplumber
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=pathlib.Path(__file__).parent
spec=importlib.util.spec_from_file_location('pdf_adapter',ROOT/'tools/pdf-source-import.py')
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)

PROFILES={
'a':[
 dict(title='The Benefits of Indoor Plants',format='sentence_prose',qs=[5,9],parts=[(5,190,520)]),
 dict(title='A Memory Revolution',qs=[10,17],parts=[(9,106,712),(10,77,297)],figures=[(10,[126,313,526,508],'How Memory Works diagram')]),
 dict(title='Letter from Brooklyn',author='Jacob Scheier',format='poem',qs=[18,26],parts=[(15,134,472)],notes=[(15,494,517)],glossary={'brevity':'briefness','cathedral':'meditative','chapels':'private places of prayer or worship','nostalgic':'yearning for the past'}),
 dict(title='Excerpt from Do Them No Harm!',author='Zoa L. Swayne',literary=True,qs=[27,35],parts=[(19,173,672),(20,77,646)],blurb=(19,64,89),notes=[(20,668,702)],glossary={'camas':'a wild, edible plant'}),
 dict(title='Using Fire to Keep a Prairie Healthy',qs=[36,43],parts=[(25,106,673)],figures=[(26,[93,85,563,500],'Overview of the Patch-Burn Method diagram and accompanying text')]),
 dict(title='Excerpt from Winter Wheat',author='Mildred Walker',literary=True,qs=[44,51],parts=[(31,156,643),(32,77,675),(33,77,179)],blurb=(31,64,89),notes=[(33,200,229)],glossary={'serial':'story published in short segments at regular intervals','coulee':'small gulch or ravine'}),
 dict(title='Wolves of the Sea',qs=[52,57],parts=[(37,106,713),(38,77,116)])
],
'b':[
 dict(title='The End of an Era',format='sentence_prose',qs=[4,9],parts=[(4,190,539)]),
 dict(title='Excerpt from “The Food Business Incubator”',author='Mandalit Del Barco',qs=[10,17],parts=[(8,134,581),(9,77,388)],notes=[(9,410,433)],figures=[(10,[48,76,565,444],'Qualifications for La Cocina Applicants table')],glossary={'business incubator':'company that helps new and startup companies develop by providing services such as management training and office space','James Beard awards':'an award named after American cook and author James Beard, considered one of the highest honors in the culinary industry','economic development organizations':'organizations whose mission is to promote economic improvement within a specific geographical area','NPR':'National Public Radio, a nonprofit media organization that produces and distributes news and cultural programming','Lyft':'ride-sharing company where people use their own cars to provide rides to customers','kiosk':'cart or small structure with one or more open sides that is used to vend merchandise or services','kingpin':'the leader in a group or undertaking'}),
 dict(title='Excerpt from In Search of the Unknown',author='Robert W. Chambers',literary=True,qs=[18,26],parts=[(14,134,711),(15,77,646),(16,77,407)],notes=[(16,429,441)],glossary={'Audubon':'John James Audubon, an ornithologist and artist, who created scientific illustrations of birds','dotage':'a loss of reasoning brought about by old age'}),
 dict(title='Excerpt from “How We Made the First Flight”',author='Orville Wright',qs=[27,35],parts=[(20,169,569),(21,77,310)],blurb=(20,65,91),notes=[(21,332,345)],glossary={'Life Saving Station':'one of the rescue stations along the Atlantic coastline that provided assistance to mariners in distress','carbide':'a very hard material composed of carbon and other heavy metals','Kill Devil':'the town of Kill Devil Hills in eastern North Carolina','Nags Head':'a town in eastern North Carolina','“Richard” hand anemometer':'the type of anemometer produced by Jules Richard, a French manufacturer of scientific instruments'}),
 dict(title='Cross-Purposes',format='poem',qs=[36,43],parts=[(26,106,613),(27,77,180)],glossary={'ospreys':'large birds'}),
 dict(title='Excerpt from “Scribe Like an Egyptian”',author='Hilary Wilson',qs=[44,50],parts=[(30,134,637),(31,77,323)],notes=[(31,345,368)],figures=[(32,[203,77,407,341],'Ancient Egyptian Social Class Structure pyramid')],glossary={'bureaucracy':'an administrative staff of government officials','funerary papyri':'a sheet or scroll of papyrus containing religious images and hieroglyphs meant to help the deceased be reborn in the afterlife','rudiments':'basics','schoolboy':'slang that refers to materials used during the course of receiving an education','draughtsmen':'people who draw plans of machinery or structures','corpus':'a collection of writings'}),
 dict(title='Excerpt from “Niagara Falls”',author='Rupert Brooke',qs=[51,57],parts=[(36,134,665),(37,77,298)],notes=[(37,320,333)],glossary={'diaphanous':'sheer, translucent','platitudinous':'clichéd, common'})
]}

def clean(s):
    s=s.replace('ﬁ','fi').replace('ﬂ','fl')
    return re.sub(r'(?<=\w)-\s+(?=\w)','-',s)

def chars_in(page,box):
    return [dict(c,text=h.decode(c)) for c in page.chars if 35<=c['top']<721 and h.contained(c,box,.6)]

def source_underlines(page,chars):
    rules=[r for r in page.lines if 5<r['width']<400 and r['height']<1]
    return [dict(c,sourceUnderlineRule=next((i+1 for i,r in enumerate(rules) if r['x0']-.5<=c['x0'] and c['x1']<=r['x1']+.5 and -.5<=r['top']-c['bottom']<=2),0)) for c in chars]

def line_markup(line):
    """Preserve source fonts AND drawn underline rules in editable HTML."""
    chars=sorted(line['chars'],key=lambda c:c['x0']);fragments=[];plain=[];prev=None;active=None;run=''
    def flush():
        nonlocal run
        if not run:return
        value=html.escape(run)
        for tag in active[0] if active else ():value=f'<{tag}>'+value+f'</{tag}>'
        fragments.append(value);run=''
    for c in chars:
        if prev and abs(prev['x0']-c['x0'])<.2 and abs(prev['top']-c['top'])<.2 and prev['text']==c['text']:continue
        gap=c['x0']-prev['x1'] if prev else 0
        font=c.get('fontname','').lower();tags=[]
        if 'bold' in font:tags.append('strong')
        if 'italic' in font or 'oblique' in font:tags.append('em')
        if c.get('sourceUnderlineRule'):tags.append('u')
        if c['size']<8.4 and c['bottom']<line['baseline']-2.5:tags.append('sup')
        key=(tuple(tags),c.get('sourceUnderlineRule',0))
        changed=key!=active
        if changed:flush();active=key
        if prev and gap>1.2:
            if changed:fragments.append(' ')
            else:run+=' '
            plain.append(' ')
        run+=c['text'];plain.append(c['text']);prev=c
    flush()
    markup=''.join(fragments)
    return ''.join(plain),re.sub(r'</(strong|em)>\s*<\1>','',markup)

def rich(chars,boxes=(),poem=False,numbered=False,paragraph_gap=18):
    chars=[c for c in chars if not (c['size']<=8 and c['text'].strip().isdigit())] if numbered or poem else chars
    if not poem:
        lines=h.lines_for(chars);blocks=[];ts=[];current=[];prev=None;oldbox=None
        def flush():
            if not current:return
            t=' '.join(v[0] for v in current);m=' '.join(v[1] for v in current)
            ts.append(t);blocks.append(('<blockquote data-boxed="true">'+m+'</blockquote>') if oldbox is not None else '<p>'+m+'</p>');current.clear()
        for line in lines:
            bi=next((i for i,b in enumerate(boxes) if b[1]-.5<=line['top'] and line['bottom']<=b[3]+.5),None)
            marker=numbered and min(c['x0'] for c in line['chars'])<65 and bool(re.match(r'^\d{1,3}\s',line_markup(line)[0]))
            bullet=bool(re.match(r'^[•▪]',line_markup(line)[0]))
            if prev is not None and (line['top']-prev>paragraph_gap or bi!=oldbox or marker or bullet):flush()
            oldbox=bi;current.append(line_markup(line));prev=line['top']
        flush();text='\n\n'.join(ts);markup=''.join(blocks)
        markup=re.sub(r'<p><strong>([^<]+)</strong></p>',r'<h3>\1</h3>',markup)
        return clean(text),clean(markup)
    chars=[c for c in chars if c['x0']>=68]
    lines=h.lines_for(chars);texts=[];blocks=[];prev=None;stanza=[]
    for line in lines:
        if prev is not None and line['top']-prev>19:
            blocks.extend(stanza);blocks.append('<div></div>');stanza=[];texts.append('')
        t,m=line_markup(line);indent=round((min(c['x0'] for c in line['chars'])-69)/4)
        texts.append(' '*max(0,indent)+clean(t))
        stanza.append('<div data-poetry-line="true">'+'&nbsp;'*max(0,indent)+clean(m)+'</div>');prev=line['top']
    if stanza:blocks.extend(stanza)
    return '\n'.join(texts),''.join(blocks)

def prompt_rich(chars,boxes=(),paragraph_gap=18):
    text,markup=rich(chars,boxes=boxes,paragraph_gap=paragraph_gap)
    lines=h.lines_for(chars)
    if not lines or not text.startswith('Read '):return text,markup
    strong=[]
    for i,l in enumerate(lines):
        cc=[c for c in l['chars'] if c['text'].strip()]
        # Printed line references are regular weight even when the entire
        # quoted verse is bold; they must not end the excerpt prematurely.
        reference=re.search(r'\((?:lines?|paragraphs?)\s+[\d–—\s-]+\)\s*$',line_markup(l)[0])
        reference_length=len(re.sub(r'\s','',reference[0])) if reference else 0
        if cc and sum(len(c['text']) for c in cc if 'bold' in c['fontname'].lower())>.8*(sum(len(c['text']) for c in cc)-reference_length):strong.append(i)
    if not strong:return text,markup
    a,b=min(strong),max(strong)
    intro,ih=rich([c for l in lines[:a] for c in l['chars']]);follow,fh=rich([c for l in lines[b+1:] for c in l['chars']])
    poem=bool(re.search(r'\blines?\b|\bpoem\b',intro))
    excerpt_lines=[];previous=None
    for line in lines[a:b+1]:
        if previous is not None and line['top']-previous>19:excerpt_lines.append(('',''))
        excerpt_lines.append(line_markup(line));previous=line['top']
    groups=[];group=[]
    for t,m in excerpt_lines:
        if not t:
            if group:groups.append(group);group=[]
        else:group.append((t,m))
    if group:groups.append(group)
    et='\n\n'.join(('\n' if poem else ' ').join(clean(t) for t,m in group) for group in groups)
    eh='<br><br>'.join(('<br>' if poem else ' ').join(clean(m) for t,m in group) for group in groups)
    return '\n\n'.join(t for t in [intro,et,follow] if t),ih+'<blockquote>'+eh+'</blockquote>'+fh

def pagepart(pdf,part,**opts):
    n,y0,y1=part;return rich(chars_in(pdf.pages[n-1],[46,y0,566,y1]),**opts)

def crop(pdf,source,form,n,box,name,description,assets):
    folder=OUT/(form+'-assets');folder.mkdir(exist_ok=True)
    cache=OUT/(form+'-pages')/f'hi-{n:03}.png'
    if not cache.exists():
        subprocess.run(['pdftoppm','-f',str(n),'-l',str(n),'-r','160','-singlefile','-png',str(source),str(cache.with_suffix(''))],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    im=Image.open(cache);scale=im.width/pdf.pages[n-1].width
    b=[max(0,box[0]-1),max(0,box[1]-1),min(612,box[2]+1),min(792,box[3]+1)]
    path=folder/f'pdf-2023-2024-{form}-{name}.png'
    im.crop(tuple(round(x*scale) for x in b)).save(path)
    image={'src':'/exam-images/'+path.name,'alt':description}
    assets.append({'sourceFile':source.name,'sourcePage':n,'sourceBox':box,'file':str(path),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'url':image['src']})
    return image

def imgmarkup(image,box):
    return '<img src="'+image['src']+'" width="'+str(round((box[2]-box[0])*96/72))+'" alt="'+html.escape(image['alt'],quote=True)+'">'

def regions(pdf,start,end,explanations=False):
    out={}
    for pi in range(start-1,end):
        page=pdf.pages[pi];words=page.extract_words(x_tolerance=2,y_tolerance=2)
        starts=[w for w in words if re.fullmatch(r'\d{1,3}\.',w['text']) and (abs(w['x0']-48)<2 or abs(w['x0']-318)<2) and 1<=int(w['text'][:-1])<=114]
        for w in starts:
            n=int(w['text'][:-1]);right=w['x0']>300
            following=[v['top'] for v in starts if (v['x0']>300)==right and v['top']>w['top']+5]
            last=min(following)-16 if following else 721
            x=w['x0'];box=[x,w['top']-7,564 if n<58 or right else 294,last]
            out[n]={'page':pi+1,'box':box,'numberBox':[x-1,w['top']-1,w['x1']+1,w['bottom']+1]}
    return out

def extract_question(pdf,source,form,n,reg,key,assets):
    page=pdf.pages[reg['page']-1];box=reg['box'];words=page.extract_words(x_tolerance=2,y_tolerance=2)
    labels=[w for w in words if re.fullmatch('[A-H]\\.',w['text']) and h.contained(w,box,1) and abs(w['x0']-(box[0]+30))<2]
    if n==114:box[3]=min(box[3],550)
    cs=[c for c in chars_in(page,box) if not h.contained(c,reg['numberBox'],1)]
    if n<=(4 if form=='a' else 3):cs=source_underlines(page,cs)
    graphics=h.source_graphics(page,box) if n>=58 else []
    visuals=[];figures=[]
    for i,b in enumerate(graphics):
        choice=next((j for j,w in enumerate(labels) if w['top']-8<=b[1]<(labels[j+1]['top']-8 if j+1<len(labels) else box[3])),None)
        description=f'Original source figure for Form {form.upper()}, question {n}'+(f', choice {labels[choice]["text"]}' if choice is not None else '')
        image=crop(pdf,source,form,reg['page'],b,f'q{n:03}-figure-{i+1}',description,assets)
        figures.append((b,image,choice))
        visuals.append({'questionId':f'pdf-shsat-2023-2024-{form}-q{n:03}','choiceId':'ABCD'[choice] if choice is not None else '', 'sourceFile':source.name,'sourcePage':reg['page'],'location':str(b),'description':description,'state':'unresolved','image':image})
    cs=[c for c in cs if not any(h.contained(c,b,1) for b,_,_ in figures)]
    cs=h.fraction_chars(cs)
    prompt_end=min([w['top']-8 for w in labels],default=box[3])
    boxes=[[r['x0'],r['top'],r['x1'],r['bottom']] for r in page.rects if r['stroke'] and r['width']>100 and h.contained(r,box,1)] if n<58 else []
    pc=[c for c in cs if c['top']<prompt_end]
    prompt,markup=prompt_rich(pc,boxes=boxes,paragraph_gap=26 if n>=58 else 18)
    # Insert real source figures at their source position within the prompt.
    if any(ci is None for _,_,ci in figures):
        chunks=[];lower=box[1]
        for b,im,ci in sorted(figures,key=lambda f:f[0][1]):
            if ci is not None:continue
            _,before=rich([c for c in pc if lower<=c['top']<b[1]],boxes=boxes,paragraph_gap=26 if n>=58 else 18)
            chunks.extend([before,'<p data-numbered="false">'+imgmarkup(im,b)+'</p>']);lower=b[3]
        _,after=rich([c for c in pc if c['top']>=lower],boxes=boxes,paragraph_gap=26 if n>=58 else 18);chunks.append(after);markup=''.join(chunks)
    choices=[]
    for i,w in enumerate(labels):
        end=labels[i+1]['top']-8 if i+1<len(labels) else box[3]
        cc=[c for c in cs if w['top']-8<=c['top']<end and not h.contained(c,[w['x0']-1,w['top']-1,w['x1']+1,w['bottom']+1],1)]
        t,m=rich(cc)
        for b,im,ci in figures:
            if ci==i:m+=imgmarkup(im,b)
        choices.append({'id':'ABCD'[i],'text':t,'html':m})
    assert len(labels)==(0 if 58<=n<=62 else 4),(form,n,len(labels))
    q={'id':f'pdf-shsat-2023-2024-{form}-q{n:03}','type':'short_response' if 58<=n<=62 else 'multiple_choice','topic':'','subtopic':'','points':1,'prompt':prompt,'promptHtml':markup,'choices':choices,'explanation':'','visuals':visuals,'review':{'sourceFile':source.name,'sourcePages':[reg['page']],'sourceQuestion':str(n),'sourceChoiceIds':[w['text'][0] for w in labels],'expectedChoiceCount':len(labels),'answerSource':{'sourceFile':source.name,'sourcePages':[len(pdf.pages)]},'sourceReviewed':False,'completenessReviewed':False,'classificationReviewed':False,'topicSource':'unknown','difficulty':'','difficultySource':'unknown','warnings':[]}}
    if labels:q['correctChoiceId']='ABCD'[[w['text'][0] for w in labels].index(key[n])]
    else:q['correctTextAnswers']=[key[n]]
    if n<= (4 if form=='a' else 3):
        # Keep independent paragraph material in the supported stimulus field.
        if boxes:
            b=boxes[0];sc=[c for c in pc if h.contained(c,b,1)];q['stimulus'],q['stimulusHtml']=rich(sc)
            q['prompt'],q['promptHtml']=rich([c for c in pc if not h.contained(c,b,1)])
    return q

def attach_explanations(pdf,source,form,questions,assets):
    regs=regions(pdf,59,len(pdf.pages)-1,True)
    assert set(regs)==set(range(1,115)),(form,'explanation inventory',set(range(1,115))-set(regs))
    for n,q in enumerate(questions,1):
        reg=regs[n];box=reg['box'];page=pdf.pages[reg['page']-1]
        cs=[c for c in chars_in(page,box) if not h.contained(c,reg['numberBox'],1)]
        # Explanations flow down each column; append continuation before the
        # next numbered explanation when it starts on a later column/page.
        parts=[(reg['page'],box,cs)]
        nextreg=regs.get(n+1)
        if n>=58 and nextreg and (nextreg['page']>reg['page'] or (box[0]<300 and nextreg['box'][0]>300)):
            pnum=reg['page'];right=box[0]>300
            while True:
                if n>=58 and not right:right=True
                else:pnum+=1;right=False
                if pnum>nextreg['page']:break
                if pnum==nextreg['page'] and right==(nextreg['box'][0]>300):
                    stop=nextreg['box'][1]-9
                else:stop=721
                page_starts=[r['box'][1] for r in regs.values() if r['page']==pnum]
                top=max(76,min(page_starts)) if min(page_starts,default=76)>110 else 76
                b=[318 if right else 48,top,564 if n<58 or right else 294,stop]
                cc=chars_in(pdf.pages[pnum-1],b)
                if cc:parts.append((pnum,b,cc))
                if pnum==nextreg['page'] and right==(nextreg['box'][0]>300):break
        txt=[];mark=[]
        for pnum,b,cc in parts:
            # Footers, section headers and private PDF object labels excluded.
            cc=[c for c in cc if not ('M170' in c['text'])]
            t,m=rich(h.fraction_chars(cc));txt.append(t);mark.append(m)
        q['explanation']='\n\n'.join(txt);q['explanationHtml']=''.join(mark)
        q['review']['explanationSource']={'sourceFile':source.name,'sourcePages':sorted(set(p[0] for p in parts)),'regions':[{'page':p,'box':b} for p,b,_ in parts]}
        # Keep a source facsimile for mathematical explanation layout, with
        # exact editable transcription retained alongside it in the draft.
        if n>=58:
            images=[]
            for j,(pnum,b,cc) in enumerate(parts):
                if not cc:continue
                tight=[b[0],max(b[1],min(c['top'] for c in cc)-2),b[2],min(b[3],max(c['bottom'] for c in cc)+2)]
                im=crop(pdf,source,form,pnum,tight,f'q{n:03}-explanation-{j+1}',f'Official Form {form.upper()} explanation for question {n}; original answer labels retained.',assets)
                images.append('<p>'+imgmarkup(im,tight)+'</p>')
            q['explanationHtml']=''.join(images)
            q['review']['warnings'].append({'code':'POSSIBLE_FORMATTING_LOSS','message':'The official mathematical explanation is preserved as source crops; verify the editable text against those crops.','state':'unresolved'})
        # Preserve source labels and disclose their relationship after normalization.
        if q['review']['sourceChoiceIds']==list('EFGH'):
            q['review']['warnings'].append({'code':'POSSIBLE_FORMATTING_LOSS','message':'Official explanation retains paper E–H option references; editor choices A–D correspond in the same order.','state':'unresolved'})

def passages(pdf,source,form,questions,assets):
    result=[]
    for ix,p in enumerate(PROFILES[form]):
        texts=[];markups=[];fmt=p.get('format','prose')
        for i,part in enumerate(p['parts']):
            t,m=pagepart(pdf,part,poem=fmt=='poem',numbered=fmt!='sentence_prose')
            # A continuation page without a printed paragraph number continues
            # the preceding paragraph; poetry continuation preserves its stanza.
            if i and fmt!='poem' and t and not re.match(r'^\d+\s',t):
                first,sep,rest=t.partition('\n\n');texts[-1]+=' '+first;t=rest
                match=re.match(r'<p>(.*?)</p>(.*)',m,re.S)
                if match and markups[-1].endswith('</p>'):
                    markups[-1]=markups[-1][:-4]+' '+match[1]+'</p>';m=match[2]
            texts.append(t);markups.append(m)
        text=('\n' if fmt=='poem' else '\n\n').join(t for t in texts if t);markup=''.join(markups)
        for term,definition in p.get('glossary',{}).items():
            token=html.escape(term)
            assert token in markup,(form,p['title'],term)
            markup=markup.replace(token,'<span data-glossary-definition="'+html.escape(definition,quote=True)+'" role="link" tabindex="0">'+token+'</span>',1)
        visuals=[]
        for j,(pn,box,desc) in enumerate(p.get('figures',[])):
            image=crop(pdf,source,form,pn,box,f'passage-{ix+1}-figure-{j+1}',desc,assets)
            markup+='<p data-numbered="false">'+imgmarkup(image,box)+'</p>'
            visuals.append({'questionId':'','sourceFile':source.name,'sourcePage':pn,'location':str(box),'description':desc,'state':'unresolved','image':image})
        blurb,blurbHtml=pagepart(pdf,p['blurb']) if p.get('blurb') else ('','')
        notes=[pagepart(pdf,part) for part in p.get('notes',[])]
        qs=questions[p['qs'][0]-1:p['qs'][1]]
        result.append({'title':p['title'],'titleHtml':html.escape(p['title']),'author':p.get('author',''),'byline':'by '+p['author'] if p.get('author') else '', 'blurb':blurb,'blurbHtml':blurbHtml,'format':fmt,'passageType':'poem' if fmt=='poem' else 'literary' if p.get('literary') else 'informational','passageCategory':'official_handbook','section':'revising_editing_a' if fmt=='sentence_prose' else 'reading','label':f'2023-2024 Form {form.upper()}','versionLabel':f'2023-2024 Form {form.upper()}','text':text,'richText':markup,'sourceNote':'\n'.join(t for t,m in notes),'sourceNoteHtml':''.join(m for t,m in notes),'teacherSource':f'Supplied 2023 SHSAT sample Form {form.upper()}. PDF page references retained in review metadata. All human review flags remain false.','questions':qs,'visuals':visuals,'review':{'sourceFile':source.name,'sourcePages':sorted(set([part[0] for part in p['parts']]+[f[0] for f in p.get('figures',[])])),'expectedQuestionCount':len(qs),'sourceReviewed':False,'completenessReviewed':False,'warnings':[]}})
    return result

def main():
    for form,name in [('a','20232024_form_a (1).pdf'),('b','20232024_form_b.pdf')]:
        source=pathlib.Path('C:/Users/Nathan Im/Downloads')/name;assets=[]
        with pdfplumber.open(source) as pdf:
            key={int(n):a for n,a in re.findall(r'\b(\d{1,3})\.(-?\d+(?:\.\d+)?|[A-H])\b',pdf.pages[-1].extract_text())}
            assert set(key)==set(range(1,115))
            regs=regions(pdf,3 if form=='a' else 2,58)
            assert set(regs)==set(range(1,115)),set(range(1,115))-set(regs)
            questions=[extract_question(pdf,source,form,n,regs[n],key,assets) for n in range(1,115)]
            attach_explanations(pdf,source,form,questions,assets)
            result={'format':h.FORMAT,'source':{'sourceFamily':'official_shsat','sourceFormat':'pdf','playerProfile':'testnav','sourceId':f'official-shsat-2023-2024-form-{form}','label':f'2023-2024 Form {form.upper()}','year':'2023-2024','form':form.upper(),'sourceFile':source.name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest()},'passages':passages(pdf,source,form,questions,assets),'englishQuestions':questions[:4 if form=='a' else 3],'mathQuestions':questions[57:],'review':{'sourceFile':source.name,'expectedQuestionCount':57,'sourceReviewed':False,'completenessReviewed':False},'batch':{'sourceId':'','jobId':'','sourceLabel':f'2023-2024 Form {form.upper()}','section':'math','requestedScope':'Complete supplied examination, mathematics questions 58–114','expectedQuestions':list(map(str,range(58,115))),'expectedTotal':57,'inventoryConfirmed':True,'chunkId':f'form-{form}-complete','completedQuestions':list(map(str,range(58,115))),'unresolvedQuestions':[],'nextScope':''}}
            (OUT/f'form-{form}-import.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
            (OUT/f'form-{form}-raw-capture.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
            (OUT/f'form-{form}-assets.json').write_text(json.dumps(assets,indent=2),encoding='utf8')
            (OUT/f'form-{form}-questions.txt').write_text('\n\n'.join(str(n)+' [PDF '+str(q['review']['sourcePages'][0])+'] '+q['prompt']+'\n'+'\n'.join(c['id']+'. '+c['text'] for c in q['choices']) for n,q in enumerate(questions,1)),encoding='utf8')
            print(form,len(questions),'questions',len(result['passages']),'passages',len(assets),'assets')

if __name__=='__main__':main()
