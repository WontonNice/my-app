"""Coordinate-aware handbook PDF capture.

This adapter keeps the original page/box and font evidence.  It intentionally
does not use OCR, guess absent answer keys, or flatten questions to screenshots.
The 2024-2025 Form B profile is a reviewed manifest for the supplied source.
Run with --source, --answers, --output; both PDFs remain read-only.
"""
from __future__ import annotations
import argparse
import collections
import hashlib
import html
import json
import pathlib
import re
import shutil
import subprocess
import sys
import pdfplumber
from PIL import Image

FORMAT = "nathan-tutors-official-passage-v1"
FAMILY = "official_shsat"
SOURCE_ID = "official-shsat-2024-2025-form-b"
PROFILE_HASHES = {'questions':'aebbd975f676fc98f3917952aa7da4b66da2302136245f55d2c9415e8f6aabf7','answers':'5fc3589bd031de55e3bb6819765416f6d428ee932ffc5cff349bc2330b00e36e'}

# The source's subset fonts map several visible Latin glyphs into private-use
# Unicode. These mappings are source-font-specific and were checked in rendered
# pages; applying a global PUA replacement would silently corrupt other fonts.
GLYPHS = {
    "UZALZK": {0xE010:"R",0xE019:"E",0xE08E:"L",0xE092:"S",0xE014:"A",0xE01A:"U",0xE01C:"T",0xE01B:"I",0xE01E:"O",0xE01D:"N"},
    "QQZNWM": {0xE01C:"T",0xE019:"E",0xE01B:"I",0xE00D:"S"},
    "DPNPYG": {0xE00A:"B",0xE019:"C"},
    "HQRXWG": {0xE002:"B",0xE001:"C"},
}

def visible(c):
    color = c.get("non_stroking_color")
    white = color == 1 or color == (1,) or isinstance(color, (tuple,list)) and len(color) >= 3 and all(v >= .985 for v in color[:3])
    return not white and 35 <= c.get("top", 0) < 735

def decode(c):
    table = GLYPHS.get(c.get("fontname", "").split("+")[0], {})
    return "".join(table.get(ord(s), s) for s in c["text"]).replace("ﬁ", "fi").replace("ﬂ", "fl")

def contained(c, box, pad=0):
    x0,y0,x1,y1=box
    return c["x0"]>=x0-pad and c["x1"]<=x1+pad and c["top"]>=y0-pad and c["bottom"]<=y1+pad

def fraction_chars(chars):
    """Recover editable fractions from the PDF's positioned numerator/bar/denominator."""
    chars=[dict(c, text=decode(c)) for c in chars]
    removed=set(); added=[]
    for i,bar in enumerate(chars):
        if bar["text"]!="_": continue
        candidates=[(j,c) for j,c in enumerate(chars) if j!=i and c["text"].strip() and c["x0"]>=bar["x0"]-.6 and c["x1"]<=bar["x1"]+.6 and bar["top"]-10<c["top"]<bar["top"]+22]
        num=[(j,c) for j,c in candidates if c["top"]<bar["top"]+3]
        den=[(j,c) for j,c in candidates if c["top"]>bar["top"]+5]
        if not num or not den: continue
        def raw(items): return "".join(c["text"] for _,c in sorted(items,key=lambda t:t[1]["x0"]))
        numerator,denominator=raw(num),raw(den)
        removed.update([i]+[j for j,_ in num+den])
        added.append(dict(bar,text="\\(\\frac{"+numerator+"}{"+denominator+"}\\)",top=bar["top"]+4.2,bottom=bar["top"]+4.2+bar["size"],fontname="math",math=True))
    return [c for i,c in enumerate(chars) if i not in removed]+added

def lines_for(chars):
    chars=fraction_chars(chars)
    lines=[]
    for c in sorted(chars,key=lambda c:(c["top"],c["x0"])):
        if not c["text"].strip(): continue
        candidates=[line for line in lines if abs(line["baseline"]-c["bottom"])<3.2 or abs(line["top"]-c["top"])<3]
        if candidates:
            line=min(candidates,key=lambda line:abs(line["baseline"]-c["bottom"]))
            line["chars"].append(c)
            if c["size"]>=9.8: line["baseline"]=max(line["baseline"],c["bottom"])
            line["top"]=min(line["top"],c["top"])
            line["bottom"]=max(line["bottom"],c["bottom"])
        else: lines.append({"top":c["top"],"bottom":c["bottom"],"baseline":c["bottom"],"chars":[c]})
    return sorted(lines,key=lambda l:l["top"])

