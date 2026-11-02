import pdfplumber, re, json, pathlib, importlib.util
base=pathlib.Path(__file__).parent
for form,name in [('a','20232024_form_a (1).pdf'),('b','20232024_form_b.pdf')]:
    p=pdfplumber.open(pathlib.Path('C:/Users/Nathan Im/Downloads')/name)
    lines=[]
    for i,page in enumerate(p.pages):
        if i>=58: continue
        lines.append(f'=== PAGE {i+1} ===')
        for line in page.extract_text_lines():
            if line['top']<742:lines.append(f"{line['x0']:.1f},{line['top']:.1f},{line['bottom']:.1f}: {line['text']}")
    (base/f'{form}-lines.txt').write_text('\n'.join(lines),encoding='utf8')
    # Inspect groups that represent source figures.
    records=[]
    for i in range(40,58):
        page=p.pages[i]
        records.append({'page':i+1,'rects':[{k:r[k] for k in ['x0','top','x1','bottom','fill','stroke']} for r in page.rects if r['width']>25 and r['height']>15]})
    (base/f'{form}-graphics.json').write_text(json.dumps(records,indent=2),encoding='utf8')
