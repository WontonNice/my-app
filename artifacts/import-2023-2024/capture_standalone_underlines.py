import pathlib,json,re
import capture_exams as c
base=pathlib.Path(__file__).parent;out=[]
for form,name,total in [('a','20232024_form_a (1).pdf',4),('b','20232024_form_b.pdf',3)]:
    source=pathlib.Path('C:/Users/Nathan Im/Downloads')/name
    with c.pdfplumber.open(source) as pdf:
        regions=c.regions(pdf,3 if form=='a' else 2,4 if form=='a' else 3)
        keys={int(n):a for n,a in re.findall(r'\b(\d{1,3})\.(-?\d+(?:\.\d+)?|[A-H])\b',pdf.pages[-1].extract_text())}
        for n in range(1,total+1):
            q=c.extract_question(pdf,source,form,n,regions[n],keys,[])
            terms=re.findall(r'<u>(.*?)</u>',q.get('stimulusHtml',''))
            out.append({'form':form,'sourceQuestion':str(n),'sourcePage':regions[n]['page'],'stimulus':q['stimulus'],'stimulusHtml':q['stimulusHtml'],'underlines':terms})
            print(form,n,terms)
(base/'standalone-source-underlines.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
assert sum(len(q['underlines']) for q in out)==28