def line_markup(line):
    chars=sorted(line["chars"],key=lambda c:c["x0"])
    fragments=[]; plain=[]; prev=None; active=None; run=""
    def flush():
        nonlocal run
        if not run:return
        value=html.escape(run)
        if active:
            for tag in active: value=f"<{tag}>{value}</{tag}>"
        fragments.append(value);run=""
    for c in chars:
        # Duplicate positioned text can occur in vector labels.
        if prev and abs(prev["x0"]-c["x0"])<.2 and abs(prev["top"]-c["top"])<.2 and prev["text"]==c["text"]:continue
        gap=c["x0"]-prev["x1"] if prev else 0
        if prev and gap>1.2:
            run+=" ";plain.append(" ")
        font=c.get("fontname","").lower();tags=[]
        if "bold" in font:tags.append("strong")
        if "italic" in font or "oblique" in font:tags.append("em")
        if c["size"]<8.4 and c["bottom"]<line["baseline"]-2.5:tags.append("sup")
        key=tuple(tags)
        if key!=active:flush();active=key
        run+=c["text"];plain.append(c["text"]);prev=c
    flush()
    markup="".join(fragments)
    markup=re.sub(r"</(strong|em)>\s*<\1>", "", markup)
    return "".join(plain),markup

def rich_block(chars, boxes=(), poem=False, paragraph_tops=()):
    lines=lines_for(chars)
    spacings=[b["top"]-a["top"] for a,b in zip(lines,lines[1:]) if 10<=b["top"]-a["top"]<=26]
    paragraph_gap=(collections.Counter(round(v) for v in spacings).most_common(1)[0][0]+4) if spacings else 20
    blocks=[]; current=[]; text=[]; previous=None; current_box=None
    def flush():
        nonlocal current
        if not current:return
        joiner="<br>" if poem else " "
        body=joiner.join(t[1] for t in current)
        if current_box is not None:
            body=re.sub(r' (?=\(\d+\) )','<br>',body)
        tag="div" if poem else "p"
        if current_box is not None:blocks.append('<blockquote data-boxed="true">'+body+'</blockquote>')
        else:blocks.append(f"<{tag}>{body}</{tag}>")
        text.append(("\n" if poem else " ").join(t[0] for t in current));current=[]
    for line in lines:
        box=next((i for i,b in enumerate(boxes) if b[1]-.5<=line["top"] and line["bottom"]<=b[3]+.5),None)
        gap=line["top"]-previous["top"] if previous else 0
        forced_break=any(abs(line['top']-top)<4 for top in paragraph_tops)
        if previous and (forced_break or box!=current_box or gap>(19 if poem else paragraph_gap)):
            flush()
        current_box=box;current.append(line_markup(line));previous=line
    flush()
    return "\n\n".join(text),"".join(blocks)

def page_words(page):
    return page.filter(visible).extract_words(x_tolerance=2,y_tolerance=2)

def question_regions(pdf):
    regions={}
    for page_index,page in enumerate(pdf.pages):
        starts=[]
        for w in page_words(page):
            if re.fullmatch(r"\d{1,3}\.",w["text"]) and (abs(w["x0"]-48)<2 or abs(w["x0"]-318)<2):
                n=int(w["text"][:-1])
                if 1<=n<=114:starts.append((n,w))
        for n,w in starts:
            right=w["x0"]>300
            nxt=[v["top"] for k,v in starts if (v["x0"]>300)==right and v["top"]>w["top"]+5]
            end=min(nxt)-22 if nxt else 735
            regions[n]={"page":page_index+1,"box":[w["x0"],w["top"]-7,564 if n<58 or right else 294,end],"numberBox":[w["x0"]-1,w["top"]-1,w["x1"]+1,w["bottom"]+1]}
    return regions

def source_graphics(page,box):
    # The handbook embeds each diagram/chart as a white-backed PDF group.
    out=[]
    for r in page.rects:
        b=[r["x0"],r["top"],r["x1"],r["bottom"]]
        if r["fill"] and r["width"]>30 and r["height"]>18 and r["width"]<500 and contained(r,box,1):
            if not any(b[0]>=p[0] and b[1]>=p[1] and b[2]<=p[2] and b[3]<=p[3] for p in out):out.append(b)
    return out

