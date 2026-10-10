from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
order=['premium.js','data.js','editorial-data.js','app.js','cities.js','archive-data.js','archive.js']
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(1440,900),(390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height}); errors=[]
  page.on('pageerror',lambda err:errors.append(str(err)))
  html=(root/'index.html').read_text()
  import re
  html=re.sub(r'<script[^>]+src="[^"]+"[^>]*></script>','',html)
  for css in ('styles.css','premium.css'):
   html=html.replace(f'<link rel="stylesheet" href="{css}">','<style>'+ (root/css).read_text()+'</style>')
  page.set_content(html,wait_until='load')
  for js in order: page.add_script_tag(content=(root/js).read_text())
  assert page.locator('.section-nav a').count()==6
  assert page.locator('#archiveGrid .documentary-card').count()==12
  assert page.locator('#cultureList .culture-card').count()==14
  for theme in ['papyrus','midnight','obsidian']:
   page.locator('#themeSelect').select_option(theme);assert page.locator('body').get_attribute('data-theme')==theme
  page.locator('#next').click();assert page.locator('#yearDisplay').inner_text()=='200 d. C.'
  page.locator('#prev').click();assert page.locator('#yearDisplay').inner_text()=='100 d. C.'
  page.locator('#goYear').click();page.locator('#jumpYear').fill('1453');page.locator('#goYear').click();assert '1453' in page.locator('#yearDisplay').inner_text()
  page.locator('#stepSize').select_option('10');page.locator('#next').click();assert '1463' in page.locator('#yearDisplay').inner_text()
  page.locator('#nearest').click();assert page.locator('#yearDisplay').inner_text()
  page.locator('#all').check();assert page.locator('#cards .card').count()==30
  page.locator('#search').fill('Guiza');assert page.locator('#cards .card').count()>=1
  page.locator('#search').fill('');page.locator('#civilization').select_option('Maya');page.locator('#type').select_option('Arquitectura')
  page.locator('#archiveGrid .documentary-card button').first.click()
  assert page.locator('#civilization').input_value()=='' and page.locator('#type').input_value()==''
  assert page.locator('#cards .card').count()>=1
  page.locator('#archiveSearch').fill('roma');assert page.locator('#archiveGrid .documentary-card').count()>=1
  page.locator('#archiveCategory').select_option(index=1)
  page.locator('#archiveClear').click();assert page.locator('#archiveGrid .documentary-card').count()==12
  page.locator('#cultureSearch').fill('xxxx-no-existe');assert page.locator('#cultureEmpty').is_visible()
  page.locator('#cultureClear').click();assert page.locator('#cultureList .culture-card').count()==14
  page.locator('#cityChoice').select_option('giza');assert 'Guiza' in page.locator('#cityTitle').inner_text()
  page.locator('#cityNext').click();assert '2 / 3' in page.locator('#cityProgress').inner_text()
  page.locator('#cityPrevious').click();assert '1 / 3' in page.locator('#cityProgress').inner_text()
  page.locator('#cityView').select_option('notes');page.locator('#cityReset').click();assert page.locator('#cityView').input_value()=='diagram'
  page.locator('#atlasAll').check(); assert page.locator('#atlasPlaces button').count()>0
  page.locator('#atlasPlaces button').first.click();assert page.locator('#detail').is_visible();page.locator('#close').click()
  page.locator('#atlasReset').click();assert not page.locator('#atlasAll').is_checked()
  page.locator('#random').click();assert page.locator('#detail').is_visible();page.locator('#close').click()
  page.locator('#all').check() if not page.locator('#all').is_checked() else None
  page.locator('#cards .card button').first.click();assert page.locator('#detail').is_visible();page.keyboard.press('Escape');assert not page.locator('#detail').is_visible()
  page.locator('#play').click();assert page.locator('#play').get_attribute('aria-pressed')=='true';page.locator('#play').click();assert page.locator('#play').get_attribute('aria-pressed')=='false'
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Horizontal overflow at {width}'
  assert not errors,errors
  print('PASS',width,height,'controles, filtros, atlas, ciudades, biblioteca, temas, diálogo y reproducción')
  page.close()
 browser.close()
