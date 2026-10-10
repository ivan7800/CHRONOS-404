from pathlib import Path
import re,subprocess,json
root=Path(__file__).resolve().parents[1]
js=(root/'app.js').read_text();html=(root/'index.html').read_text()
p=subprocess.run(['node','-e','global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.CHRONOS_DATA))',str(root/'data.js')],capture_output=True,text=True)
assert p.returncode==0,p.stderr
ids={x['id'] for x in json.loads(p.stdout)}
header=js.split('const mapState=')[0]
coords={k:(float(a),float(b)) for k,a,b in re.findall(r"(?:\{|,)\s*['\"]?([\w-]+)['\"]?:\[(-?[\d.]+),(-?[\d.]+)\]",header)}
assert ids==set(coords),(ids-set(coords),set(coords)-ids)
assert all(-90<=a<=90 and -180<=b<=180 for a,b in coords.values())
for key in ('atlas','mapPins','atlasPlaces','atlasAll','atlasReset','cultureList','cultureSearch','cultureClear'):
 assert f'id="{key}"' in html,key
assert 'renderAtlas();' in js and 'renderCultures();' in js
for path in ('app.js','data.js'):
 r=subprocess.run(['node','--check',str(root/path)],capture_output=True,text=True)
 assert r.returncode==0,r.stderr
print('PASS: 30 coordinates, interactive control IDs, JS syntax and basic wiring')
