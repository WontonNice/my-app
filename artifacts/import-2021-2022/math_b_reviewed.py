"""Source transcription for this batch; uses the existing import contract."""
import json,re,html,pathlib
from PIL import Image
from prepare_english import ROOT,key
Q={}
def add(n,p,choices=None): Q[n]={'promptHtml':p,'choices':choices or []}
def table(title,headers,rows):
 return '<p>'+title+'</p><table><thead><tr>'+''.join('<th>'+v+'</th>' for v in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+v+'</td>' for v in row)+'</tr>' for row in rows)+'</tbody></table>'
def fig(n,page,box,width=None,suffix='figure'):
 name=f'pdf-2021-2022-b-q{n:03}-{suffix}.png';im=Image.open(ROOT/'b'/f'page-{page:02}.png').crop(box);im.save(ROOT/'assets'/name)
 return f'<p><img src="/exam-images/{name}" width="{width or round(im.width*96/150)}" alt="Source diagram for question {n}"></p>'
add(58,r'<p>How many \(5\)-digit numbers can be created using the digits \(2,3,5,7,\) and \(8\) without repeating any digits within that \(5\)-digit number?</p>')
add(59,r'<p>\(\frac{147-x}{12}=12\)</p><p>What is the value of \(x\) in the equation shown above?</p>')
add(60,r'<p>\(\left|(-6)-(-5)+4.2\right|-\left|3-9.6\right|=\)</p>')
add(61,r'<p>Tyler has completed \(60\) pages in his French workbook. This is \(20\%\) of the total number of pages in the workbook. How many pages are in the workbook?</p>')
add(62,fig(62,41,(735,205,1150,670))+r'<p>Four straight lines intersect at point \(\mathrm{P}\) as shown above. What is the value of \(y\)?</p>')
add(63,r'<p>If \(x=9\) and \(y=-7\), what is the value of \(x(x-2y)\)?</p>',['18','45','144','207'])
add(64,fig(64,42,(175,805,592,1045))+r'<p>In parallelogram \(\mathrm{PQRS}\) above, what is the measure of \(\angle\mathrm{QRS}\)?</p>',[r'60^\circ',r'70^\circ',r'80^\circ',r'120^\circ'])
add(65,r'<p>\(M=3N=\frac{P}{4}=Q+5=\frac{R}{7}>0\)</p><p>Based on the statement above, which variable has the <strong>greatest</strong> value?</p>',['M','N','P','R'])
add(66,table('DESSERT CHOICES',['Dessert','Number of Times Ordered'],[['Cookies',r'\(42\)'],['Pie',r'\(23\)'],['Cake',r'\(47\)'],['Ice Cream',r'\(48\)']])+r'<p>The table above shows the number of times that different desserts were ordered at a restaurant. Based on this information, what is the probability of a customer ordering ice cream as a dessert?</p>',[r'25\%',r'30\%',r'40\%',r'48\%'])
add(67,r'<p>Macie can buy a package of paper for \(\$10.50\) or she can buy \(x\) individual sheets of the same paper for \(\$0.15\) each. What is the largest value of \(x\) for which buying the individual sheets is <strong>less</strong> expensive than buying the package?</p>',['60','65','69','70'])
add(68,r'<p>At \(1{:}00\) p.m., the temperature was \(8\) degrees above zero. If it falls \(3\) degrees per hour, what will the temperature be at \(7{:}00\) p.m.?</p>',[r'-13^\circ',r'-10^\circ',r'-7^\circ',r'5^\circ'])
add(69,r'<p>A bag contains \(75\) marbles that are red, blue, or green. The ratio of red to blue marbles is \(15{:}7\), and the ratio of blue to green marbles is \(7{:}3\). If \(2\) blue marbles are removed and replaced with \(2\) green marbles, what will be the new ratio of red to green marbles?</p>',['3:1','5:1','15:3','45:11'])
add(70,r'<p>A roofing contractor uses \(3\) bundles of shingles to cover \(96\) square feet of roof. How many bundles will he need to cover a roof that is \(416\) square feet?</p>',['5','12','13','14'])
add(71,r'<p>What is the least common multiple of \(24,6,\) and \(18\)?</p>',['36','48','72','144'])
add(72,r'<p>The Early Bird Restaurant uses \(15\) dozen eggs for every \(200\) customers. At this rate, approximately how many dozen eggs will be needed for \(300\) customers?</p>',['20','23','25','30'])
add(73,r'<p>A cooler contains three types of beverages: \(5\) bottles of apple juice, \(3\) bottles of grape juice, and \(6\) bottles of orange juice. What is the probability that a bottle chosen at random from this cooler is <strong>not</strong> apple juice?</p>',[r'\frac19',r'\frac5{14}',r'\frac9{14}',r'\frac23'])
add(74,r'<p>A large circular piece of paper has a radius of \(20\) centimeters. A smaller circular piece of paper has a circumference of \(20\pi\) centimeters. The smaller piece is placed in the center of the larger piece. What is the area of the larger piece that is <strong>not</strong> covered by the smaller piece?</p>',[r'20\pi\text{ sq cm}',r'100\pi\text{ sq cm}',r'200\pi\text{ sq cm}',r'300\pi\text{ sq cm}'])
add(75,table('PRICES FOR NEWSPAPER ADVERTISING',['Page Space','Price'],[[r'\(\frac14\) page',r'\(\$200\)'],[r'\(\frac12\) page',r'\(\$350\)'],['full page',r'\(\$600\)']])+r'<p>The table above shows prices for newspaper advertising. A store purchased \(\frac14\) pages, \(\frac12\) pages, and full pages of page space in equal numbers for a total of \(\$11{,}500\). What is the total amount of page space the store purchased?</p>',[r'1\frac34\text{ pages}',r'10\text{ pages}',r'16\frac12\text{ pages}',r'17\frac12\text{ pages}'])
add(76,r'<p>How many positive odd numbers satisfy the inequality \(3x+8\le92\)?</p>',['13','14','17','28'])
add(77,r'<p>If \(\frac{36}{y}=4x\), what is the value of \(x\) when \(y=3\)?</p>',['3','4','9','12'])
add(78,r'<p>Points \(\mathrm{X},\mathrm{Y},\) and \(\mathrm{Z}\) are on a straight line, and \(\mathrm{Y}\) is between \(\mathrm{X}\) and \(\mathrm{Z}\). Length \(\overline{\mathrm{YZ}}=\frac35\overline{\mathrm{XY}}\), and length \(\overline{\mathrm{XY}}=20\) centimeters. What is the length of \(\overline{\mathrm{XZ}}\)?</p>',[r'12\text{ cm}',r'24\text{ cm}',r'30\text{ cm}',r'32\text{ cm}'])
add(79,r'<p>Bryana bought \(1\frac34\) yards of cloth at \(\$8\) per yard. If the sales tax was \(8\%\), what was the total cost of the cloth?</p>',[r'\$12.96',r'\$14.08',r'\$15.12',r'\$16.08'])
add(80,fig(80,46,(175,640,590,770))+r'<p>On the number line above, \(\mathrm{MN}=5\frac56\). What is the position of point \(\mathrm{M}\)?</p>',[r'-7\frac16',r'-4\frac12',r'4\frac12',r'7\frac16'])
add(81,r'<p>A presidential coin is made of an alloy of copper, zinc, manganese, and nickel. The weights of these metals are in the ratio \(177{:}12{:}7{:}4\), respectively. If the coin weighs \(8\) grams, what is the weight of the zinc in the coin?</p>',[r'0.28\text{ g}',r'0.48\text{ g}',r'0.96\text{ g}',r'48\text{ g}'])
add(82,r'<p>Jack scored a mean of \(15\) points per game in his first \(3\) basketball games. In his fourth game, he scored \(27\) points. What was Jack’s mean score for the \(4\) games?</p>',['15','17','18','21'])
add(83,r'<p>A cylindrical oil drum holds \(4{,}320\) liters when it is completely filled. Currently, the drum is \(\frac13\) full. How many <strong>kiloliters</strong> of oil need to be added to fill the drum completely?</p>',['1.44','2.88','4.32','14.10'])
add(84,r'<p>Nicole is \(3\) times as old as Carmen. If Carmen will be \(17\) years old in \(2\) years, how old was Nicole \(5\) years ago?</p>',[r'38\text{ years old}',r'40\text{ years old}',r'45\text{ years old}',r'50\text{ years old}'])
add(85,r'<p>A certain chemical loses \(20\%\) of its weight each week. What <strong>percent</strong> of its original weight is left after \(2\) weeks?</p>',[r'40\%',r'60\%',r'64\%',r'80\%'])
add(86,r'<p>If \(w-1\) is an odd integer, which one of the following <strong>must</strong> be an even integer?</p>',['w+1','2w-1','2w-2','2w+1'])
add(87,r'<p>Three students stand at the starting line of a running track. Ann runs \(1\) lap every \(2\) minutes, Jack runs \(1\) lap every \(3\) minutes, and Lee runs \(1\) lap every \(4\) minutes. If they start running at the same time, how many laps will Ann have completed when all \(3\) students meet at the starting line again?</p>',['4','6','12','20'])
add(88,r'<p>Simplify this expression:</p><p>\(4(7-3x)-(5-x)\)</p>',['23-4x','23-11x','28-4x','28-12x'])
add(89,table('PET SURVEY',['Number of Pets','Number of Students'],[[r'\(0\)',r'\(12\)'],[r'\(1\)',r'\(16\)'],[r'\(2\)',r'\(7\)'],[r'\(3\) or more',r'\(5\)']])+r'<p>Amy surveyed students at her school about the number of pets they have. What is the probability that a student who participated in the survey has at least \(2\) pets?</p>',[r'\frac7{40}',r'\frac1{12}',r'\frac18',r'\frac3{10}'])
add(90,r'<p>A large container is partially filled with \(n\) liters of water. Ivo adds \(10\) liters of water to the container, making it \(60\%\) full. If Ignacio adds \(6\) more liters of water, the container will be \(75\%\) full. What is the value of \(n\)?</p>',['14','15','26','30'])
add(91,r'<p>\(5x^3+3x+9+\frac1{x^2}\)</p><p>If \(x=10\), what is the value of the expression above?</p>',['2{,}539.01','5{,}039.01','5{,}039.1','5{,}139'])
add(92,fig(92,49,(175,200,585,580))+r'<p>\(\mathrm{R},\mathrm{S},\) and \(\mathrm{T}\) are midpoints of the sides of square \(\mathrm{MNPQ}\), as shown above. What is the sum of the areas of the shaded triangles?</p>',[r'9\text{ sq cm}',r'12\text{ sq cm}',r'18\text{ sq cm}',r'36\text{ sq cm}'])
add(93,r'<p>The Chens spend \(\$5\) of every \(\$8\) they earn on planned expenses. If the family earns \(\$29{,}600\) in one year, how much will they spend on planned expenses that year?</p>',[r'\$1{,}850',r'\$3{,}700',r'\$5{,}920',r'\$18{,}500'])
add(94,r'<p>A pizza shop offers a choice of \(3\) sizes (small, medium, and large) and \(7\) different toppings. Different pizzas can be created by changing the size and/or the choice of toppings. If Cody wants to order a pizza with exactly \(2\) different toppings, how many different pizzas can he create?</p>',['6','21','63','126'])
add(95,table('SURVEY OF CATS PER FAMILY',['Number of Cats','Number of Families'],[[r'\(0\)',r'\(15\)'],[r'\(1\)',r'\(42\)'],[r'\(2\)',r'\(35\)'],[r'\(3\) or more',r'\(8\)']])+r'<p>The table above shows the number of cats per family in \(100\) households in the Blaine neighborhood. By what <strong>percentage</strong> is the number of families with \(1\) cat greater than the number of families with \(2\) cats?</p>',[r'7\%',r'10\%',r'17\%',r'20\%'])
add(96,r'<p>A wooden box has a square base. The height of this box is \(3\) times the length of one side of the base. If one side of the base is \(3\) feet long, what is the volume of this box?</p>',[r'9\text{ cu ft}',r'27\text{ cu ft}',r'36\text{ cu ft}',r'81\text{ cu ft}'])
add(97,r'<p>On a bike trip, Rajiv traveled \(65\) kilometers in \(5\) hours, while Shaina traveled \(72\) kilometers in \(4\) hours. How much <strong>less</strong> was Rajiv’s mean speed, in kilometers per hour (kph), than Shaina’s?</p>',['1','5','7','9'])
add(98,r'<p>Points \(\mathrm{P},\mathrm{Q},\mathrm{R},\) and \(\mathrm{S}\) represent \(-3,-1,0,\) and \(2\), respectively, on a number line. How many units is the midpoint of \(\overline{\mathrm{PQ}}\) from the midpoint of \(\overline{\mathrm{RS}}\)?</p>',['1','2','3','4'])
add(99,r'<p>There are \(1{,}000\) cubic centimeters in \(1\) liter, and \(1{,}000\) cubic millimeters in \(1\) milliliter. How many cubic millimeters are there in \(1{,}000\) cubic centimeters?</p>',['1{,}000','10{,}000','100{,}000','1{,}000{,}000'])
add(100,fig(100,50,(740,665,1145,1105))+r'<p>In the quarter circle above, what is \(y\) in terms of \(x\)?</p>',['x-1','x+1',r'\frac{x+1}{2}',r'\sqrt{\frac{(x+1)^2}{2}}'])
add(101,fig(101,51,(105,200,590,335))+r'<p>The hash marks on the number line above are evenly spaced. What is the coordinate of point \(\mathrm{R}\)?</p>',[r'\frac7{40}',r'\frac9{40}',r'\frac{11}{40}',r'\frac{21}{40}'])
add(102,r'<p>Phan chose an Internet service that charges \(\$18.00\) per month plus \(\$0.024\) per minute. Deion chose an Internet service that charges \(\$30.00\) per month for unlimited usage. At the end of the month, Phan’s and Deion’s charges were identical. For how many minutes did Phan use the Internet service that month?</p>',['50','60','100','500'])
add(103,fig(103,51,(730,205,1155,550))+r'<p>What is the area of the shaded triangle shown above?</p>',['m+n','n-m','2(n-m)','4(n-m)'])
add(104,r'<p>The decimal \(0.06\) can be written as the fraction \(\frac{x}{50}\). What is the value of \(x\)?</p>',['3','6','12','30'])
add(105,r'<p>In a sample of \(50\) cars at a local dealership, there are \(12\) red cars and \(10\) cars with backup cameras. Of the \(12\) red cars, \(4\) have backup cameras. If a car is selected at random from the given sample, what is the probability that <strong>both</strong> of the following are true: the car is <strong>not</strong> red and does <strong>not</strong> have a backup camera?</p>',[r'\frac35',r'\frac{16}{25}',r'\frac{19}{25}',r'\frac45'])
add(106,table('ANIMAL CARDS',['Number of Cards','Picture on Card'],[[r'\(8\)','cat'],[r'\(6\)','dog'],[r'\(5\)','bird'],[r'\(4\)','fish'],[r'\(1\)','horse']])+r'<p>The cards in the table above are mixed in a box. Which animal pictured on a card has exactly a \(1\) in \(4\) chance of being picked at random from the box?</p>',[{'text':v,'html':v} for v in ['cat','dog','fish','horse']])
add(107,r'<p>Which number line below shows the solution set for \(2x-2\le y\le4x+10\) when \(y=1\)?</p>',[{'text':'','html':fig(107,52,(750,y,1140,y+75),250,'choice-'+c)} for c,y in zip('ABCD',[1115,1205,1295,1385])])
add(108,r'<p>\(\frac{14}{21}=\frac{p}{7}\)</p><p>In the equation above, what is the value of \(p\)?</p>',[r'\frac23','3',r'\frac{14}{3}','14'])
add(109,r'<p>A ball is selected at random from a box that contains \(7\) black balls, \(14\) green balls, and \(21\) red balls. What is the probability that the ball selected is black?</p>',[r'\frac16',r'\frac15',r'\frac13',r'\frac56'])
add(110,r'<p>At North High School, a survey asked two questions, Question A and Question B. For each question, students could answer either “yes” or “no.” Of the \(800\) students who responded to the survey, \(720\) answered “yes” to Question A, and \(640\) answered “yes” to Question B. What is the <strong>least</strong> possible number of these students who could have answered “yes” to <strong>both</strong> questions?</p>',['80','160','560','640'])
add(111,r'<p>Raoul is at least \(3\) years older than Vahn. Which of the following inequalities gives the relationship between Raoul’s age \((r)\) and Vahn’s age \((v)\)?</p>',[r'r-v\ge3',r'r-v\le3',r'3-v\le r',r'3-r\le v'])
add(112,r'<p>\(1\text{ sind}=5.6\text{ ricks}\)</p><p>\(1\text{ sind}=12.88\text{ dalts}\)</p><p>Using the conversion above, how many dalts are equal to \(1\) rick?</p>',['0.43','2.30','7.28','18.48'])
add(113,r'<p>There are now \(x\) cans stacked on a shelf that holds \(36\) cans when full. If \(4\) of these cans were removed, the shelf would be half full. What is the value of \(x\)?</p>',['14','16','18','22'])
add(114,r'<p>Carlos tossed a paper cup in the air \(50\) times and found that the probability of it landing on its side was \(72\%\). If he tosses the cup in the air \(150\) <strong>more</strong> times, what is the total number of times he can expect the cup to land on its side?</p>',['72','108','144','158'])
assert len(Q)==57
# Exact source wording checked against the printed pages (not alternate editions).
for n,p in {
64:r'In the figure above, \(\mathrm{PQRS}\) is a parallelogram. The measure of \(\angle\mathrm{PQT}\) is \(50^\circ\), and the measure of \(\angle\mathrm{PTQ}\) is \(70^\circ\). What is the measure of \(\angle\mathrm{QRS}\)?',
67:r'To make party invitations, Macie could buy a package of paper for \(\$10.50\), or she could buy \(x\) individual sheets of the same paper for \(\$0.15\) each. What is the largest value of \(x\) that would make buying the individual sheets <strong>less</strong> expensive than buying the package?',
68:r'At \(1{:}00\) p.m. one day, the temperature was \(8\) degrees above zero. During the rest of the day, the temperature fell \(3\) degrees per hour. What was the temperature at \(7{:}00\) p.m. that day?',
70:r'A roofing contractor uses shingles at a rate of \(3\) bundles for every \(96\) square feet of roof covered. At this rate, how many bundles of shingles will he need in order to cover a roof that is \(416\) square feet?',
72:r'One day, the Early Bird Restaurant used \(15\) dozen eggs for \(200\) breakfast customers. At this rate, approximately how many dozen eggs are needed for \(300\) breakfast customers?',
74:r'A large circular dinner plate has a radius of \(20\) centimeters. A smaller circular plate with a circumference of \(20\pi\) centimeters is placed in the center of the larger dinner plate. What is the area of the part of the larger dinner plate that is <strong>not</strong> covered by the smaller plate?',
79:r'Bryana bought \(1\frac34\) yards of cloth at \(\$8.00\) per yard. If there was an \(8\%\) sales tax, what was the total cost of the cloth?',
81:r'A United States presidential coin is made from an alloy of four metals—copper, zinc, manganese, and nickel—with weights in the ratio of \(177{:}12{:}7{:}4\), respectively. The coin weighs a total of \(8\) grams. What is the weight of the zinc in this coin?',
82:r'Jack scored a mean of \(15\) points per game in his first \(3\) basketball games. In his \(4\)th game, he scored \(27\) points. What is his mean score for the first \(4\) games?',
83:r'A cylindrical oil drum can hold \(4{,}320\) liters when it is completely full. Currently, the drum is \(\frac13\) full of oil. How many <strong>kiloliters</strong> of oil need to be added in order to fill the drum completely?',
84:r'Nicole’s age now is three times Carmen’s age. If Carmen will be \(17\) in two years, how old was Nicole \(5\) years ago?',
85:r'A chemical decays in such a way that the amount left at the end of each week is \(20\%\) less than the amount at the beginning of that same week. What <strong>percent</strong> of the original amount is left after two weeks?',
87:r'Three students stand at the starting line of a running track and begin running laps at the same time. Ann completes \(1\) lap every \(2\) minutes, Jack completes \(1\) lap every \(3\) minutes, and Lee completes \(1\) lap every \(4\) minutes. How many laps does Ann complete before all three runners are once again at the starting line at the same time?'
}.items():
 prefix=Q[n]['promptHtml'].split('</p>')[0]+'</p>' if n==64 else ''
 Q[n]['promptHtml']=prefix+'<p>'+p+'</p>'
if __name__=='__main__':
 out=[];ext=json.loads((ROOT/'b-extracted.json').read_text())
 for n,q in Q.items():
  q.update(id=f'pdf-shsat-2021-2022-b-q{n:03}',type='short_response' if n<63 else 'multiple_choice',points=1,topic='',subtopic='',prompt=html.unescape(re.sub('<[^>]+>','',q['promptHtml'].replace('</p>','\n\n'))).strip())
  q['choices']=[dict({'text':c,'math':c} if isinstance(c,str) else c,id='ABCD'[i]) for i,c in enumerate(q['choices'])]
  if n<63:q['correctTextAnswers']=[key('b')[n]]
  else:q['correctChoiceId']='ABCD'['ABCDEFGH'.index(key('b')[n])%4]
  q['review']={'sourceFile':'20212022_form_b.pdf','sourcePages':[ext[str(n)]['page']],'sourceQuestion':str(n),'sourceChoiceIds':list('ABCD' if n%2 else 'EFGH') if n>=63 else [],'sourceReviewed':False,'completenessReviewed':False,'classificationReviewed':False,'topicSource':'unknown','difficulty':'','warnings':[]}
  out.append(q)
 (ROOT/'math-b-working.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
