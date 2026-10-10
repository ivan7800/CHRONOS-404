'use strict';
(function(){
 const items=window.CHRONOS_DATA;
 const $=id=>document.getElementById(id);
 const MIN=-3399,MAX=2025;
 // Coordenadas modernas aproximadas de los yacimientos/lugares citados; NO delimitan territorios históricos.
 const LOCATIONS={'sumer-escritura':[32.07,44.40],'hammurabi':[32.54,44.42],'hatshepsut':[25.74,32.61],'alejandria':[31.20,29.92],'olimpicos':[37.64,21.63],'alejandro':[29.94,52.89],'pompeya':[40.75,14.49],'acueducto':[40.95,-4.12],'teotihuacan':[19.69,-98.84],'chichen':[20.68,-88.57],'bagdad':[33.32,44.37],'carlomagno':[41.90,12.49],'angkor':[13.41,103.87],'tenochtitlan':[19.43,-99.13],'constantinopla1453':[41.01,28.98],'machupicchu':[-13.16,-72.55],'imprenta':[49.99,8.25],'revolucion-francesa':[48.86,2.35],'industrial':[53.48,-2.24],'apolo11':[28.57,-80.65],piramides:[29.9792,31.1342],ur:[30.9625,46.1031],karnak:[25.7188,32.6573],atenas:[37.9715,23.7257],partenon:[37.9715,23.7257],roma:[41.9028,12.4964],coliseo:[41.8902,12.4922],tikal:[17.222,-89.6237],palenque:[17.484,-92.046],justiniano:[41.0086,28.9802]};
 const mapState={showAll:false,selected:null};
 const xy=id=>{const [lat,lon]=LOCATIONS[id];return {x:(lon+180)/360*1000,y:(90-lat)/180*510}};
 const svgNS='http://www.w3.org/2000/svg';
 const ERAS=[
  {id:'antiguo',label:'PRIMERAS CIUDADES',year:-3200,start:-3399,end:-1200,detail:'Las primeras grandes ciudades y complejos monumentales documentados en este archivo.'},
  {id:'clasico',label:'MUNDO CLÁSICO',year:-440,start:-1199,end:476,detail:'Grecia clásica, Roma y la transformación del Mediterráneo.'},
  {id:'tardio',label:'ANTIGÜEDAD TARDÍA',year:537,start:477,end:900,detail:'Cambios políticos, religiosos y culturales en múltiples regiones.'},
  {id:'medieval',label:'EDAD MEDIA',year:1200,start:901,end:1491,detail:'Una selección parcial de acontecimientos documentados; no constituye una historia exhaustiva.'},
  {id:'moderno',label:'EDAD MODERNA',year:1600,start:1492,end:1788,detail:'Una selección parcial de acontecimientos documentados; no constituye una historia exhaustiva.'},
  {id:'contemporaneo',label:'ERA CONTEMPORÁNEA',year:1900,start:1789,end:2025,detail:'Una selección parcial de acontecimientos documentados; no constituye una historia exhaustiva.'}
 ];
 const state={year:100,all:false,civilization:'',type:'',query:'',step:100,playing:false};
 let timer=null;
 const clamp=n=>Math.max(MIN,Math.min(MAX,Math.trunc(n)));
 const currentEra=()=>ERAS.find(e=>state.year>=e.start&&state.year<=e.end)||ERAS[0];
 function setYear(n){state.year=clamp(n);render();}
 function stop(){if(timer!==null){clearInterval(timer);timer=null}state.playing=false;$('play').textContent='▶ REPRODUCIR';$('play').setAttribute('aria-pressed','false')}
 function togglePlay(){if(state.playing){stop();return}if(state.year>=MAX)setYear(MIN);state.playing=true;$('play').textContent='Ⅱ PAUSAR';$('play').setAttribute('aria-pressed','true');timer=setInterval(()=>{if(state.year>=MAX){stop();return}setYear(state.year+state.step);if(state.year>=MAX)stop()},700)}
 
 const historicalYear=n=>n<=0?`${1-n} a. C.`:`${n} d. C.`;
 const optionValues=(id,values)=>{for(const value of [...new Set(values)].sort()){const o=document.createElement('option');o.value=value;o.textContent=value;$(id).append(o)}};
 const matches=(item)=> (state.all || (item.start<=state.year && item.end>=state.year)) && (!state.civilization||item.civilization===state.civilization) && (!state.type||item.type===state.type) && (!state.query||[item.title,item.civilization,item.place,item.summary].join(' ').toLocaleLowerCase('es').includes(state.query));
 function render(){ $('yearDisplay').textContent=historicalYear(state.year);$('time').value=state.year;if(document.activeElement!==$('jumpYear'))$('jumpYear').value=state.year;const era=currentEra();$('epochTitle').textContent=era.label;$('epochDescription').textContent=era.detail;for(const b of $('eras').querySelectorAll('button')){const active=b.dataset.id===era.id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))}const overlapping=items.filter(x=>x.start<=state.year&&x.end>=state.year);$('contextTitle').textContent=overlapping.length?`${overlapping.length} registros relacionados con ${historicalYear(state.year)}`:'Sin registros para este año';$('contextText').textContent=overlapping.length?[...new Set(overlapping.map(x=>x.civilization))].join(' · '):'El archivo inicial es parcial. Usa «Ir al registro más cercano» para continuar explorando.';const visible=items.filter(matches).sort((a,b)=>a.year-b.year);$('count').textContent=`${visible.length} DE ${items.length} REGISTROS`;$('cards').replaceChildren();$('empty').hidden=visible.length!==0;for(const item of visible){const card=document.createElement('article');card.className='card';const tag=document.createElement('div');tag.className='tag';tag.textContent=`${item.civilization} / ${historicalYear(item.year)} / ${item.type}`;const title=document.createElement('h3');title.textContent=item.title;const p=document.createElement('p');p.textContent=item.summary;const btn=document.createElement('button');btn.type='button';btn.textContent='EXPLORAR FICHA ↗';btn.addEventListener('click',()=>openDetail(item));card.append(tag,title,p,btn);$('cards').append(card)}renderAtlas();}
 function openDetail(item){const root=$('detailContent');root.replaceChildren();const title=document.createElement('h2');title.id='detailTitle';title.textContent=item.title;const intro=document.createElement('p');intro.textContent=item.summary;const dl=document.createElement('dl');for(const [key,value] of [['Civilización',item.civilization],['Ubicación',item.place],['Fecha de referencia',historicalYear(item.year)],['Cobertura',item.start===item.end?historicalYear(item.start):`${historicalYear(item.start)} — ${historicalYear(item.end)}`],['Tipo',item.type],['Precisión',item.confidence]]){const dt=document.createElement('dt');dt.textContent=key;const dd=document.createElement('dd');dd.textContent=value;const cell=document.createElement('div');cell.append(dt,dd);dl.append(cell)}const source=document.createElement('div');source.className='source';const link=document.createElement('a');link.href=item.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='CONSULTAR FUENTE DE CONTEXTO ↗';const note=document.createElement('p');note.textContent='La fuente enlazada ofrece contexto general y no necesariamente valida todas las fechas o detalles de esta ficha. Las cronologías aproximadas se indican en «Precisión».';source.append(link,note);
const editorial=window.CHRONOS_EDITORIAL?.[item.id];
if(editorial){
 const aside=document.createElement('section');aside.className='editorial-extra';
 const heading=document.createElement('h3');heading.textContent='CLAVES PARA INVESTIGAR';
 const question=document.createElement('p');question.textContent=editorial.question;
 const state=document.createElement('p');state.className='editorial-state';state.textContent='ESTADO DOCUMENTAL · '+editorial.status;
 aside.append(heading,question,state);
 if(editorial.verifiedSource){const citation=document.createElement('a');citation.href=editorial.verifiedSource;citation.target='_blank';citation.rel='noopener noreferrer';citation.textContent='CONSULTAR DOCUMENTO CONTRASTADO ↗';aside.append(citation);if(editorial.verificationScope){const scope=document.createElement('p');scope.textContent='Alcance: '+editorial.verificationScope;aside.append(scope)}}
 const related=items.filter(x=>x.id!==item.id && x.civilization===item.civilization).sort((a,b)=>Math.abs(a.year-item.year)-Math.abs(b.year-item.year)).slice(0,3);
 if(related.length){const h=document.createElement('h3');h.textContent='CONTINÚA EXPLORANDO';aside.append(h);
 const links=document.createElement('div');links.className='editorial-related';for(const other of related){const btn=document.createElement('button');btn.type='button';btn.textContent=other.title+' →';btn.addEventListener('click',()=>openDetail(other));links.append(btn)}aside.append(links)}
 root.append(title,intro,dl,aside,source);
}else root.append(title,intro,dl,source);
$('detail').showModal()}

 function mapMatches(item){return (mapState.showAll || (item.start<=state.year && item.end>=state.year)) && (!state.civilization||item.civilization===state.civilization) && (!state.type||item.type===state.type) && (!state.query||[item.title,item.civilization,item.place,item.summary].join(' ').toLocaleLowerCase('es').includes(state.query));}
 function selectMapItem(item){mapState.selected=item.id;$('atlasSelection').textContent=`${item.place} · ${item.title} · ${historicalYear(item.year)}. Ubicación aproximada actual.`;renderAtlas();openDetail(item)}
 function renderAtlas(){
  const visible=items.filter(mapMatches);
  $('atlasStatus').textContent=`${visible.length} / ${items.length} MARCADORES`;
  const pins=$('mapPins'),places=$('atlasPlaces');pins.replaceChildren();places.replaceChildren();
  if(!visible.length){const p=document.createElement('p');p.className='atlas-none';p.textContent='Sin ubicaciones para esta fecha y estos filtros. Activa «Mostrar también registros fuera del año seleccionado». ';places.append(p);return}
  // Agrupamos lugares próximos para evitar botones superpuestos en Atenas y Roma.
  const clusters=new Map();
  for(const item of visible){const key=item.place;const group=clusters.get(key)||[];group.push(item);clusters.set(key,group)}
  for(const [place,group] of clusters){
   const center=xy(group[0].id),active=group.some(it=>it.id===mapState.selected);
   const dot=document.createElementNS(svgNS,'circle');dot.setAttribute('cx',center.x);dot.setAttribute('cy',center.y);dot.setAttribute('r',active?'10':'7');dot.setAttribute('class',`map-dot${active?' selected':''}`);pins.append(dot);
   const target=document.createElementNS(svgNS,'circle');target.setAttribute('cx',center.x);target.setAttribute('cy',center.y);target.setAttribute('r','21');target.setAttribute('class','map-hit');target.setAttribute('tabindex','0');target.setAttribute('role','button');target.setAttribute('aria-label',`${place}: ${group.length} registro(s). Abrir primera ficha`);
   const act=()=>selectMapItem(group[0]);target.addEventListener('click',act);target.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}});
   const title=document.createElementNS(svgNS,'title');title.textContent=`${place} · ${group.length} registro(s)`;target.append(title);pins.append(target);
   const label=document.createElementNS(svgNS,'text');label.setAttribute('x',center.x+13);label.setAttribute('y',center.y-12);label.setAttribute('class','map-label');label.textContent=place;pins.append(label);
   for(const item of group){const button=document.createElement('button');button.className='atlas-place';button.type='button';button.setAttribute('aria-label',`Abrir ${item.title} en ${item.place}`);const name=document.createElement('strong');name.textContent=item.place;const details=document.createElement('span');details.textContent=`${item.title} · ${historicalYear(item.year)}`;button.append(name,details);button.addEventListener('click',()=>selectMapItem(item));places.append(button)}
  }
 }
 $('atlasAll').addEventListener('change',e=>{mapState.showAll=e.target.checked;renderAtlas()});
 $('atlasReset').addEventListener('click',()=>{mapState.showAll=false;mapState.selected=null;$('atlasAll').checked=false;$('atlasSelection').textContent='Selecciona un marcador o una ubicación para abrir su ficha histórica.';renderAtlas()});
 for(const era of ERAS){const btn=document.createElement('button');btn.type='button';btn.dataset.id=era.id;btn.textContent=era.label;btn.title=era.detail;btn.addEventListener('click',()=>{stop();setYear(era.year)});$('eras').append(btn)}
 $('goYear').addEventListener('click',()=>{const input=$('jumpYear');if(input.value.trim()===''||!Number.isInteger(Number(input.value))||Number(input.value)<MIN||Number(input.value)>MAX){input.setCustomValidity('Introduce un año entero entre -3399 y 2025');input.reportValidity();return}input.setCustomValidity('');stop();setYear(Number(input.value))});
 $('jumpYear').addEventListener('input',()=> $('jumpYear').setCustomValidity(''));
 $('jumpYear').addEventListener('keydown',e=>{if(e.key==='Enter')$('goYear').click()});
 $('stepSize').addEventListener('change',e=>{state.step=Number(e.target.value)});
 $('play').addEventListener('click',togglePlay);
 $('nearest').addEventListener('click',()=>{stop();const candidate=items.filter(x=>(!state.civilization||x.civilization===state.civilization)&&(!state.type||x.type===state.type)&&(!state.query||[x.title,x.civilization,x.place,x.summary].join(' ').toLocaleLowerCase('es').includes(state.query))).sort((a,b)=>Math.abs(a.year-state.year)-Math.abs(b.year-state.year)||a.year-b.year)[0];if(candidate){state.all=false;$('all').checked=false;setYear(candidate.year)}else{$('contextTitle').textContent='No hay registros que coincidan con los filtros';$('contextText').textContent='Prueba a cambiar los filtros antes de buscar otro año.'}});
 optionValues('civilization',items.map(x=>x.civilization));optionValues('type',items.map(x=>x.type));
 $('time').addEventListener('input',e=>{stop();setYear(Number(e.target.value))});
 for(const [id,delta] of [['prev',-1],['next',1]])$(id).addEventListener('click',()=>{stop();setYear(state.year+delta*state.step)});
 $('civilization').addEventListener('change',e=>{state.civilization=e.target.value;render()});
 $('type').addEventListener('change',e=>{state.type=e.target.value;render()});
 $('search').addEventListener('input',e=>{state.query=e.target.value.trim().toLocaleLowerCase('es');render()});
 $('all').addEventListener('change',e=>{state.all=e.target.checked;render()});
 $('close').addEventListener('click',()=>$('detail').close());
 $('random').addEventListener('click',()=>{stop();const item=items[Math.floor(Math.random()*items.length)];state.year=item.year;state.civilization='';state.type='';state.query='';state.all=false;$('civilization').value='';$('type').value='';$('search').value='';$('all').checked=false;render();openDetail(item)});
 $('detail').addEventListener('click',e=>{if(e.target===$('detail'))$('detail').close()});

 const CULTURES=[
  {name:'Mesopotamia',period:'IV–I milenio a. C.',description:'Ciudades-estado, reinos, escritura y organización urbana en los valles del Tigris y el Éufrates.',source:'https://www.britannica.com/place/Mesopotamia-historical-region-Asia'},
  {name:'Egipto',period:'c. 3100–30 a. C.',description:'Tradiciones dinásticas, administración del Nilo, templos y complejos funerarios.',source:'https://www.britannica.com/place/ancient-Egypt'},
  {name:'Grecia',period:'Antigüedad griega',description:'Ciudades-estado, redes mediterráneas, formas políticas diversas y cultura helénica.',source:'https://www.britannica.com/place/ancient-Greece'},
  {name:'Roma',period:'Monarquía, República e Imperio',description:'Un mundo mediterráneo de instituciones políticas, ingeniería, intercambios y transformaciones.',source:'https://www.britannica.com/place/ancient-Rome'},
  {name:'Maya',period:'c. 2000 a. C.–actualidad',description:'Tradiciones mesoamericanas de larga duración; las comunidades mayas continúan existiendo hoy.',source:'https://www.britannica.com/topic/Maya-people'},
  {name:'Teotihuacana',period:'c. 100 a. C.–550 d. C.',description:'Gran urbanismo de Mesoamérica; su organización política sigue siendo objeto de investigación.',source:'https://whc.unesco.org/en/list/414/'},
  {name:'Califato abasí',period:'750–1258 d. C. (Bagdad)',description:'Dinastía que impulsó grandes redes de intercambio y producción intelectual.',source:'https://www.britannica.com/topic/Abbasid-caliphate'},
  {name:'Francos',period:'Alta Edad Media',description:'Diversos reinos francos y el imperio carolingio en Europa occidental.',source:'https://www.britannica.com/topic/Frank-people'},
  {name:'Jemer',period:'siglos IX–XV',description:'Poderes políticos del sudeste asiático vinculados a Angkor y a redes regionales.',source:'https://whc.unesco.org/en/list/668/'},
  {name:'Mexica',period:'siglos XIV–XVI',description:'Sociedad mesoamericana cuyo centro político principal fue México-Tenochtitlán.',source:'https://www.britannica.com/topic/Aztec'},
  {name:'Bizantina',period:'Antigüedad tardía–1453',description:'Continuidad y transformación del Imperio romano oriental, con capital en Constantinopla.',source:'https://www.britannica.com/place/Byzantine-Empire'},
  {name:'Inca',period:'siglos XV–XVI',description:'Formación estatal andina con extensas redes de caminos, administración y arquitectura.',source:'https://www.britannica.com/topic/Inca'},
  {name:'Europa moderna',period:'siglos XV–XIX (selección)',description:'Etiqueta temática de procesos europeos, no una única civilización homogénea.',source:'https://www.britannica.com/topic/history-of-Europe'},
  {name:'Era contemporánea',period:'siglos XX–XXI (selección)',description:'Etiqueta temática para acontecimientos de alcance contemporáneo, no una civilización.',source:'https://www.nasa.gov/mission/apollo-11/'}
 ];
 const cultureList=$('cultureList'),cultureStatus=$('cultureStatus');
 function renderCultures(){
  cultureList.replaceChildren();const term=$('cultureSearch').value.trim().toLocaleLowerCase('es');
  const found=CULTURES.filter(c=>!term||[c.name,c.description,c.period].join(' ').toLocaleLowerCase('es').includes(term));
  cultureStatus.textContent=`${found.length} DE ${CULTURES.length} PERFILES`;
  for(const culture of found){const related=items.filter(item=>item.civilization===culture.name);const article=document.createElement('article');article.className='culture-card';
   const h=document.createElement('h3');h.textContent=culture.name;const era=document.createElement('small');era.textContent=culture.period;const p=document.createElement('p');p.textContent=culture.description;
   const meta=document.createElement('span');meta.className='culture-meta';meta.textContent=`${related.length} registros vinculados`;
   const actions=document.createElement('div');actions.className='culture-actions';const explore=document.createElement('button');explore.type='button';explore.textContent='EXPLORAR REGISTROS ↗';explore.disabled=!related.length;explore.title=related.length?'Explorar registros vinculados':'Todavía no hay registros vinculados a este perfil';explore.addEventListener('click',()=>{stop();state.civilization=culture.name;state.type='';state.query='';state.all=true;$('civilization').value=culture.name;$('type').value='';$('search').value='';$('all').checked=true;mapState.showAll=true;$('atlasAll').checked=true;render();$('results').scrollIntoView({behavior:'smooth',block:'start'})});
   const jump=document.createElement('button');jump.type='button';jump.textContent='VIAJAR A SU ÉPOCA';jump.disabled=!related.length;jump.addEventListener('click',()=>{stop();state.civilization=culture.name;state.all=false;state.type='';state.query='';$('civilization').value=culture.name;$('type').value='';$('search').value='';$('all').checked=false;setYear(related[0].year);$('time-title').scrollIntoView({behavior:'smooth'})});
   const source=document.createElement('a');source.href=culture.source;source.target='_blank';source.rel='noopener noreferrer';source.textContent='FUENTE GENERAL ↗';actions.append(explore,jump,source);article.append(h,era,p,meta,actions);cultureList.append(article);
  }
  $('cultureEmpty').hidden=found.length!==0;
 }
 $('cultureSearch').addEventListener('input',renderCultures);
 $('cultureClear').addEventListener('click',()=>{$('cultureSearch').value='';renderCultures();$('cultureSearch').focus()});
 renderCultures();
 render();
 window.CHRONOS_TEST={historicalYear,matches,mapMatches,state,mapState,render,setYear,ERAS,stop,LOCATIONS};
})();
