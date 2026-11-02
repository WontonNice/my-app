"""Reviewed presentation repairs, classifications and completeness audit."""
import json,html,pathlib,re
BASE=pathlib.Path(__file__).parent

def p(t):return ''.join('<p>'+html.escape(v).replace('\n','<br>')+'</p>' for v in t.split('\n\n'))
def table(caption,headers,rows):
    head='<thead><tr>'+''.join('<th scope="col">'+html.escape(h)+'</th>' for h in headers)+'</tr></thead>' if any(headers) else ''
    return '<table><caption>'+html.escape(caption)+'</caption>'+head+'<tbody>'+''.join('<tr>'+''.join('<td>'+html.escape(str(v))+'</td>' for v in row)+'</tr>' for row in rows)+'</tbody></table>'

MATH={
'a':{
59:r'\(6 - 9 \div |-3| + (-2)^3 \times 1\frac{1}{2}\)'+'\n\nWhat is the value of the expression shown above?',
63:r'\(3^4 + 7^4 =\)',
77:r'\(\frac{3^2+(-8)^2+2^2}{(3-8+2)^2}=\)',
90:r'If \(m=5\) and \(t=-1\), what is the value of \(\frac{6-8(2-t)}{2m+4(3-m)}\)?',
},
'b':{
63:r'What is the value of \(3\frac{1}{4}-1\frac{2}{3}-\left(-4\frac{1}{2}\right)\)?',
94:r'Which expression is equivalent to \(\frac{1}{2}x+7-\left(x-\frac{9}{2}\right)\)?',
99:'1 gallon = 16 cups\n1 cup = 8 fluid ounces\n\n'+r'If 1 gallon = \(2^x\) fluid ounces, what is the value of \(x\)?',
103:r'\(0^3+4^0+2^{-1}+(-1)^2\)'+'\n\nWhat is the value of the expression above, in decimal form?',
112:r'\(6.\overline{34}-4.\overline{12}\)'+'\n\nWhat is the value of the expression above, written as an improper fraction?',
}}

# Inferred classifications only; no difficulty or answer inference.
CATS=['Algebra','Geometry','Statistics and Probability','Ratios and Proportional Relationships','Arithmetic & Number Sense']
TOPICS={
'a':{0:[60,68,69,86,90,95,97,101],1:[61,67,82,91,92,94,102,106,107],2:[62,72,80,81,84,87,88,89,99,103,105,108,110,112,114],3:[58,65,66,74,75,76,78,79,85,93,96,98,100,109,111],4:[59,63,64,70,71,73,77,83,104,113]},
'b':{0:[62,65,71,74,78,84,88,94,95,108],1:[73,75,81,89,90,93,97,100,106,109,113],2:[67,70,77,79,80,83,87,91,101,104,107,110,114],3:[58,59,61,64,69,72,76,82,85,92,96,98,99,102,105,111],4:[60,63,66,68,86,103,112]},
}
E_TOPICS={
'a':{1:'Punctuation',2:'Verbs',3:'Modifiers',4:'Sentence Structure',5:'Topic & Transitions',6:'Topic & Transitions',7:'Evidence & Support',8:'Relevance & Conclusion',9:'Relevance & Conclusion'},
'b':{1:'Punctuation',2:'Modifiers',3:'Pronouns',4:'Topic & Transitions',5:'Topic & Transitions',6:'Word Choice & Precision',7:'Sentence Structure',8:'Topic & Transitions',9:'Relevance & Conclusion'}
}

def allq(d):return d['englishQuestions']+[q for v in d['passages'] for q in v['questions']]+d['mathQuestions']

