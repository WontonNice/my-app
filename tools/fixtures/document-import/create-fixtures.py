"""Original fictional source documents, dedicated to the public domain for QA.
Run with reportlab + pypdf. No user or third-party educational source is copied.
"""
import json
from pathlib import Path
from reportlab.pdfgen import canvas
from pypdf import PdfReader

root = Path(__file__).parent
passages = [
    dict(title="The Seed Ledger", author="Mira Vale", format="prose", passageType="literary",
         text='''1. Ada wrote, "Seven seeds; no more."\n\n2. Her ledger said: 7 + 5 = 12.\n\n3. On Tuesday, she counted again. The unusual label read "seed's here."''',
         prompts=["1. Which entry supports Ada's count?", "2. What does the ledger contain?", "3. Why does Ada return?"], pages=[1, 2]),
    dict(title="At the Gate", author="Jon Reed", format="poem", passageType="poem",
         text='The gate stood still,\n  the rain came through;\n\nI kept one seed,\nand planted two.',
         prompts=["4. Which phrase creates an image?", "5. What is the speaker's tone?"], pages=[3]),
    dict(title="Water Watch", author="N. Shore", format="prose", passageType="informational",
         text='Measuring rain\n\nThe class recorded rainfall in millimeters (mm).\n\nDay | Rain (mm)\nMon | 2\nTue | 5\n\nNote 1: Measurements were taken at noon.',
         prompts=["6. Which day had 5 mm of rain?", "7. What does Note 1 explain?"], pages=[4]),
]
payload = {"format": "nathan-tutors-official-passage-v1", "passages": [], "mathQuestions": []}
c = canvas.Canvas(str(root / "questions.pdf"), pagesize=(612, 792))
def line(text, y, size=12):
    c.setFont("Helvetica", size); c.drawString(50, y, text)
def question(prompt, y):
    line(prompt, y)
    for i, label in enumerate(['E', 'F', 'G', 'H']): line(f"{label}. Source choice {label}: {i + 1} units.", y - 22 * (i + 1))
for pi, passage in enumerate(passages):
    line(passage['title'], 744, 18); line('by ' + passage['author'], 720)
    parts = passage['text'].split('\n')
    for i, text in enumerate(parts if pi else parts[:3]): line(text, 685-i*19)
    if pi == 0:
        question(passage['prompts'][0], 525)
        c.showPage(); line('The Seed Ledger (continued)', 744, 16)
        line(parts[-1], 710)
        for qi, prompt in enumerate(passage['prompts'][1:]): question(prompt, 660-qi*145)
    else:
        for qi, prompt in enumerate(passage['prompts']): question(prompt, 450-qi*145)
    if pi == 2:
        c.rect(405, 530, 110, 90); line('Rain gauge', 548); c.line(440, 530, 440, 602)
    c.showPage()
    out = {k:v for k,v in passage.items() if k not in ['prompts','pages']}
    out.update(section='reading', passageCategory='miscellaneous', sourceNote='', teacherSource='Original QA fixture, public domain', versionLabel='', blurb='', label='', questions=[], review=dict(sourceFile='questions.pdf',sourcePages=passage['pages'],expectedQuestionCount=len(passage['prompts'])), visuals=[])
    for qi, prompt in enumerate(passage['prompts']):
        number = prompt.split('.')[0]
        known = number != '5'
        out['questions'].append(dict(id=f'fixture-q{number}',type='multiple_choice',topic='Evidence & Support',points=1,prompt=prompt,
            choices=[dict(id=label,text=f'Source choice {label}: {i+1} units.') for i,label in enumerate(['E','F','G','H'])],
            correctChoiceId='F' if known else '',explanation=f'Source explanation {number}: the recorded detail is sufficient.' if known else '',
            review=dict(sourceFile='questions.pdf',sourcePages=passage['pages'],sourceQuestion=number,topicSource='inferred',topicConfidence=0.45 if number=='5' else 0.93,expectedChoiceCount=4,
                answerSource=dict(sourceFile='answers.pdf',sourcePages=[1]) if known else None,
                explanationSource=dict(sourceFile='explanations.pdf',sourcePages=[1]) if known else None),visuals=[]))
    if pi == 2:
        out['questions'][0]['visuals']=[dict(scope='Question 6',questionId='fixture-q6',sourceFile='questions.pdf',sourcePage=4,location='right, above questions',description='Rain gauge rectangle and vertical measurement line.',state='unresolved')]
        out['visuals']=[dict(scope='Passage',sourceFile='questions.pdf',sourcePage=4,location='below Measuring rain',description='Two-row rainfall table: Mon 2 mm; Tue 5 mm.',state='unresolved')]
    payload['passages'].append(out)
c.save()
for filename, heading, explanation in [('answers.pdf','Answer Key',False),('explanations.pdf','Explanation Guide',True)]:
    c=canvas.Canvas(str(root/filename),pagesize=(612,792));line(heading,744,18)
    for i,number in enumerate([1,2,3,4,6,7]):
        line(f'Source explanation {number}: the recorded detail is sufficient.' if explanation else f'{number}. F',710-i*35)
    line('Question 5: no key or explanation provided.',450);c.save()
(root/'expected-import.json').write_text(json.dumps(payload,indent=2,ensure_ascii=False),encoding='utf-8')
observed={name:[page.extract_text() for page in PdfReader(root/name).pages] for name in ['questions.pdf','answers.pdf','explanations.pdf']}
(root/'observed-source.json').write_text(json.dumps(observed,indent=2),encoding='utf-8')
for p in payload['passages']:
    source='\n'.join(observed['questions.pdf'])
    assert p['title'] in source and p['author'] in source
    for text in p['text'].split('\n'):
        if text: assert text in source, text
    for q in p['questions']:
        assert q['prompt'] in source
        for choice in q['choices']: assert choice['text'] in source
print('3 original PDFs; 4 question pages; 3 passages; 7 questions; 28 choices verified.')
