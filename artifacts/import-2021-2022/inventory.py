import pathlib,json,hashlib,pdfplumber
OUT=pathlib.Path(__file__).parent
ROOT=OUT.parents[1]
files=['20212022_form_a.pdf','20212022_form_b.pdf','20212022_form_a_-_answers.pdf','20212022_form_b_-_answers.pdf']
inventory=[]
for name in files:
 p=pathlib.Path('C:/Users/Nathan Im/Downloads')/name
 with pdfplumber.open(p) as pdf:
  pages=[]
  for i,page in enumerate(pdf.pages):
   t=page.extract_text(layout=False,x_tolerance=2,y_tolerance=2) or ''
   pages.append(dict(page=i+1,width=page.width,height=page.height,text=t))
  (OUT/(name+'.text.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf8')
  (OUT/(name+'.txt')).write_text('\n\n'.join('=== PDF PAGE '+str(p['page'])+' ===\n'+p['text'] for p in pages),encoding='utf8')
  inventory.append(dict(file=name,pages=len(pages),sha256=hashlib.sha256(p.read_bytes()).hexdigest()))
  print(name,len(pages))
  for pg in pages: print(pg['page'],pg['text'][:125].replace('\n',' | '))
(OUT/'source-inventory.json').write_text(json.dumps(inventory,indent=2),encoding='utf8')
