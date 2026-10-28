// Fit the entire atlas as an organic radial mind-map; zooming never collapses its fields or story lights.
export function createMindMap({svg,frame,language,onActivate,onDismiss}) {
  const d3=globalThis.d3;
  if(!d3?.zoom||!d3?.select)throw new Error('Map renderer unavailable');
  const zh=language==='zh',surface=d3.select(svg),scene=surface.append('g').attr('class','map-viewport');
  const orbits=scene.append('g').attr('class','map-orbits').attr('aria-hidden','true');
  const links=scene.append('g').attr('class','map-links').attr('aria-hidden','true');
  const marks=scene.append('g').attr('class','map-nodes');
  const mini=d3.select(document.getElementById('map-minimap')),miniW=176,miniH=120;
  mini.attr('viewBox',`0 0 ${miniW} ${miniH}`);
  mini.append('defs').append('clipPath').attr('id','map-mini-clip').append('rect').attr('x',3).attr('y',3).attr('width',miniW-6).attr('height',miniH-6);
  const miniPlot=mini.append('g').attr('clip-path','url(#map-mini-clip)'),miniLines=miniPlot.append('g'),miniNodes=miniPlot.append('g');
  const miniWindow=miniPlot.append('rect').attr('class','map-mini-window');
  const measure=document.createElement('canvas').getContext('2d'),family=getComputedStyle(svg).fontFamily;
  const canvas=frame.querySelector('.map-canvas')||frame;
  let tooltip=canvas.querySelector('.map-tooltip');
  if(!tooltip){
    tooltip=document.createElement('div');
    tooltip.className='map-tooltip';
    tooltip.setAttribute('role','tooltip');
    tooltip.hidden=true;
    canvas.appendChild(tooltip);
  }
  function showTooltip(label,event){
    if(!label||!tooltip)return;
    tooltip.textContent=label;
    tooltip.hidden=false;
    const canvasRect=canvas.getBoundingClientRect();
    const x=event.clientX-canvasRect.left,y=event.clientY-canvasRect.top;
    const pad=8,tw=tooltip.offsetWidth||140,th=tooltip.offsetHeight||24;
    const left=Math.max(pad,Math.min(canvasRect.width-tw-pad,x-tw/2));
    const top=y-th-10>=pad?y-th-10:y+16;
    tooltip.style.left=`${left}px`;
    tooltip.style.top=`${top}px`;
  }
  function hideTooltip(){if(tooltip)tooltip.hidden=true;}
  let model,nodes=[],canonical=[],positions=new Map(),orbitRadii=[],layoutKey='',config,width=canvas.clientWidth,height=canvas.clientHeight,viewKey=null,focusMode=null,miniScale=1,viewMode='all';
  const header=document.querySelector('.topbar'),toolbar=document.querySelector('.atlas-toolbar');
  const syncHeader=()=>{const section=frame.closest('.overview-directory');section?.style.setProperty('--atlas-header-height',`${header?.getBoundingClientRect().height||0}px`);section?.style.setProperty('--atlas-toolbar-height',`${toolbar?.offsetHeight||0}px`);section?.style.setProperty('--atlas-map-top',`${frame.getBoundingClientRect().top+scrollY}px`);};
  if(header)new ResizeObserver(syncHeader).observe(header);if(toolbar)new ResizeObserver(syncHeader).observe(toolbar);new ResizeObserver(syncHeader).observe(document.querySelector('.overview-hero'));syncHeader();
  const text=(g,label,x,y,className)=>g.append('text').attr('class',className).attr('x',x).attr('y',y).text(label);
  function area(){const top=10,bottom=10;return {w:Math.max(160,width-20),h:Math.max(120,height-top-bottom),cx:width/2,cy:height/2,top,bottom};}
  const zoom=d3.zoom().scaleExtent([.07,6]).clickDistance(6).on('zoom',event=>{
    hideTooltip();
    scene.attr('transform',event.transform);
    document.getElementById('map-zoom').value=`${Math.round(event.transform.k*100)}%`;
    document.getElementById('map-zoom-in').disabled=event.transform.k>=5.99;document.getElementById('map-zoom-out').disabled=event.transform.k<=.071;
    if(config)svg.dataset.displayFontSize=(config.name*event.transform.k).toFixed(2);
    if(event.sourceEvent){focusMode=null;setViewMode('custom');}updateMini();
  });
  surface.call(zoom).on('dblclick.zoom',null);
  function wrap(label,size,maxWidth,weight=500,breakWords=true){
    measure.font=`${weight} ${size}px ${family}`;
    const raw=String(label).match(/\p{Script=Han}|[^\s\p{Script=Han}]+|\s+/gu)||[];
    const tokens=raw.flatMap(token=>breakWords&&measure.measureText(token).width>maxWidth?[...token]:[token]);const lines=[];let line='';
    for(const token of tokens){if(line&&measure.measureText(line+token).width>maxWidth){lines.push(line.trim());line=token.trimStart();}else line+=token;}
    if(line.trim())lines.push(line.trim());
    return lines;
  }
  function settings(scale){
    const phone=width<700,tablet=width<1100,large=width>=1700&&height>=720;
    const name=(large?15:phone?8.2:tablet?11:width<1350?12.5:14)*scale;
    return {scale,phone,name,small:name*.85,resource:name*.75,line:name*1.16,pad:2*scale,light:name*.235,gap:(phone?2.5:tablet?4.5:6.5)*scale,
      fieldWidth:(large?(zh?158:168):phone?(zh?70:78):tablet?(zh?110:120):width<1350?(zh?130:142):(zh?142:152))*scale,
      categoryWidth:(phone?46:tablet?84:126)*scale,categorySize:name*1.3,categoryRadius:(phone?3:6.8)*scale,rootRadius:(phone?22:33)*scale};
  }
  function metrics(item,c){
    if(item.kind==='root')return{w:c.rootRadius*2+10*c.scale,h:c.rootRadius*2+10*c.scale};
    if(item.kind==='category'){
      const short=zh?['通用','教育','艺术人文','社会科学','商业法律','自然科学','信息技术','工程建筑','农林渔牧','健康福利','服务']:['General','Edu','Arts','Society','Biz','Science','ICT','Eng','Agri','Health','Services'];
      const label=c.phone?(short[Number(item.item.code)]||item.label):item.label;
      const lines=wrap(label,c.categorySize,c.categoryWidth-4*c.scale,700,false),line=c.categorySize*1.12;
      const w=Math.max(c.categoryWidth,...lines.map(value=>measure.measureText(value).width+6*c.scale));
      return {w,h:c.categoryRadius*2+lines.length*line+7*c.scale,lines,line};
    }
    const lines=wrap(item.label,c.name,c.fieldWidth-2*c.pad),nameHeight=lines.length*c.line;
    const radius=c.light*1.55,resourceY=nameHeight+1+radius+Math.max(1,c.scale*1.4),versionY=resourceY;
    const w=Math.max(c.fieldWidth,Math.ceil(c.name*8.6+c.pad*2));
    return {w,h:c.pad+resourceY+radius+Math.max(1,c.scale*1.2),lines,nameHeight,resourceY,versionY};
  }
  const intersects=(a,b)=>a.x<b.x+b.w-.01&&a.x+a.w>b.x+.01&&a.y<b.y+b.h-.01&&a.y+a.h>b.y+.01;
  function pack(all,c){
    const a=area(),gap=c.gap,bounds={x:-a.w/2+4,y:-a.h/2+4,w:a.w-8,h:a.h-8},placed=new Map();
    let free=[bounds];
    function occupy(box){
      const next=[];
      for(const r of free){
        if(!intersects(r,box)){next.push(r);continue;}
        if(box.x>r.x)next.push({x:r.x,y:r.y,w:box.x-r.x,h:r.h});
        if(box.x+box.w<r.x+r.w)next.push({x:box.x+box.w,y:r.y,w:r.x+r.w-box.x-box.w,h:r.h});
        if(box.y>r.y)next.push({x:r.x,y:r.y,w:r.w,h:box.y-r.y});
        if(box.y+box.h<r.y+r.h)next.push({x:r.x,y:box.y+box.h,w:r.w,h:r.y+r.h-box.y-box.h});
      }
      free=next.filter((r,i)=>r.w>1&&r.h>1&&!next.some((s,j)=>j!==i&&s.x<=r.x+.001&&s.y<=r.y+.001&&s.x+s.w>=r.x+r.w-.001&&s.y+s.h>=r.y+r.h-.001&&(s.w*s.h>r.w*r.h+.001||j<i)));
    }
    const categories=all.filter(n=>n.kind==='category'),total=categories.reduce((n,v)=>n+(v.children?.length||0),0)||1,angles=new Map();
    let start=-Math.PI/2;
    const firstSpan=(.52/categories.length+.48*(categories[0]?.children?.length||0)/total)*Math.PI*2;
    start-=firstSpan/2;
    categories.forEach((n,idx)=>{
      const span=(.52/categories.length+.48*(n.children?.length||0)/total)*Math.PI*2;
      angles.set(n.id,{angle:start+span/2,span,idx});
      start+=span;
    });
    const fixed=[];
    const rootNode=all.find(n=>n.kind==='root');
    if(rootNode){
      const rm=metrics(rootNode,c),rBox={x:-rm.w/2-gap,y:-rm.h/2-gap,w:rm.w+gap*2,h:rm.h+gap*2};
      fixed.push(rBox);placed.set(rootNode.id,{x:0,y:0,m:rm});occupy(rBox);
    }
    const baseRx=a.w*(c.phone?.22:.205),baseRy=a.h*(c.phone?.18:.225);
    for(const n of categories){
      const m=metrics(n,c),t=angles.get(n.id),alt=t.idx%2?1.08:.94;
      let placedCat=null;
      for(let step=0;step<=12;step++){
        const mult=alt+step*.035;
        const x=Math.cos(t.angle)*baseRx*mult,y=Math.sin(t.angle)*baseRy*mult;
        const box={x:x-m.w/2-gap/2,y:y-m.h/2-gap/2,w:m.w+gap,h:m.h+gap};
        if(box.x>=bounds.x&&box.y>=bounds.y&&box.x+box.w<=bounds.x+bounds.w&&box.y+box.h<=bounds.y+bounds.h&&!fixed.some(b=>intersects(b,box))){
          placedCat={x,y,m,box};break;
        }
      }
      if(!placedCat)return null;
      fixed.push(placedCat.box);placed.set(n.id,{x:placedCat.x,y:placedCat.y,m});occupy(placedCat.box);
    }
    // Interleave field placement round-robin across categories so small categories (like 00 and 06) claim their local cluster before large categories expand outward
    const fields=all.filter(n=>n.kind==='field').map(n=>{
      const siblings=n.parent.children||[n],index=siblings.findIndex(f=>f.id===n.id);
      const centerRank=Math.abs(index-(siblings.length-1)/2);
      return {...n,m:metrics(n,c),index,siblingsCount:siblings.length,centerRank};
    }).sort((u,v)=>u.index-v.index||u.siblingsCount-v.siblingsCount||v.m.h-u.m.h||u.item.code.localeCompare(v.item.code));
    for(const n of fields){
      const {angle,span,idx}=angles.get(n.parent.id),catPos=placed.get(n.parent.id);
      const {index,siblingsCount}=n;
      const fraction=siblingsCount<2?0:index/(siblingsCount-1)-.5;
      const fanSpread=Math.min(span*.88,1.12);
      const theta=angle+fraction*fanSpread;
      const tier=siblingsCount<=4?(index%2):(index%3);
      const wave=((index*7+idx*3)%5-2)*.02;
      const radial=.52+tier*.145+Math.abs(fraction)*.065+wave;
      const outerX=Math.cos(theta)*a.w*.46*radial,outerY=Math.sin(theta)*a.h*.46*radial;
      const branchDist=(c.phone?50:82)*c.scale*(1+tier*.35);
      const anchorX=catPos.x+Math.cos(theta)*branchDist,anchorY=catPos.y+Math.sin(theta)*branchDist*.85;
      const tx=outerX*.58+anchorX*.42,ty=outerY*.58+anchorY*.42;
      const w=n.m.w+gap,h=n.m.h+gap;
      const catRNorm=Math.hypot(catPos.x/a.w,catPos.y/a.h);
      let best=null;
      for(const r of free){
        if(r.w+.001<w||r.h+.001<h)continue;
        const px=Math.max(r.x,Math.min(r.x+r.w-w,tx-w/2));
        const py=Math.max(r.y,Math.min(r.y+r.h-h,ty-h/2));
        const cxMid=r.x+(r.w-w)/2,cyMid=r.y+(r.h-h)/2;
        const candidates=[
          [px,py],
          [px,r.y],[px,r.y+r.h-h],[r.x,py],[r.x+r.w-w,py],
          [cxMid,cyMid],
          [r.x,r.y],[r.x+r.w-w,r.y],[r.x,r.y+r.h-h],[r.x+r.w-w,r.y+r.h-h],
        ];
        for(const [x,y] of candidates){
          const cx=x+w/2,cy=y+h/2;
          const direction=Math.atan2(cy/a.h,cx/a.w);
          const da=Math.atan2(Math.sin(direction-angle),Math.cos(direction-angle));
          const sectorExcess=Math.max(0,Math.abs(da)-span*.68);
          const rNorm=Math.hypot(cx/a.w,cy/a.h);
          const inward=rNorm<catRNorm*.84?(catRNorm*.84-rNorm)**2*4.2:0;
          const distTarget=((cx-tx)/a.w)**2+((cy-ty)/a.h)**2;
          const distCat=((cx-catPos.x)/a.w)**2+((cy-catPos.y)/a.h)**2;
          const score=distTarget*1.1+distCat*.95+da*da*1.15+sectorExcess*sectorExcess*6.5+inward+(r.w*r.h-w*h)/(a.w*a.h)*.005;
          if(!best||score<best.score)best={x,y,w,h,score};
        }
      }
      if(!best)return null;
      placed.set(n.id,{x:best.x+best.w/2,y:best.y+best.h/2,m:n.m});
      occupy(best);
    }
    return {placed,orbits:[{rx:baseRx,ry:baseRy},{rx:a.w*.38,ry:a.h*.39}]};
  }
  function flatten(data){const root={...data.root},all=[root];for(const category of data.categories){const c={...category,parent:root};all.push(c);for(const field of category.children||[])all.push({...field,parent:c});}return all;}
  function layout(data){
    width=canvas.clientWidth;height=canvas.clientHeight;
    const all=flatten(data);if(!canonical.length||all.filter(n=>n.kind==='field').length===80)canonical=all;
    const key=`${width}|${height}|${Math.round(area().h)}|${language}`;
    if(layoutKey!==key){
      let result;
      for(const scale of [1,.97,.94,.91,.88,.85,.82,.79,.76,.73,.7,.67,.64,.61,.58,.55,.52,.49,.46,.43,.4]){const c=settings(scale);result=pack(canonical,c);if(result){config=c;break;}}
      if(!result)throw new Error('Unable to fit the complete atlas');
      positions=result.placed;orbitRadii=result.orbits;layoutKey=key;
      svg.dataset.labelSize=config.name.toFixed(2);
      svg.dataset.blockedLinks='0';
    }
    return all.map(n=>({...n,...positions.get(n.id)}));
  }
  function light(group,x,y,signal,size='main'){
    const g=group.append('g').attr('role','img').attr('aria-label',signal.label),r=config.light*1.55*(size==='story'?.95:1);
    g.append('title').text(signal.label);
    g.append('circle').attr('class',`map-light ${size}${signal.ready===undefined?' unknown':signal.ready?` on${size==='story'&&signal.newer===false?' earlier':''}`:' missing'}`).attr('cx',x).attr('cy',y).attr('r',r);
    if(size!=='story'){
      g.on('pointerenter',event=>showTooltip(signal.label,event))
       .on('pointermove',event=>showTooltip(signal.label,event))
       .on('pointerleave',hideTooltip);
    }
    return g;
  }
  function drawNode(element,node){
    const g=d3.select(element),c=config;g.selectAll('*').remove();g.append('title').text(node.description||node.label);
    if(node.kind==='root'){
      const symbol=g.append('g').attr('class','map-root-symbol');
      symbol.append('circle').attr('class','map-root-halo').attr('r',c.rootRadius+4.5*c.scale);
      symbol.append('circle').attr('class','map-root-disc').attr('r',c.rootRadius);
      text(symbol,'MapKAI',0,-3*c.scale,'map-root-title').attr('font-size',c.rootRadius*.49);
      text(symbol,zh?'80 科 · 240 故事':'80 fields',0,c.rootRadius*(zh ? .4 : .3),'map-root-meta').attr('font-size',c.rootRadius*.235);if(!zh)text(symbol,'240 stories',0,c.rootRadius*.62,'map-root-meta').attr('font-size',c.rootRadius*.235);return;
    }
    const {m}=node,top=-m.h/2,left=-m.w/2+c.pad;
    g.append('rect').attr('class','map-hit').attr('x',-m.w/2).attr('y',top).attr('width',m.w).attr('height',m.h);
    if(node.kind==='category'){
      const cy=top+c.categoryRadius+2*c.scale,r=c.categoryRadius,circ=2*Math.PI*r;
      g.append('circle').attr('class','map-category-ring').attr('cy',cy).attr('r',r);
      g.append('circle').attr('class','map-category-progress').attr('r',r).attr('stroke-dasharray',`${(node.total?node.complete/node.total:0)*circ} ${circ}`).attr('transform',`translate(0,${cy}) rotate(-90)`);
      if(!c.phone)text(g,node.item.code,0,cy+c.categoryRadius*.4,'map-category-code').attr('font-size',c.categoryRadius*1.12);
      const label=g.append('text').attr('class','map-label').attr('font-size',c.categorySize).attr('text-anchor','middle');
      m.lines.forEach((line,i)=>label.append('tspan').attr('x',0).attr('y',top+c.categoryRadius*2+4*c.scale+c.categorySize+i*m.line).text(line));return;
    }
    const label=g.append('text').attr('class','map-label').attr('font-size',c.name);
    m.lines.forEach((line,i)=>label.append('tspan').attr('x',left).attr('y',top+c.pad+c.name+i*c.line).text(line));
    g.append('path').attr('class','map-underline').attr('d',`M${-m.w/2},${top+c.pad+m.nameHeight+1}H${m.w/2}`);
    const radius=c.light*1.55,mainStep=c.name*1.6,mainWidth=radius*2+mainStep*2,y=top+c.pad+m.resourceY;
    const resources=g.append('g').attr('class','map-resource-lights');
    node.signals.forEach((signal,i)=>light(resources,left+radius+i*mainStep,y,signal));
    const storyRadius=radius*.95,step=mainStep*.95,divider=left+mainWidth+c.small*.55,storyLeft=divider+c.small*.55+storyRadius;
    g.append('line').attr('class','map-lamp-divider').attr('x1',divider).attr('x2',divider).attr('y1',y-radius).attr('y2',y+radius);
    const stories=g.append('g').attr('class','map-story-lights');
    node.storySignals.forEach((signal,i)=>{
      const x=storyLeft+i*step,y=top+c.pad+m.versionY;
      const storyTip=`${i+1}. ${signal.label}`;
      const tag=stories.append('g').attr('class',`map-story-tag ${signal.newer?'newer':'older'}${model.selected===signal.node.id?' is-selected':''}`).attr('data-story-id',signal.id).attr('role','button').attr('tabindex',0).attr('aria-label',storyTip).attr('aria-pressed',String(model.selected===signal.node.id))
        .on('click',event=>{event.stopPropagation();onActivate(signal.node);}).on('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();onActivate(signal.node);}}).on('focus',function(){if(this.matches(':focus-visible'))ensureVisible(node);})
        .on('pointerenter',event=>showTooltip(storyTip,event))
        .on('pointermove',event=>showTooltip(storyTip,event))
        .on('pointerleave',hideTooltip);
      tag.append('rect').attr('class','map-story-hit').attr('x',x-step/2).attr('y',y-radius-1).attr('width',step).attr('height',radius*2+2);
      light(tag,x,y,signal,'story');
    });
  }
  function linkPath(n){
    const r=config.rootRadius;
    if(n.kind==='category'){
      const ty=n.y-n.m.h/2+config.categoryRadius+2*config.scale,angle=Math.atan2(ty,n.x);
      const sx=Math.cos(angle)*(r+2),sy=Math.sin(angle)*(r+2);
      const bend=Math.sin(angle*2)*14*config.scale;
      const nx=-Math.sin(angle)*bend,ny=Math.cos(angle)*bend;
      return `M${sx},${sy}C${n.x*.42+nx},${ty*.42+ny} ${n.x*.78+nx*.4},${ty*.78+ny*.4} ${n.x},${ty}`;
    }
    const p=positions.get(n.parent.id);
    const side=n.x>=p.x?-1:1;
    const tx=n.x+side*n.m.w/2,ty=n.y-n.m.h/2+config.pad+n.m.nameHeight+1;
    const sy=p.y-p.m.h/2+config.categoryRadius+2*config.scale;
    const dx=tx-p.x,dy=ty-sy;
    return `M${p.x},${sy}C${p.x+dx*.44},${sy+dy*.14} ${tx-dx*.22},${ty} ${tx},${ty}`;
  }
  function render(data){
    model=data;nodes=layout(data);surface.attr('viewBox',`0 0 ${width} ${height}`).attr('width',width).attr('height',height);svg.dataset.nodes=String(nodes.length);frame.dataset.layout='radial';
    orbits.selectAll('ellipse').data(orbitRadii).join('ellipse').attr('cx',0).attr('cy',0).attr('rx',d=>d.rx).attr('ry',d=>d.ry);
    const selectedField=nodes.find(node=>node.kind==='field'&&(node.id===data.selected||node.storySignals.some(story=>story.node.id===data.selected)));
    const selectedCategory=selectedField?.parent.id||(nodes.some(n=>n.kind==='category'&&n.id===data.selected)?data.selected:null);
    const activeNode=document.activeElement?.dataset.node,activeStory=document.activeElement?.dataset.storyId;
    links.selectAll('path').data(nodes.filter(n=>n.parent),n=>n.id).join('path')
      .attr('class',n=>`map-link ${n.kind==='category'?'map-trunk':n.score===3?'complete-link':''}${n.matched===false?' is-dimmed':''}${(n.id===selectedCategory||n.parent?.id===selectedCategory)?' is-highlighted':''}`)
      .attr('data-target',n=>n.id).attr('d',linkPath);
    const joined=marks.selectAll('g.map-node').data(nodes,n=>n.id).join('g')
      .attr('class',n=>`map-node map-${n.kind}${n.id===data.selected||n.id===selectedCategory?' is-selected':''}${n.score===3?' is-complete':''}${n.kind!=='root'&&n.matched===false?' is-dimmed':''}`)
      .attr('data-node',n=>n.id).attr('data-kind',n=>n.kind).attr('data-parent',n=>n.parent?.id||null).attr('transform',n=>`translate(${n.x},${n.y})`)
      .attr('role','button').attr('tabindex',0).attr('aria-label',n=>n.description||n.label).attr('aria-controls',n=>n.kind!=='root'?'map-selection':null).attr('aria-expanded',n=>n.kind==='field'?String(n.id===data.selected||n.storySignals.some(s=>s.node.id===data.selected)):null).attr('aria-pressed',n=>String(n.id===data.selected))
      .on('click',(event,n)=>{event.stopPropagation();onActivate(n);}).on('keydown',(event,n)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();onActivate(n);}}).on('focus',function(_,n){if(this.matches(':focus-visible'))ensureVisible(n);});
    joined.each(function(n){drawNode(this,n);});drawMini();
    if(activeStory)marks.selectAll('[data-story-id]').filter(function(){return this.dataset.storyId===activeStory;}).node()?.focus({preventScroll:true});else if(activeNode)joined.filter(n=>n.id===activeNode).node()?.focus({preventScroll:true});
    const nextKey=data.viewKey||'';
    if(viewKey!==nextKey){viewKey=nextKey;const matches=nodes.filter(n=>n.kind==='field'&&n.matched!==false);if(data.searching&&matches.length&&matches.length<=8){focusMode={kind:'results'};setViewMode('custom');focusBounds(matches,false);}else fit(false);}
    else surface.call(zoom.transform,d3.zoomTransform(svg));
  }
  function setViewMode(mode){viewMode=mode;frame.dataset.view=mode;document.getElementById('map-fit').setAttribute('aria-pressed',String(mode==='all'));}
  function moveCamera(transform,animate=true){const target=animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches?surface.transition().duration(300):surface;target.call(zoom.transform,transform);}
  function fit(animate=true){
    if(!nodes.length)return;focusMode=null;setViewMode('all');
    const a=area(),bx=Math.max(...nodes.map(n=>Math.abs(n.x)+n.m.w/2))+10,by=Math.max(...nodes.map(n=>Math.abs(n.y)+n.m.h/2))+10;
    const k=Math.max(.07,Math.min(nodes.some(n=>n.kind==='field')?1:2,a.w/(2*bx),a.h/(2*by)));
    moveCamera(d3.zoomIdentity.translate(a.cx,a.cy).scale(k),animate);
  }
  function focusBounds(group,animate=true){
    const left=Math.min(...group.map(n=>n.x-n.m.w/2)),right=Math.max(...group.map(n=>n.x+n.m.w/2)),top=Math.min(...group.map(n=>n.y-n.m.h/2)),bottom=Math.max(...group.map(n=>n.y+n.m.h/2)),a=area();
    const panel=document.getElementById('map-selection');let availableW=width-24,availableH=a.h;
    if(!panel.hidden){const box=panel.getBoundingClientRect(),viewport=canvas.getBoundingClientRect();if(width>780)availableW=Math.max(width*.48,box.left-viewport.left-24);else availableH=Math.max(110,Math.min(a.h,box.top-viewport.top-a.top-14));}
    const ceiling=group.length===1?(width<700?22:27)/config.name:2.5;
    const k=Math.max(.15,Math.min(4.5,ceiling,(availableW-32)/(right-left+28),(availableH-20)/(bottom-top+24)));
    moveCamera(d3.zoomIdentity.translate(12+availableW/2-k*(left+right)/2,a.top+availableH/2-k*(top+bottom)/2).scale(k),animate);
  }
  function focusCategory(code,animate=true){if(!code){fit(animate);return;}const id=`category-${code}`,group=nodes.filter(n=>n.id===id||n.parent?.id===id);if(!group.length)return;focusMode={kind:'category',code};setViewMode('custom');focusBounds(group,animate);}
  function focusNode(id,animate=true){const n=nodes.find(n=>n.id===id);if(!n)return;focusMode={kind:'node',id};setViewMode('custom');focusBounds([n],animate);}
  function ensureVisible(n){const rect=canvas.getBoundingClientRect(),a=area();if(rect.bottom<150||rect.top>innerHeight-100)frame.scrollIntoView({block:'center',behavior:'instant'});const t=d3.zoomTransform(svg),x=t.applyX(n.x),y=t.applyY(n.y);if(x<10||x>width-10||y<a.top||y>height-10){setViewMode('custom');moveCamera(d3.zoomIdentity.translate(a.cx-t.k*n.x,a.cy-t.k*n.y).scale(t.k),false);}}
  function drawMini(){
    const bx=Math.max(1,...nodes.map(n=>Math.abs(n.x)+n.m.w/2))+5,by=Math.max(1,...nodes.map(n=>Math.abs(n.y)+n.m.h/2))+5;miniScale=Math.min((miniW-14)/(2*bx),(miniH-14)/(2*by));
    miniLines.selectAll('path').data(nodes.filter(n=>n.parent),n=>n.id).join('path').attr('d',n=>{const p=positions.get(n.parent.id);return `M${miniW/2+p.x*miniScale},${miniH/2+p.y*miniScale}L${miniW/2+n.x*miniScale},${miniH/2+n.y*miniScale}`;});
    miniNodes.selectAll('circle').data(nodes,n=>n.id).join('circle').attr('cx',n=>miniW/2+n.x*miniScale).attr('cy',n=>miniH/2+n.y*miniScale).attr('r',n=>n.kind==='root'?3:n.kind==='category'?2:1.3);updateMini();
  }
  function updateMini(){if(!nodes.length)return;const t=d3.zoomTransform(svg),a=t.invert([0,0]),b=t.invert([width,height]);miniWindow.attr('x',miniW/2+a[0]*miniScale).attr('y',miniH/2+a[1]*miniScale).attr('width',(b[0]-a[0])*miniScale).attr('height',(b[1]-a[1])*miniScale);}
  mini.attr('role','button').attr('tabindex',0).on('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fit();}}).on('click',event=>{const[x,y]=d3.pointer(event,mini.node()),wx=(x-miniW/2)/miniScale,wy=(y-miniH/2)/miniScale,k=d3.zoomTransform(svg).k;focusMode=null;setViewMode('custom');moveCamera(d3.zoomIdentity.translate(width/2-k*wx,height/2-k*wy).scale(k));});
  const scaleBy=factor=>{focusMode=null;setViewMode('custom');const target=matchMedia('(prefers-reduced-motion: reduce)').matches?surface:surface.transition().duration(160);target.call(zoom.scaleBy,factor);};
  document.getElementById('map-zoom-in').addEventListener('click',()=>scaleBy(1.4));document.getElementById('map-zoom-out').addEventListener('click',()=>scaleBy(1/1.4));document.getElementById('map-fit').addEventListener('click',()=>{onDismiss?.();fit();});
  const fullscreen=document.getElementById('map-fullscreen');
  const exitExpanded=()=>{if(!frame.classList.contains('is-expanded'))return;frame.classList.remove('is-expanded');fullscreen.textContent=zh?'全屏':'Full screen';resize();};
  fullscreen.addEventListener('click',async()=>{try{if(document.fullscreenElement===frame)await document.exitFullscreen();else await frame.requestFullscreen();}catch{frame.classList.toggle('is-expanded');fullscreen.textContent=frame.classList.contains('is-expanded')?(zh?'退出全屏':'Exit full screen'):(zh?'全屏':'Full screen');resize();}});
  document.addEventListener('fullscreenchange',()=>{fullscreen.textContent=document.fullscreenElement===frame?(zh?'退出全屏':'Exit full screen'):(zh?'全屏':'Full screen');resize();});document.addEventListener('keydown',e=>{if(e.key==='Escape')exitExpanded();});
  surface.on('keydown.map',e=>{if(e.key==='Escape'){e.stopPropagation();exitExpanded();onDismiss?.();}else if(e.key==='+'||e.key==='='){e.preventDefault();scaleBy(1.4);}else if(e.key==='-'){e.preventDefault();scaleBy(1/1.4);}else if(e.key==='Home'){e.preventDefault();fit();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();focusMode=null;setViewMode('custom');const k=d3.zoomTransform(svg).k;surface.call(zoom.translateBy,(e.key==='ArrowLeft'?70:e.key==='ArrowRight'?-70:0)/k,(e.key==='ArrowUp'?70:e.key==='ArrowDown'?-70:0)/k);}});
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!model||(w===width&&h===height))return;const mode=focusMode,view=viewMode,t=d3.zoomTransform(svg),centre=t.invert([width/2,height/2]);render(model);if(mode?.kind==='category')focusCategory(mode.code,false);else if(mode?.kind==='node')focusNode(mode.id,false);else if(mode?.kind==='results')focusBounds(nodes.filter(n=>n.kind==='field'&&n.matched!==false),false);else if(view==='all')fit(false);else moveCamera(d3.zoomIdentity.translate(w/2-t.k*centre[0],h/2-t.k*centre[1]).scale(t.k),false);}
  new ResizeObserver(resize).observe(canvas);return{render,fit,focusCategory,focusNode};
}
