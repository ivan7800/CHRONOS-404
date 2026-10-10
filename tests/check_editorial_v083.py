from pathlib import Path
import subprocess,json
r=Path(__file__).resolve().parents[1]
s="global.window={};require(process.argv[1]);require(process.argv[2]);console.log(JSON.stringify({data:window.CHRONOS_DATA,ed:window.CHRONOS_EDITORIAL}));"
p=subprocess.run(['node','-e',s,str(r/'data.js'),str(r/'editorial-data.js')],capture_output=True,text=True)
assert p.returncode==0,p.stderr
v=json.loads(p.stdout); data=v['data'];ed=v['ed'];assert len(data)==30 and len(ed)==30
assert {x['id'] for x in data}==set(ed)
assert all(x['start']<=x['year']<=x['end'] for x in data)
p=next(x for x in data if x['id']=='partenon')
assert (p['start'],p['end'],p['year'])==(-446,-431,-437)
assert all(len(v['question'])>20 and v['status'] for v in ed.values())
assert 'editorial-data.js' in (r/'index.html').read_text()
assert 'CONTINÚA EXPLORANDO' in (r/'app.js').read_text()
print('PASS 30 prompts, correspondencia de IDs, Partenón 438 a.C., integración')
