from pathlib import Path
import subprocess, json
root=Path(__file__).resolve().parents[1]
script="global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.CHRONOS_DATA))"
p=subprocess.run(['node','-e',script,str(root/'data.js')],capture_output=True,text=True)
assert p.returncode==0,p.stderr
data=json.loads(p.stdout)
assert len(data)==30 and len({x['id'] for x in data})==30
assert all(x['start']<=x['year']<=x['end'] for x in data)
assert all(x['source'].startswith('https://') for x in data)
assert len({x['civilization'] for x in data})==14
print('PASS: 30 unique entries, valid time intervals, HTTPS sources, 14 categories')