for form in 'ab':
    path=BASE/f'form-{form}-import.json';d=json.loads((BASE/f'form-{form}-raw-capture.json').read_text(encoding='utf8'));qs={int(q['review']['sourceQuestion']):q for q in allq(d)}
    for n,text in MATH[form].items():qs[n]['prompt']=text;qs[n]['promptHtml']=p(text)
    # Keep tables editable and retain all source values in the plain-text copy.
    table_specs=([
      (103,'ESSAY LENGTH',['Number of Words','Number of Essays'],[['<100',6],['100–250',4],['251–500',11],['>500',9]],'All 150 students')
    ] if form=='a' else [
      (58,'LAST YEAR’S TOTAL SALES',['Vehicles','Number'],[['Four-door cars','5,850'],['Two-door cars','2,250'],['Trucks',900],['Total','9,000']],'The table above'),
      (80,'FRUIT SOLD AT STORE XYZ',['Fruit','Number Sold'],[['Apples',8],['Bananas',6],['Cherries',12],['Oranges',6],['Peaches','?'],['Total',50]],'Peaches made up'),
      (87,'PRICE OF A USED VIDEO GAME AT VARIOUS STORES',['Price of Used Video Game','Number of Stores'],[['$10.99',5],['$11.99',2],['$12.99',1],['$13.99',4]],'The table above'),
    ])
    for n,caption,headers,rows,afterstart in table_specs:
        q=qs[n];after=q['prompt'][q['prompt'].index(afterstart):]
        plain=caption+'\n'+' | '.join(headers)+'\n'+'\n'.join(' | '.join(map(str,row)) for row in rows)+'\n\n'+after
        q['prompt']=plain;q['promptHtml']=table(caption,headers,rows)+p(after)
        q['review']['warnings'].append({'code':'TABLE_REVIEW_REQUIRED','message':'Source table transcribed into an editable table; verify source values and row order.','state':'unresolved'})
    for n,q in qs.items():
        # Actual source assets already have stable, verified local URLs. Keep
        # these images in the authored HTML/native choice slots, without an
        # additional unresolved dependency that would display the image twice.
        for visual in q.get('visuals',[]):
            if visual.get('choiceId'):
                choice=next(c for c in q['choices'] if c['id']==visual['choiceId'])
                choice['image']=visual['image']
                choice['html']=re.sub(r'<img[^>]+>','',choice['html'])
        q['visuals']=[]
        if n>=58:
            matches=[CATS[i] for i,ns in TOPICS[form].items() if n in ns];assert len(matches)==1,(form,n,matches)
            q['topic']=matches[0]
        elif n<=9:
            q['topic']=E_TOPICS[form].get(n,'')
            if n==7 and form=='a':q['topic']='Topic & Transitions'
        else:
            t=q['prompt'].lower()
            if 'central idea' in t or 'central theme' in t or 'summary' in t or 'theme of' in t:q['topic']='Central Idea & Theme'
            elif 'best supports' in t or 'which evidence' in t or 'which lines support' in t or 'provides evidence' in t:q['topic']='Evidence & Support'
            elif 'most likely agree' in t or 'point of view' in t:q['topic']="Author's Point of View"
            elif 'tone' in t or 'feeling' in t:q['topic']='Tone & Mood'
            elif 'phrase' in t or 'word ' in t or 'words ' in t:q['topic']='Word & Phrase Meaning'
            elif 'comparing' in t or 'comparison' in t or 'figurative' in t:q['topic']='Figurative Language & Imagery'
            elif 'structure' in t or 'contribute' in t or 'develop' in t or 'include' in t or 'affect the plot' in t or 'diagram' in t or 'table' in t:q['topic']='Text Structure & Purpose'
            else:q['topic']='Inference'
        q['review'].update(topicSource='inferred',topicConfidence=.8,classificationReviewed=False,sourceReviewed=False,completenessReviewed=False,difficulty='',difficultySource='unknown',difficultyConfidence=None)
        if n>=58:
            q['review']['warnings'].append({'code':'LOW_CONFIDENCE_QUESTION_TYPE','message':'Main category is inferred. Specific Math subtopic is unassigned for teacher classification.','state':'unresolved'})
        assert q['prompt'].strip(),(form,n,'blank prompt')
        assert len(q.get('choices',[]))==(0 if 58<=n<=62 else 4)
        assert q.get('correctChoiceId') or q.get('correctTextAnswers'),(form,n,'missing key')
        assert q['explanation'].strip(),(form,n,'missing explanation')
        assert not re.search('[\ue000-\uf8ff]',json.dumps(q,ensure_ascii=False)),(form,n,'unmapped glyph')
    # Root review count describes Math; passage/standalone entries carry their
    # own counts when split into independent import payloads below.
    for v in d['passages']:
        assert v['text'].strip() and len(v['questions'])==v['review']['expectedQuestionCount']
        assert 'CONTINUE' not in v['text'] and 'DIRECTIONS:' not in v['text']
        v['visuals']=[]
    titles=json.loads((BASE/'source-title-formatting.json').read_text(encoding='utf8'))[form]
    for v,title in zip(d['passages'],titles):v['titleHtml']=title.removeprefix('<p>').removesuffix('</p>')
    if form=='b':
        v=d['passages'][1]
        rows=[]
        # Read the actual source cells rather than interleave table columns.
        import sys
        sys.path.insert(0,str(BASE));import capture_exams as capture
        with capture.pdfplumber.open('C:/Users/Nathan Im/Downloads/20232024_form_b.pdf') as pdf:
            for name,y0,y1 in [('Level of Income',102,181),('Business Plan',189,242),('Viable Product',250,289),('Entrepreneurial Work Ethic',297,337),('Community Spirit',345,424)]:
                text,_=capture.rich(capture.chars_in(pdf.pages[9],[206,y0,565,y1]));rows.append([name,text])
        # A native table supplements the complete prose, replacing its bitmap.
        v['richText']=re.sub(r'<p data-numbered="false"><img[^>]+></p>$','',v['richText'])
        v['richText']+=table('QUALIFICATIONS FOR LA COCINA APPLICANTS',['',''],rows)+'<p data-numbered="false">Source: La Cocina</p>'
        v['text']+='\n\nQUALIFICATIONS FOR LA COCINA APPLICANTS\n'+'\n'.join(' | '.join(row) for row in rows)+'\nSource: La Cocina'
        # Crop remains available as a source dependency, not a duplicate display.
        for visual in v['visuals']:visual['questionId']='';visual['description']+=' (source reference; editable table included)'
        v['visuals']=[]
        v['review']['warnings'].append({'code':'TABLE_REVIEW_REQUIRED','message':'La Cocina qualification table transcribed with source columns and row order; original crop retained in source assets manifest.','state':'unresolved'})
    path.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
    base={'format':d['format'],'source':d['source']}
    for suffix,payload in [('english',{'passages':d['passages'],'englishQuestions':d['englishQuestions'],'review':{'sourceFile':d['review']['sourceFile'],'expectedQuestionCount':len(d['englishQuestions'])}}),('math',{'mathQuestions':d['mathQuestions'],'batch':d['batch'],'review':d['review']})]:
        (BASE/f'form-{form}-{suffix}.json').write_text(json.dumps({**base,**payload},ensure_ascii=False,indent=2),encoding='utf8')
    print(form,{'english':57,'math':57,'passages':len(d['passages']),'glossary':sum(v['richText'].count('data-glossary-definition') for v in d['passages']),'keys':len(qs),'explanations':len(qs)})
