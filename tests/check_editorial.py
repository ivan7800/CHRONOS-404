from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parents[1]
r=subprocess.run(['node','-e','global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.CHRONOS_DATA))',str(root/'data.js')],capture_output=True,text=True)
assert r.returncode==0,r.stderr
d={x['id']:x for x in json.loads(r.stdout)}
assert len(d)==30
assert d['apolo11']['type']=='Exploración espacial'
assert '20 de julio de 1969' in d['apolo11']['confidence']
assert (d['partenon']['start'],d['partenon']['end'])==(-446,-431)
assert all(x.get('confidence') and x.get('source','').startswith('https://') for x in d.values())
js=(root/'app.js').read_text()
assert 'CONSULTAR FUENTE DE CONTEXTO' in js
assert 'no necesariamente valida todas las fechas' in js
print('PASS: historical metadata, date encoding, sourcing disclaimer, 30 entries')