DIAGRAM_DESCRIPTIONS = {
    'q060-1':'An L-shaped garden. The top horizontal side is 13 cm, the left vertical side is 6 cm, the right upper vertical side is 3 cm, and the lower horizontal side is 8 cm. The inward horizontal and vertical sides are unlabeled.',
    'q062-1':'A triangular prism. One triangular face has a side labeled 4 inches and a perpendicular height labeled 8 inches. The distance between the triangular faces is 2 inches. A right-angle marker identifies the perpendicular height.',
    'q063-1':'Weight of Pole graph. Horizontal axis: length in feet, marked 1 through 4. Vertical axis: weight in ounces, marked 4, 8, 12, 16. A straight line rises from the origin through the marked point (1, 4) and through (4, 16).',
    'q064-1':'A number line marked by ones from −7 to 7. Point E is at −7, F at −2, G at 2, and H at 7.',
    'q075-1':'Daily Fares box plot. Horizontal axis is number of fares, marked from 0 through 32 by twos. The left whisker is at 2, left edge of the box at 12, median at 16, right edge of the box at 24, and right whisker at 32.',
    'q082-1':'A number line with open circles at −1 and 2 and a thick segment between them.',
    'q082-2':'A number line with closed circles at −1 and 2 and a thick segment between them.',
    'q082-3':'A number line with open circles at −1 and 2. Thick rays extend left from −1 and right from 2.',
    'q082-4':'A number line with a closed circle at −1 and an open circle at 2. Thick rays extend left from −1 and right from 2.',
    'q085-1':'Ages of Groups box plots. Group P: minimum 17, first quartile 19, median 24, third quartile 27, maximum 33. Group Q: minimum 15, first quartile 17, median 21, third quartile 26, maximum 29. The horizontal age axis is marked from 15 to 33 in years.',
    'q089-1':'Two circular plates. A dashed diameter across the larger plate is labeled 18 inches; a dashed diameter across the smaller plate is labeled 12 inches.',
    'q096-1':'A closed rectangular prism with dimensions labeled 20 cm high, 40 cm deep, and 50 cm long.',
    'q105-1':'Triangle MNP has N at the top, M at lower left, P at lower right. Sides MN and NP have matching tick marks; base MP is 10 cm. Triangle XYZ has Y at the top, X at lower left, Z at lower right; XY and YZ are each 9 cm, and base XZ is 6 cm.',
    'q109-1':'Box A contains two balls labeled 2 and 6. Box B contains three balls labeled 3, 4, and 5.',
    'q110-1':'A number line with closed circles at −3 and 1. Thick rays extend left from −3 and right from 1.',
    'q110-2':'A number line with closed circles at −1 and 1. Thick rays extend left from −1 and right from 1.',
    'q110-3':'A number line with closed circles at −3 and 1 and a thick segment between them.',
    'q110-4':'A number line with closed circles at −3 and 3. Thick rays extend left from −3 and right from 3.',
}

