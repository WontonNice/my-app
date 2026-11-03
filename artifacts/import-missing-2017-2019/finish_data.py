import prepare_data as d
import pdfplumber,re,html,copy
d.ASSETS=d.load('assets.json')
for key in d.PROFILES:
 data=d.load(key+'-working.json');qs={int(q['review']['sourceQuestion']):q for p in data['passages'] for q in p['questions']};qs.update({int(q['review']['sourceQuestion']):q for q in data['englishQuestions']+data['mathQuestions']})
 if key=='20192020_form_b':
  repairs={
   63:(r'Two glasses can hold the same amount of liquid. Glass A is \(\frac{1}{2}\) filled, and Glass B is \(\frac{1}{3}\) filled. If the liquid in Glass B is poured into Glass A, what fraction of Glass A will then be filled?',[r'\frac{5}{6}',r'\frac{4}{5}',r'\frac{3}{4}',r'\frac{1}{5}'],'Arithmetic & Number Sense','Fractions & Decimals'),
   67:(r'A recipe uses \(\frac{1}{4}\) teaspoon of salt and \(2\frac{1}{2}\) teaspoons of sugar. What is the ratio of salt to sugar in this recipe?',['1:20','1:10','1:5','1:4'],'Ratios and Proportional Relationships','Ratios & Proportions'),
   79:(r'\(\frac{5^4\times5^6}{5^2}=\)',['5^8','5^{10}','5^{12}','5^{22}'],'Arithmetic & Number Sense','Exponents, Roots & Scientific Notation'),
   81:(r'Carpenters laid a layer of insulation \(6\) inches thick to cover a rectangular attic floor that was \(32\) feet long and \(20\) feet wide. What was the volume, in cubic feet, of the insulation used to cover the floor?',['160','320','640','3{,}840'],'Geometry','Surface Area & Volume'),
   83:(r'According to the number line above, what is the value of \(y\)?',['4','12','14','20'],'Geometry','Coordinates & Segment Relationships'),
   94:(r'If \(x\) is an odd number, what is the sum of \(x\) and the next \(2\) odd numbers greater than \(x\)?',['x+4','2x+6','3x+3','3x+6'],'Algebra','Algebraic Expressions'),
   104:(r'A company wants to study \(6\) brands of soap by comparing each brand with every other brand. If each comparison costs \(\$2{,}000\), how much will the company spend altogether?',[r'\$13{,}000',r'\$20{,}000',r'\$30{,}000',r'\$60{,}000'],'Statistics and Probability','Counting & Sets'),
   105:(r'What number is halfway between \(\frac{1}{20}\) and \(\frac{1}{10}\) on a number line?',[r'\frac{1}{5}',r'\frac{2}{15}',r'\frac{1}{30}',r'\frac{3}{40}'],'Arithmetic & Number Sense','Fractions & Decimals')}
  for n,(prompt,choices,topic,subtopic) in repairs.items():
   q=qs[n];q['prompt']=prompt;q['promptHtml']=d.markup(prompt);q['choices']=[{'id':'ABCD'[i],'text':v,'math':v} for i,v in enumerate(choices)];q['topic']=topic;q['subtopic']=subtopic
  qs[83]['promptHtml']='<p>'+d.crop(d.OUT/(key+'.pdf'),38,[358,93,553,163],'2019-2020-b-q083-number-line')+'</p>'+qs[83]['promptHtml']
 # Quoted excerpts stay in a single supported blockquote, with faithful source styles.
 for n,q in qs.items():
  if n>=58:continue
  if q['prompt'].startswith('Read ') and '<blockquote' not in q['promptHtml']:
   parts=re.findall('<p>(.*?)</p>',q['promptHtml'],re.S)
   if len(parts)>=3:q['promptHtml']='<p>'+parts[0]+'</p><blockquote>'+'<br><br>'.join(parts[1:-1])+'</blockquote><p>'+parts[-1]+'</p>'
  text=q['prompt'].lower()
  if n<=20 and key.startswith('2017') or n<=9 and key.startswith('2019'):
   topic='Pronouns' if 'pronoun' in text else 'Verbs' if 'tense' in text else 'Punctuation' if 'comma' in text or 'edit should' in text else 'Word Choice & Precision' if 'precise' in text or 'formal' in text else 'Sentence Structure' if any(t in text for t in ['combine','construction','sentence be revised','run-on','sentence structure']) else 'Relevance & Conclusion' if any(t in text for t in ['conclusion','irrelevant','deleted','main claim']) else 'Topic & Transitions'
  else:
   topic='Central Idea & Theme' if any(t in text for t in ['central idea','central theme','passage is about','main idea']) else 'Evidence & Support' if 'supports' in text or 'evidence' in text else "Author's Point of View" if 'point of view' in text or 'author’s opinion' in text else 'Tone & Mood' if 'mood' in text or 'tone' in text else 'Word & Phrase Meaning' if 'phrase' in text or 'word ' in text else 'Figurative Language & Imagery' if 'imagery' in text or 'comparison' in text else 'Text Structure & Purpose' if any(t in text for t in ['contribute','author include','structure','purpose','function','develop']) else 'Inference'
  q['topic']=topic;q['review'].update(topicSource='inferred',topicConfidence=.8)
 starts=d.load(key+'-explanation-starts.json');assert sorted(r['n'] for r in starts)==list(range(1,115));starts.sort(key=lambda r:(r['page'],r['col'],r['top']))
 assert [r['n'] for r in starts]==list(range(1,115)),(key,'source ordering')
 source=d.OUT/(key+'_-_answers.pdf')
 with pdfplumber.open(source) as pdf:
  units=[]
  for pi,page in enumerate(pdf.pages):
   if pi==len(pdf.pages)-1 and key!='20172018_form_b':break
   for col,(x0,x1) in enumerate([(35,302),(312,579)] if key.startswith('2017') or pi>=25 else [(40,580)]):units.append((pi+1,col,x0,x1))
  for i,start in enumerate(starts):
   n=start['n'];nxt=starts[i+1] if i+1<len(starts) else None;lo=next(j for j,u in enumerate(units) if u[:2]==(start['page'],start['col']));hi=next(j for j,u in enumerate(units) if u[:2]==(nxt['page'],nxt['col'])) if nxt else len(units)-1
   parts=[]
   for j in range(lo,hi+1):
    pn,col,x0,x1=units[j];top=start['top']-2 if j==lo else (100 if key.startswith('2017') else 65);bottom=nxt['top']-8 if nxt and j==hi else 740
    if bottom<=top:continue
    page=pdf.pages[pn-1]
    key_heading=[l['top'] for l in page.extract_text_lines() if 'Answer Key for Sample' in l['text']]
    if key_heading:bottom=min(bottom,min(key_heading)-8)
    if bottom<=top:continue
    cs=d.chars(page,[x0,top,x1,bottom]);kept=[]
    for line in d.h.h.lines_for(cs):
     text,_=d.h.line_markup(line)
     if re.search(r'Answer Key for Sample',text):break
     if re.search(r'SAMPLE TEST|Sample Test|EXPLANATIONS|Explanations|Correct Answers|continued|REVISING/EDITING|READING COMPREHENSION|^Form [AB]$|^Form$|^FORM$',text):continue
     kept.extend(line['chars'])
    if not kept:continue
    tight=[min(c['x0'] for c in kept)-2,min(c['top'] for c in kept)-2,max(c['x1'] for c in kept)+2,max(c['bottom'] for c in kept)+2];t,m=d.h.rich(kept)
    parts.append((pn,t,m,tight))
   q=qs[n];q['explanation']='\n\n'.join(t for pn,t,m,b in parts);q['explanationHtml']=''.join(m for pn,t,m,b in parts)
   q['review']['explanationSource']={'sourceFile':source.name,'sourcePages':sorted(set(pn for pn,t,m,b in parts)),'regions':[{'page':pn,'box':b} for pn,t,m,b in parts]}
   if n>=58:
    q['explanationHtml']=''.join('<p>'+d.crop(source,pn,b,f"{key}-q{n:03}-explanation-{j+1}")+'</p>' for j,(pn,t,m,b) in enumerate(parts))
    q['review']['warnings'].append({'code':'POSSIBLE_FORMATTING_LOSS','message':'The mathematical explanation is retained as source crops; compare the editable transcription against the source.','state':'unresolved'})
   if q['review']['sourceChoiceIds']==list('EFGH'):q['review']['warnings'].append({'code':'POSSIBLE_FORMATTING_LOSS','message':'The source explanation uses E–H; the editor displays the same ordered choices as A–D.','state':'unresolved'})
   assert q['explanation'].strip(),(key,n,'empty explanation')
 d.dump(key+'-import.json',data)
 d.dump('assets.json',d.ASSETS)
 print(key,'completed supplied explanations for',len(qs),'questions',flush=True)
