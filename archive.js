"use strict";
(()=>{
 const records=window.CHRONOS_ARCHIVE || [], timeline=window.CHRONOS_DATA || [];
 const $=id=>document.getElementById(id);
 const search=$('archiveSearch'), category=$('archiveCategory'), grid=$('archiveGrid'), count=$('archiveCount'), empty=$('archiveNoResults');
 if(!search||!category||!grid) return;
 const categories=[...new Map(records.map(r=>[r.category,r.label])).entries()];
 categories.forEach(([v,l])=>{let opt=document.createElement('option');opt.value=v;opt.textContent=l;category.append(opt)});
 function build(tag,className,content){let e=document.createElement(tag);if(className)e.className=className;if(content!==undefined)e.textContent=content;return e}
 function render(){
  const needle=search.value.trim().toLocaleLowerCase('es'),cat=category.value;
  const shown=records.filter(r=>(!cat||r.category===cat)&&[r.title,r.civilization,r.description,r.date,r.label].some(x=>x.toLocaleLowerCase('es').includes(needle)));
  grid.replaceChildren(); empty.hidden=shown.length!==0;count.textContent=`${shown.length} / ${records.length} FICHAS`;
  shown.forEach(r=>{
   let article=build('article','documentary-card'), top=build('div','doc-overline',`${r.label} · ${r.civilization}`),title=build('h3','',r.title),date=build('p','doc-date',r.date),description=build('p','',r.description),actions=build('div','doc-actions');
   let source=build('a','','CONSULTAR FUENTE ↗');source.href=r.source;source.target='_blank';source.rel='noopener noreferrer';actions.append(source);
   let linked=timeline.find(t=>t.id===r.related);
   if(linked){let jump=build('button','', 'VER EN LA CRONOLOGÍA →');jump.type='button';jump.addEventListener('click',()=>{
     let input=$('jumpYear'), go=$('goYear'), all=$('all');
     if(input&&go){input.value=linked.year;go.click()}
     if(all&&!all.checked){all.click()}
     // Un salto desde la biblioteca debe retirar filtros incompatibles anteriores.
     for(const id of ['civilization','type']){const field=$(id);if(field&&field.value){field.value='';field.dispatchEvent(new Event('change',{bubbles:true}))}}
     let q=$('search');if(q){q.value=linked.title;q.dispatchEvent(new Event('input',{bubbles:true}))}
     $('results')?.scrollIntoView({behavior:'smooth',block:'start'});
   });actions.append(jump)}
   article.append(top,title,date,description,actions);grid.append(article)
  });
 }
 search.addEventListener('input',render); category.addEventListener('change',render);
 $('archiveClear').addEventListener('click',()=>{search.value='';category.value='';render();search.focus()});render();
})();
