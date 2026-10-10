from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]
s=(p/'cities.js').read_text(encoding='utf-8')
h=(p/'index.html').read_text(encoding='utf-8')
for id in ('cityChoice','cityView','cityReset','cityArt','cityStops','cityPrevious','cityNext','cityStopDetail'):
    assert f'id="{id}"' in h, id
for loc in ('rome','giza','tikal'):
    assert re.search(r'\b'+loc+r':\{',s),loc
for number in ('91','86','64'):
    assert 'whc.unesco.org/en/list/'+number in s,number
assert s.count("shape:'") == 9
assert 'cities.js' in h
print('PASS: 3 destinos, 9 paradas, referencias y controles presentes (inspección estática)')
