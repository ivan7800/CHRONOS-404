import re,json,pathlib
p=pathlib.Path(__file__).resolve().parents[1]
t=(p/'archive-data.js').read_text(encoding='utf8')
data=json.loads(t.split('=',1)[1].strip().rstrip(';'))
assert len(data)==12
assert len({r['id'] for r in data})==len(data)
ids=set(re.findall(r"id:'([^']+)'",(p/'data.js').read_text(encoding='utf8')))
for r in data:
 assert r['related'] in ids,r
 assert r['source'].startswith('https://'),r
 assert len(r['description'])>25
assert (p/'index.html').read_text().find('id="archiveGrid"')>=0
print('PASS: 12 fichas, referencias HTTPS, relaciones existentes y markup')
