"""Focused tests for coordinate fidelity and the complete supplied PDF transfer.

Set PDF_IMPORT_DIR to the generated artifact folder to include source coverage
checks. No source PDF or student's records are mutated by these tests.
"""
import html
import importlib.util
import json
import os
from pathlib import Path
import re
import unittest

spec=importlib.util.spec_from_file_location('pdf_import',Path(__file__).with_name('pdf-source-import.py'))
adapter=importlib.util.module_from_spec(spec);spec.loader.exec_module(adapter)

def char(text,x,y,width=6,size=10,font='VerdanaPro-Regular'):
    return {'text':text,'x0':x,'x1':x+width,'top':y,'bottom':y+size,'size':size,'fontname':font,'non_stroking_color':(0,0,0)}

class LayoutEvidenceTests(unittest.TestCase):
    def test_white_source_identifiers_are_not_student_content(self):
        c=char('hidden',50,80);c['non_stroking_color']=(1.,1.,1.)
        self.assertFalse(adapter.visible(c))
        self.assertTrue(adapter.visible(char('visible',50,80)))

    def test_font_specific_private_glyph_mapping(self):
        c=char('\ue01c',50,80,font='UZALZK+VerdanaPro-Regular')
        self.assertEqual(adapter.decode(c),'T')
        c['fontname']='UnknownFont'
        self.assertEqual(adapter.decode(c),'\ue01c')

    def test_fraction_keeps_numerator_and_denominator_in_one_editable_token(self):
        out=adapter.fraction_chars([char('3',11,98),char('_',10,99.3,8),char('5',11,111.5),char('x',21,103.5)])
        self.assertEqual([c['text'] for c in out if c.get('math')],[r'\(\frac{3}{5}\)'])
        self.assertNotIn('_',[c['text'] for c in out])

    def test_rich_runs_retain_explicit_bold(self):
        text,rich=adapter.rich_block([char('best',10,40,24,font='VerdanaPro-Bold'),char('way',38,40,18)])
        self.assertEqual(text,'best way')
        self.assertIn('<strong>best ',rich)

    def test_boxed_numbered_sentences_keep_breaks(self):
        _,rich=adapter.rich_block([char('(1) First.',10,40,50),char('(2) Second.',10,53,60)],[[8,38,80,65]])
        self.assertIn('data-boxed="true"',rich)
        self.assertIn('<br>(2)',rich)

    def test_high_resolution_diagrams_keep_source_display_width(self):
        markup=adapter.source_image_markup({'url':'/exam-images/diagram.png','sourceBox':[10,20,154,110]},'Source diagram')
        self.assertIn('width="195"',markup)
        self.assertIn('alt="Source diagram"',markup)

@unittest.skipUnless(os.environ.get('PDF_IMPORT_DIR'),'PDF_IMPORT_DIR not supplied')
class FullSourceTransferTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.root=Path(os.environ['PDF_IMPORT_DIR'])
        cls.payload=json.loads((cls.root/'import.json').read_text(encoding='utf-8'))
        cls.questions=[q for p in cls.payload['passages'] for q in p['questions']]+cls.payload['mathQuestions']
        cls.assets=json.loads((cls.root/'assets.json').read_text(encoding='utf-8'))

    def test_all_114_questions_in_exact_original_order(self):
        self.assertEqual([int(q['review']['sourceQuestion']) for q in self.questions],list(range(1,115)))
        self.assertEqual(len({q['id'] for q in self.questions}),114)
        self.assertEqual(len(self.payload['mathQuestions']),57)

    def test_all_keys_come_from_complete_supplied_key(self):
        key_text=json.loads((self.root/'answers-text.json').read_text(encoding='utf-8'))[-1]['text']
        key={int(n):v for n,v in re.findall(r'\b(\d{1,3})\.(-?\d+(?:\.\d+)?|[A-H])\b',key_text)}
        for q in self.questions:
            n=int(q['review']['sourceQuestion'])
            if 58<=n<=62:self.assertEqual(q['correctTextAnswers'],[key[n]])
            else:
                self.assertEqual(len(q['choices']),4)
                self.assertEqual(q['review']['sourceChoiceIds']['ABCD'.index(q['correctChoiceId'])],key[n])

    def test_original_emphasis_boxes_tables_and_equations_survive(self):
        by={int(q['review']['sourceQuestion']):q for q in self.questions}
        self.assertRegex(by[1]['promptHtml'],r'<strong>best\s*</strong>')
        self.assertIn('data-boxed="true"',by[3]['promptHtml'])
        self.assertIn('really long trail',by[3]['promptHtml'])
        self.assertIn('<table>',by[76]['promptHtml'])
        self.assertEqual(sum('<table>' in c['html'] for c in by[87]['choices']),4)
        self.assertIn(r'\frac{\frac{1}{2}}{100}',by[99]['choices'][1]['html'])
        self.assertIn(r'\overline{18}',by[79]['choices'][2]['html'])

    def test_every_asset_is_real_and_addressed_by_manifest(self):
        urls={a['url'] for a in self.assets}
        for asset in self.assets:self.assertTrue(Path(asset['file']).is_file(),asset['file'])
        payload=json.dumps(self.payload,ensure_ascii=False)
        for src in re.findall(r'/exam-images/[^"\\<> ]+\.png',payload):self.assertIn(src,urls)
        self.assertNotIn('@@ASSET',payload)
        for tag in re.findall(r'<img\b[^>]*>',str(self.payload)):
            self.assertRegex(tag,r'width="\d+"')

    def test_no_hidden_glyphs_or_page_chrome(self):
        for q in self.questions:
            content=json.dumps({k:q[k] for k in ['prompt','promptHtml','choices']},ensure_ascii=False)
            self.assertFalse(any(0xe000<=ord(c)<0xf900 for c in content),q['id'])
            self.assertNotIn('CONTINUE ON',content)
            self.assertNotIn('THIS IS THE END',content)
            self.assertNotIn('_',re.sub(r'\\[^ ]+','',content))

    def test_poem_and_glossary_complete(self):
        poem=next(p for p in self.payload['passages'] if p['format']=='poem')
        self.assertEqual(len([l for l in poem['text'].splitlines() if l.strip()]),26)
        self.assertEqual(poem['richText'].count('<div>'),3)
        trees=self.payload['passages'][-1]
        self.assertEqual(trees['richText'].count('data-glossary-definition='),4)
        self.assertEqual(trees['richText'].count('<p>'),7)
        narrative=next(p for p in self.payload['passages'] if 'Do Them No Harm' in p['title'])
        self.assertEqual(narrative['richText'].count('<p>'),26)
        self.assertIn('<em>',narrative['titleHtml'])

    def test_all_explanations_captured_and_source_profile_consistent(self):
        for q in self.questions:
            self.assertTrue(q['explanation'].strip(),q['id'])
            self.assertTrue(q['review']['explanationSource']['sourcePages'])
            self.assertEqual(q['provenance']['sourceFamily'],'official_shsat')
            self.assertEqual(q['provenance']['sourceFormat'],'pdf')
            self.assertEqual(q['provenance']['playerProfile'],'testnav')

if __name__=='__main__':unittest.main(verbosity=2)