def crop_asset(source,page,box,out,name,description):
    pages=out/"pages";pages.mkdir(exist_ok=True)
    cache_name='answer' if 'answers' in source.name else 'source'
    file=pages/f"{cache_name}-{page:02}.png"
    if not file.exists():
        subprocess.run(["pdftoppm","-f",str(page),"-l",str(page),"-r","180","-png",str(source),str(pages/cache_name)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    im=Image.open(file);scale=im.width/612
    crop=im.crop(tuple(round(v*scale) for v in (box[0]-1,box[1]-1,box[2]+1,box[3]+1)))
    asset=out/"assets"/(name+".png");asset.parent.mkdir(exist_ok=True);crop.save(asset)
    return {"src":"/exam-images/"+asset.name,"alt":description}, {"sourcePage":page,"sourceBox":box,"file":str(asset.resolve()),"url":"/exam-images/"+asset.name,"sha256":hashlib.sha256(asset.read_bytes()).hexdigest()}

def insert_graphics(chars, graphics, page_num, source, out, prefix, assets, visuals):
    result=[c for c in chars if not any(contained(c,b,1) for b in graphics)]
    for i,b in enumerate(graphics):
        labels=[c for c in chars if contained(c,b,1)]
        label_text,_=rich_block(labels)
        description=DIAGRAM_DESCRIPTIONS.get(f'{prefix}-{i+1}',"Source diagram"+(": "+label_text if label_text else ""))
        image,manifest=crop_asset(source,page_num,b,out,f"pdf-2024-2025-form-b-{prefix}-figure-{i+1}",description)
        assets.append(manifest)
        visuals.append({"sourceFile":source.name,"sourcePage":page_num,"location":b,"description":description,"state":"resolved","image":image})
        result.append({"text":f"@@ASSET{len(assets)-1}@@","fontname":"image","size":10,"x0":b[0],"x1":b[2],"top":b[1],"bottom":b[1]+10,"asset":image})
    return result

def assets_markup(value, assets, visuals):
    def subst(m):
        asset=assets[int(m.group(1))]; visual=next(v for v in visuals if v["image"]["src"]==asset["url"])
        return source_image_markup(asset,visual["description"])
    return re.sub(r"@@ASSET(\d+)@@",subst,value)

def source_image_markup(asset,description):
    # Source rectangles use PDF points (72/in), independent of the retained
    # 180-DPI bitmap. A CSS width keeps diagrams at their intended physical
    # size instead of enlarging them to the high-resolution pixel dimensions.
    width=round((asset['sourceBox'][2]-asset['sourceBox'][0]+2)*96/72)
    return '<img src="'+asset['url']+'" width="'+str(width)+'" alt="'+html.escape(description,quote=True)+'">'

def answer_key(pdf):
    text=pdf.pages[-1].extract_text()
    key={int(n):ans for n,ans in re.findall(r"\b(\d{1,3})\.(-?\d+(?:\.\d+)?|[A-H])\b",text)}
    if set(key)!=set(range(1,115)):raise ValueError("Supplied answer key does not cover 1–114 exactly")
    return key

PASSAGES = [
    {"title":"Find Time to Volunteer","format":"sentence_prose","range":[5,9],"pages":[[7,179,560]],"glossary":{"Mayo Clinic":"a nonprofit medical organization dedicated to treatment and research"}},
    {"title":"Moving through Mountains","format":"sentence_prose","range":[10,15],"pages":[[11,105,475]]},
    {"title":"Excerpt from “How Exercise Could Help You Learn a New Language”","author":"Gretchen Reynolds","range":[16,22],"pages":[[15,153,689],[16,76,498]],"notes":[[16,520,545]],"glossary":{"linguists":"scientists who study language"}},
    {"title":"Excerpt from Do Them No Harm!","author":"Zoa L. Swayne","range":[23,31],"pages":[[21,185,672],[22,76,646]],"blurb":[21,76,102],"notes":[[22,668,702]],"glossary":{"camas":"a wild, edible plant"}},
    {"title":"Invention of the Telegraph","range":[32,40],"pages":[[27,180,651],[28,76,412]],"blurb":[27,76,142],"notes":[[28,434,446]],"figurePages":[29],"glossary":{"legislation":"Telegraph Bill","dots-and-dashes method":"the short and long pulses of Morse code that are sent and received by telegraph operators"}},
    {"title":"Snowy Mountains","author":"John Gould Fletcher","format":"poem","range":[41,49],"pages":[[33,133,498]],"notes":[[33,520,533]]},
    {"title":"Excerpt from “The Past and the Future of the Earth’s Oldest Trees”","author":"Alex Ross","range":[50,57],"pages":[[37,153,683],[38,76,322]],"notes":[[38,344,368]],"glossary":{"spatial":"relating to physical space","anomaly":"oddity","wraithlike":"ghostly","spate":"sudden abundance"}},
]

def page_part(pdf,n,y0,y1,numbered=False,poem=False):
    chars=[c for c in pdf.pages[n-1].chars if visible(c) and contained(c,[46,y0,566,y1],1)]
    paragraph_tops=[]
    if numbered:
        if not poem:
            paragraph_tops=[w['top'] for w in page_words(pdf.pages[n-1]) if w['text'].isdigit() and w['x0']<65 and y0-1<=w['top']<=y1]
        # Paragraph/line markers are gutter labels; the player generates them.
        chars=[c for c in chars if not (c["x0"]<65 and c["text"].strip().isdigit())]
    # Footnote markers are represented by real accessible vocabulary popups.
    chars=[c for c in chars if not (c["size"]<8 and c["text"].strip().isdigit())]
    return rich_block(chars,poem=poem,paragraph_tops=paragraph_tops)

def passage_objects(pdf,questions,source,out,assets):
    objects=[]
    objects.append({"title":"2024-2025 Form B — Revising/Editing Part A","format":"prose","passageType":"informational","passageCategory":"official_handbook","section":"revising_editing_a","label":"2024-2025 Form B","versionLabel":"2024-2025 Form B","text":"","richText":"","questions":questions[:4],"review":{"sourceFile":source.name,"sourcePages":[3,4,5],"expectedQuestionCount":4}})
    for spec in PASSAGES:
        texts=[];markups=[];visuals=[]
        for i,(n,y0,y1) in enumerate(spec["pages"]):
            text,markup=page_part(pdf,n,y0,y1,numbered=spec.get("format")!="sentence_prose",poem=spec.get("format")=="poem")
            if i and spec["title"].endswith('Oldest Trees”'):
                texts[-1]+=" "+text.split("\n\n",1)[0]
                remainder=text.split("\n\n",1)
                texts.append(remainder[1] if len(remainder)>1 else "")
                first=re.match(r"<p>(.*?)</p>(.*)",markup,re.S)
                if first:
                    markups[-1]=markups[-1][:-4]+" "+first[1]+"</p>";markups.append(first[2])
                else:markups.append(markup)
            else:texts.append(text);markups.append(markup)
        rich="".join(markups);text="\n\n".join(t for t in texts if t)
        rich=re.sub(r'<p><strong>([^<]+)</strong></p>',r'<h3>\1</h3>',rich)
        for term,definition in spec.get("glossary",{}).items():
            token='<span data-glossary-definition="'+html.escape(definition,quote=True)+'" role="link" tabindex="0">'+html.escape(term)+'</span>'
            if html.escape(term) not in rich:raise ValueError(f"Missing glossary term {term}")
            rich=rich.replace(html.escape(term),token,1)
        for n in spec.get("figurePages",[]):
            # Source page contains two distinct graphics with their own titles,
            # units, legends, dates and attribution. Keep both attached to text.
            for index,box in enumerate([[47,78,566,347],[47,386,566,625]]):
                label="British All-Red Telegraph Line, 1902 map" if index==0 else "Telegraph messages transmitted, 1870–1920 graph"
                image,manifest=crop_asset(source,n,box,out,f"pdf-2024-2025-form-b-telegraph-{index+1}",label)
                assets.append(manifest);visuals.append({"sourceFile":source.name,"sourcePage":n,"location":box,"state":"resolved","description":label,"image":image})
                rich+='<p data-numbered="false">'+source_image_markup(manifest,label)+'</p>'
                caption_text,caption_html=page_part(pdf,n,350 if index==0 else 630,376 if index==0 else 652)
                rich+=caption_html.replace('<p>','<p data-numbered="false">')
                text+='\n\n'+caption_text
        start,end=spec["range"]
        blurb=page_part(pdf,*spec["blurb"])[0] if spec.get("blurb") else ""
        note="\n".join(page_part(pdf,*part)[0] for part in spec.get("notes",[]))
        sourcepages=[p[0] for p in spec["pages"]]+spec.get("figurePages",[])
        title_page,title_y0,title_y1={5:(7,150,169),10:(11,76,95),16:(15,76,115),23:(21,128,148),32:(27,150,170),41:(33,76,95),50:(37,76,115)}[start]
        title_html=page_part(pdf,title_page,title_y0,title_y1)[1].removeprefix('<p>').removesuffix('</p>')
        objects.append({"title":spec["title"],"titleHtml":title_html,"author":spec.get("author",""),"byline":"by "+spec["author"] if spec.get("author") else "","blurb":blurb,"blurbHtml":page_part(pdf,*spec['blurb'])[1] if spec.get('blurb') else '',"format":spec.get("format","prose"),"passageType":"poem" if spec.get("format")=="poem" else "literary" if start==23 else "informational","passageCategory":"official_handbook","section":"revising_editing_a" if spec.get("format")=="sentence_prose" else "reading","label":"2024-2025 Form B","versionLabel":"2024-2025 Form B","sourceNote":note,"sourceNoteHtml":''.join(page_part(pdf,*part)[1] for part in spec.get('notes',[])),"teacherSource":"2024-2025 official SHSAT handbook, Form B","text":text,"richText":rich,"questions":questions[start-1:end],"visuals":visuals,"review":{"sourceFile":source.name,"sourcePages":sourcepages,"printedPages":[p+156 for p in sourcepages],"expectedQuestionCount":end-start+1,"warnings":[],"sourceReviewed":False,"completenessReviewed":True},"provenance":{"sourceFamily":FAMILY,"sourceFormat":"pdf","playerProfile":"testnav","examId":SOURCE_ID,"examYear":"2024-2025","form":"B","sourcePages":sourcepages}})
    return objects

def table(caption,headers,rows):
    return '<table><caption>'+html.escape(caption)+'</caption><thead><tr>'+''.join('<th scope="col">'+html.escape(t)+'</th>' for t in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+html.escape(str(v))+'</td>' for v in row)+'</tr>' for row in rows)+'</tbody></table>'

def reviewed_math_repairs(questions):
    """Explicit reviewed source transcription for nested math and native tables.

    These are presentation repairs, never answer inference. The original source
    coordinates remain on every question for future side-by-side verification.
    """
    by={int(q['review']['sourceQuestion']):q for q in questions}
    def prompt(n,text):by[n]['prompt']=text;by[n]['promptHtml']='<p>'+html.escape(text)+'</p>'
    def choice(n,i,text):by[n]['choices'][i]['text']=text;by[n]['choices'][i]['html']='<p>'+html.escape(text)+'</p>'
    prompt(81,r'What is the value of \(\frac{\left(1\frac{5}{7}-1\frac{6}{7}\right)}{\left(3\frac{4}{7}-3\frac{6}{7}\right)}\)?')
    for i,tex in enumerate([r'-1.18',r'-1.\overline{118}',r'-1.\overline{18}',r'-1.\overline{81}']):choice(79,i,'\\('+tex+'\\)')
    for i,tex in enumerate([r'\frac{0.005}{100}',r'\frac{\frac{1}{2}}{100}',r'\frac{5}{1,000}',r'\frac{1}{200}']):choice(99,i,'\\('+tex+'\\)')
    for i,tex in enumerate([r'x^{2}y',r'xy^{2}',r'-x^{2}y',r'-xy^{2}']):choice(114,i,'\\('+tex+'\\)')
    for n,caption,headers,rows,before,after in [
        (76,'WATER STATIONS IN RACES',['Length of Race (mi)','Number of Water Stations'],[[3,2],[12,8],[18,12]],'Serena was studying the number of water stations for different lengths of races. The table below shows the data she collected.','Which equation represents the relationship between the length of the race, <em>x</em> miles, and the number of water stations, <em>y</em>?'),
        (77,'SURVEY RESULTS',['Opinion','Number of Residents'],[['Yes',142],['No',38],['Undecided',20]],'Centerville will hold a vote on whether to build a new park. The town council surveyed a random sample of 200 residents to determine whether they would be in favor of building this park. The table shows the results of the survey.','The mayor estimates that half the undecided voters will vote in favor of building the park. Based on the survey results, if the mayor is correct, how many of the 24,100 voters will be in favor of building the park?'),
        (87,'GIA’S MIX',['Snack','Number in Bag'],[['Pretzels',12],['Raisins',9]],'','Gia and her friends counted the numbers of pretzels and raisins in their snack mix. The table above shows the numbers in Gia’s mix. Which other mix has a ratio of pretzels to raisins in the same proportional relationship as Gia’s mix?')]:
        by[n]['promptHtml']=('<p>'+before+'</p>' if before else '')+table(caption,headers,rows)+'<p>'+after+'</p>'
    for i,(name,p,r) in enumerate([('ADELE’S MIX',6,18),('CARL’S MIX',15,12),('ISABEL’S MIX',18,15),('TREVON’S MIX',16,12)]):
        by[87]['choices'][i]['html']=table(name,['Snack','Number in Bag'],[['Pretzels',p],['Raisins',r]])

SCANNED_EXPLANATIONS = {
    1: ('The question asks for the best way to combine the sentences.\n\n'
        'A. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. The sentence incorrectly uses “but tourists,” and “which cost” modifies “the space station” but does not modify the trip. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.\n\n'
        'B. CORRECT. The option uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. In the first part of the sentence, the conjunction “and” correctly joins the first and second sentences by indicating a relationship, rather than a contrast, between the two. In the second part of the sentence, the conjunction “but” adds additional emphasis to the fact that while tourists will be allowed to visit the space station, the cost of the trip will likely prohibit most people from visiting.\n\n'
        'C. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.\n\n'
        'D. Incorrect. The combination of the sentences creates an illogical relationship between ideas with the statement that tourists will be allowed to visit the space station because the cost is $52–$58 million round trip. The connection between the idea that “tourists will soon be allowed to pay for visits” and the subsequent “therefore few people will be able to take advantage of the opportunity” is also illogical.'),
    58:r'(-0.8) First, distribute \(\frac{3}{5}\) over (2x + 5) to get the expression \(\frac{6}{5}x+3-2x\). Express −2x as \(-\frac{10}{5}x\) and then add like terms: \(\frac{6}{5}x+3+\left(-\frac{10}{5}x\right)=-\frac{4}{5}x+3\). The coefficient of x is \(-\frac{4}{5}\). When expressed as a decimal, \(-\frac{4}{5}=-0.8\).',
    59:'(5) There will be 5 different outcomes with a sum of 6:\n1 + 5 = 6\n2 + 4 = 6\n3 + 3 = 6\n4 + 2 = 6\n5 + 1 = 6',
    60:r'(95) First, find the perimeter of the figure. Two sides do not have labels. The top of the figure measures 13 cm and the bottom shows a length measuring 8 cm, so the horizontal side without a label measures 5 cm (13 − 8). The left side of the figure measures 6 cm and the right side shows a length measuring 3 cm, so the vertical side without a label measures 3 cm (6 − 3). So the total perimeter of the scale drawing is 13 + 3 + 5 + 3 + 8 + 6 = 38 cm. Use the scale to find the perimeter of the actual garden: \(38\text{ cm}\times\frac{2.5\text{ m}}{1\text{ cm}}=95\text{ m}\).',
}

def attach_explanations(pdf,source,questions,out,assets):
    found={}
    for index,page in enumerate(pdf.pages[:-1]):
        words=page_words(page)
        starts=[w for w in words if re.fullmatch(r'\d{1,3}\.',w['text']) and (abs(w['x0']-48)<2 or abs(w['x0']-318)<2)]
        for w in starts:
            n=int(w['text'][:-1])
            if not 1<=n<=114:continue
            right=w['x0']>300
            next_top=min([v['top'] for v in starts if (v['x0']>300)==right and v['top']>w['top']+5],default=753)
            box=[w['x0'],w['top']-10,564 if n<58 or right else 294,next_top-18 if next_top<753 else 735]
            chars=[c for c in page.chars if visible(c) and contained(c,box,1)]
            text,markup=rich_block(chars)
            if chars:box[3]=min(735,max(c['bottom'] for c in chars)+2)
            found[n]=(index+1,box,text,markup)
    for n,page,box in [(1,1,[47,170,564,522]),(58,33,[47,136,294,373]),(59,33,[47,421,294,576]),(60,33,[317,133,564,731])]:
        text=SCANNED_EXPLANATIONS[n]
        found[n]=(page,box,text,'<p>'+html.escape(text).replace('\n\n','</p><p>').replace('\n','<br>')+'</p>')
    if set(found)!=set(range(1,115)):raise ValueError('Incomplete explanations')
    for q in questions:
        n=int(q['review']['sourceQuestion']);page,box,text,markup=found[n]
        # Explanations refer to printed E–H labels; align those references with
        # the player's normalized A–D labels while retaining source in review.
        for old,new in zip('EFGH','ABCD'):
            text=re.sub(r'(?<!\w)'+old+r'(?=\.|\))',new,text)
            markup=re.sub(r'(?<!\w)'+old+r'(?=\.|\))',new,markup)
        q['explanation']=re.sub(r'^'+str(n)+r'\.\s*','',text)
        q['explanationHtml']=re.sub(r'(<p>)'+str(n)+r'\.\s*',r'\1',markup,count=1)
        q['review']['explanationSource']={'sourceFile':source.name,'sourcePages':[page],'sourceBox':box}
        if n==1 or n>=58:
            description=f'Official handbook explanation for source question {n}; original paper answer labels are preserved in this source facsimile.'
            image,manifest=crop_asset(source,page,box,out,f'pdf-2024-2025-form-b-explanation-q{n:03}',description)
            assets.append(manifest)
            q['sourceExplanationHtml']='<p>'+source_image_markup(manifest,description)+'</p>'
            q['review']['explanationSource']['image']=image

def convert(source,answers,out):
    for kind,path in [('questions',source),('answers',answers)]:
        if hashlib.sha256(path.read_bytes()).hexdigest()!=PROFILE_HASHES[kind]:
            raise ValueError('This PDF does not match the reviewed 2024-2025 Form B profile. Create and review a new layout profile; do not reuse source-specific page boundaries or glyph mappings.')
    out.mkdir(parents=True,exist_ok=True)
    with pdfplumber.open(source) as pdf, pdfplumber.open(answers) as answer_pdf:
        regions=question_regions(pdf);keys=answer_key(answer_pdf)
        if set(regions)!=set(range(1,115)):raise ValueError("Question inventory mismatch: "+repr(sorted(set(range(1,115))-set(regions))))
        (out/"regions.json").write_text(json.dumps(regions,indent=2),encoding="utf-8")
        assets=[];questions=[]
        for n,region in sorted(regions.items()):
            page=pdf.pages[region["page"]-1];box=region["box"]
            chars=[c for c in page.chars if visible(c) and contained(c,box,1) and not contained(c,region["numberBox"],1)]
            choices=[w for w in page_words(page) if re.fullmatch(r"[A-H]\.",w["text"]) and contained(w,box,1) and abs(w["x0"]-(348 if box[0]>300 else 78))<2]
            boxes=[[r["x0"],r["top"],r["x1"],r["bottom"]] for r in page.rects if r["stroke"] and r["width"]>100 and contained(r,box,1)]
            graphics=source_graphics(page,box);visuals=[]
            chars=fraction_chars(insert_graphics(chars,graphics,region["page"],source,out,f"q{n:03}",assets,visuals))
            prompt_end=min([w["top"]-8 for w in choices],default=735)
            prompt_chars=[c for c in chars if c["top"]<prompt_end]
            prompt,prompt_html=rich_block(prompt_chars,boxes)
            choices_out=[]
            for i,w in enumerate(choices):
                end=choices[i+1]["top"]-8 if i+1<len(choices) else (560 if n==114 else box[3])
                cs=[c for c in chars if c["top"]>=w["top"]-8 and c["top"]<end and not (c["x0"]>=w["x0"]-1 and c["x1"]<=w["x1"]+1 and abs(c["top"]-w["top"])<2)]
                text,markup=rich_block(cs)
                choices_out.append({"id":"ABCD"[i],"text":re.sub(r"@@ASSET\d+@@","Source diagram",text),"html":assets_markup(markup,assets,visuals)})
            q={"id":f"pdf-shsat-2024-2025-b-q{n:03}","type":"grid_in" if 58<=n<=62 else "multiple_choice","topic":"","subtopic":"","points":1,"prompt":re.sub(r"@@ASSET\d+@@","Source diagram",prompt),"promptHtml":assets_markup(prompt_html,assets,visuals),"choices":choices_out,"explanation":"","review":{"sourceFile":source.name,"sourcePages":[region["page"]],"printedPages":[region["page"]+156],"sourceQuestion":str(n),"sourceChoiceIds":[w["text"][0] for w in choices],"answerSource":{"sourceFile":answers.name,"sourcePages":[53]},"expectedChoiceCount":0 if 58<=n<=62 else 4,"warnings":[],"sourceReviewed":False,"classificationReviewed":False,"completenessReviewed":True},"visuals":visuals,"provenance":{"sourceFamily":FAMILY,"sourceFormat":"pdf","playerProfile":"testnav","examId":SOURCE_ID,"examYear":"2024-2025","form":"B","sourceQuestion":str(n),"sourcePage":region["page"],"sourceBox":box}}
            if q["type"]=="grid_in":q["correctTextAnswers"]=[keys[n]]
            else:
                if len(choices)!=4:raise ValueError(f"Question {n}: {len(choices)} choices")
                q["correctChoiceId"]="ABCD"[[w["text"][0] for w in choices].index(keys[n])]
            questions.append(q)
        reviewed_math_repairs(questions)
        attach_explanations(answer_pdf,answers,questions,out,assets)
        result={"format":FORMAT,"source":{"sourceFamily":FAMILY,"sourceFormat":"pdf","playerProfile":"testnav","examId":SOURCE_ID,"title":"2024-2025 Form B","year":"2024-2025","form":"B","sourceFile":source.name,"sourceSha256":hashlib.sha256(source.read_bytes()).hexdigest(),"answerFile":answers.name,"answerSha256":hashlib.sha256(answers.read_bytes()).hexdigest()},"passages":[],"mathQuestions":[q for q in questions if int(q["review"]["sourceQuestion"])>=58],"review":{"sourceFile":source.name,"sourcePages":list(range(1,60)),"expectedQuestionCount":114,"warnings":[]}}
        result['passages']=passage_objects(pdf,questions,source,out,assets)
        result['source']['documents']=[{'kind':'questions','localPath':str(source.resolve()),'sha256':result['source']['sourceSha256']},{'kind':'answers','localPath':str(answers.resolve()),'sha256':result['source']['answerSha256']}]
        result['source']['sectionOrder']=[{'title':'Revising/Editing — independent questions','questions':[q['id'] for q in questions[:4]]},{'title':'Revising/Editing — passages','questions':[q['id'] for q in questions[4:15]]},{'title':'Reading','questions':[q['id'] for q in questions[15:57]]},{'title':'Mathematics','questions':[q['id'] for q in questions[57:]]}]
        return result,questions,assets,pdf,answer_pdf

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source",required=True,type=pathlib.Path);parser.add_argument("--answers",required=True,type=pathlib.Path);parser.add_argument("--output",required=True,type=pathlib.Path)
    args=parser.parse_args();result,questions,assets,_,_=convert(args.source,args.answers,args.output)
    for name,obj in [("import.json",result),("all-questions.json",questions),("assets.json",assets)]:
        (args.output/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps({"questions":len(questions),"mathQuestions":len(result["mathQuestions"]),"assets":len(assets)}))

if __name__=="__main__":main()
