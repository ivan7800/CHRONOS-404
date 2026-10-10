from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parents[1]
s='global.window={};require(process.argv[1]);require(process.argv[2]);console.log(JSON.stringify({data:window.CHRONOS_DATA,ed:window.CHRONOS_EDITORIAL}));'
r=subprocess.run(['node','-e',s,str(root/'data.js'),str(root/'editorial-data.js')],capture_output=True,text=True)
assert r.returncode==0,r.stderr
obj=json.loads(r.stdout);data=obj['data'];ed=obj['ed']
assert len(data)==len(ed)==30
assert {x['id'] for x in data}==set(ed)
assert sum(bool(v.get('verifiedSource')) for v in ed.values()) >=19
assert sum(not bool(v.get('verifiedSource')) for v in ed.values()) <=11
for value in ed.values():
 if value.get('verifiedSource'):
  assert value.get('verificationScope') and value['verifiedSource'].startswith('https://')
  assert 'pendiente' not in value['status'].lower()
h=next(x for x in data if x['id']=='hammurabi')
assert h['year']==-1749 and h['start']<=h['year']<=h['end']
assert all(x['start']<=x['year']<=x['end'] for x in data)
print('PASS: 30 fichas, al menos 19 contrastes delimitados, máximo 11 pendientes, Hammurabi aproximado')
