import pathlib,json,re
import capture_exams as c
base=pathlib.Path(__file__).parent
out=[]
for form,name in [('a','20232024_form_a (1).pdf'),('b','20232024_form_b.pdf')]:
    source=pathlib.Path('C:/Users/Nathan Im/Downloads')/name
    with c.pdfplumber.open(source) as pdf:
        regions=c.regions(pdf,3 if form=='a' else 2,58)
        keys={int(n):a for n,a in re.findall(r'\b(\d{1,3})\.(-?\d+(?:\.\d+)?|[A-H])\b',pdf.pages[-1].extract_text())}
        for n in range(1,58):
            q=c.extract_question(pdf,source,form,n,regions[n],keys,[])
            if not q['prompt'].startswith('Read '):continue
            out.append({'form':form,'sourceQuestion':str(n),'sourcePage':regions[n]['page'],'prompt':q['prompt'],'promptHtml':q['promptHtml']})
(base/'quoted-prompts-source-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
print('Checked source regions for',len(out),'quoted/read-cue questions across both forms.')
