// A deterministic radial mind map. Camera movement never collapses the catalogue.
export function createMindMap({svg,frame,language,onActivate,onDismiss}) {
  const d3=globalThis.d3;
  if(!d3?.zoom||!d3?.select)throw new Error('Map renderer unavailable');
  const zh=language==='zh',surface=d3.select(svg);
  const scene=surface.append('g').attr('class','map-viewport');
  const guides=scene.append('g').attr('class','map-orbits').attr('aria-hidden','true');
  const links=scene.append('g').attr('class','map-links').attr('aria-hidden','true');
  const marks=scene.append('g').attr('class','map-nodes');
  const mini=d3.select(document.getElementById('map-minimap'));
  const miniW=176,miniH=120;
  mini.attr('viewBox',`0 0 ${miniW} ${miniH}`);
  mini.append('defs').append('clipPath').attr('id','map-mini-clip').append('rect').attr('x',3).attr('y',3).attr('width',miniW-6).attr('height',miniH-6);
  const miniPlot=mini.append('g').attr('clip-path','url(#map-mini-clip)');
  const miniLines=miniPlot.append('g'),miniNodes=miniPlot.append('g');
  const miniWindow=miniPlot.append('rect').attr('class','map-mini-window');
  const measure=document.createElement('canvas').getContext('2d'),family=getComputedStyle(svg).fontFamily;
  const positions=new Map();let model,nodes=[],width=frame.clientWidth,height=frame.clientHeight,viewKey=null,focusMode=null,miniScale=1,spread=1;
  const header=document.querySelector('.topbar');
  const toolbar=document.querySelector('.atlas-toolbar');
  const syncHeader=()=>{const section=frame.closest('.overview-directory');section?.style.setProperty('--atlas-header-height',`${header?.getBoundingClientRect().height||0}px`);section?.style.setProperty('--atlas-toolbar-height',`${toolbar?.offsetHeight||0}px`);};
  if(header)new ResizeObserver(syncHeader).observe(header);if(toolbar)new ResizeObserver(syncHeader).observe(toolbar);syncHeader();
  const text=(g,label,x,y,className)=>g.append('text').attr('class',className).attr('x',x).attr('y',y).text(label);
  const zoom=d3.zoom().scaleExtent([.07,3]).clickDistance(6).on('zoom',event=>{
    scene.attr('transform',event.transform);
    document.getElementById('map-zoom').value=`${Math.round(event.transform.k*100)}%`;
    document.getElementById('map-zoom-in').disabled=event.transform.k>=2.99;
    document.getElementById('map-zoom-out').disabled=event.transform.k<=.071;
    marks.select('.map-root-symbol').attr('transform',`scale(${Math.min(2.6,Math.max(1,1/Math.sqrt(event.transform.k)))})`);
    if(event.sourceEvent)focusMode=null;
    updateMini();
  });
  surface.call(zoom).on('dblclick.zoom',null);
  function wrap(label,size,maxWidth){
    measure.font=`500 ${size}px ${family}`;
    const tokens=String(label).match(/\p{Script=Han}|[^\s\p{Script=Han}]+|\s+/gu)||[];
    const lines=[];let line='';
    for(const token of tokens){if(line&&measure.measureText(line+token).width>maxWidth){lines.push(line.trim());line=token.trimStart();}else line+=token;}
    if(line.trim())lines.push(line.trim());
    if(lines.length>3){lines.length=3;while(measure.measureText(lines[2]+'…').width>maxWidth)lines[2]=lines[2].slice(0,-1);lines[2]+='…';}
    return lines;
  }
  function metrics(item){
    if(item.kind==='root')return {w:210,h:190};
    if(item.kind==='category'){
      const lines=wrap(item.label,19,186);return {w:208,h:76+lines.length*21,lines,last:lines.length*21};
    }
    const lines=wrap(item.label,17,210),last=lines.length*20;
    const statusLines=wrap(item.subtitle,11.5,210),extra=Math.max(0,statusLines.length-1)*13;
    return {w:236,h:last+76+extra,lines,last,statusLines,extra};
  }
  function buildPositions(all){
    const fresh=all.filter(n=>!positions.has(n.id));
    if(!fresh.length)return;
    const simulation=all.map(n=>{
      if(n.kind==='root')return {...n,x:0,y:0,tx:0,ty:0,fixed:true};
      const angle=Number((n.kind==='category'?n.item:n.category).code)*Math.PI*2/11-Math.PI/2;
      if(n.kind==='category')return {...n,x:Math.cos(angle)*400,y:Math.sin(angle)*400,tx:Math.cos(angle)*400,ty:Math.sin(angle)*400,fixed:true};
      const fields=n.parent.children,index=fields.findIndex(f=>f.id===n.id),offset=(index-(fields.length-1)/2)*.041;
      const radius=590+(index%3)*166;
      const x=Math.cos(angle+offset)*radius,y=Math.sin(angle+offset)*radius;
      return {...n,x,y,tx:x,ty:y,fixed:false};
    });
    // Rectangle separation preserves upright labels and a clear central hub.
    for(let round=0;round<430;round++){
      const attraction=round<180?.018*(1-round/180):0;
      for(const n of simulation)if(!n.fixed){n.x+=(n.tx-n.x)*attraction;n.y+=(n.ty-n.y)*attraction;}
      for(let i=0;i<simulation.length;i++)for(let j=i+1;j<simulation.length;j++){
        const a=simulation[i],b=simulation[j];if(a.fixed&&b.fixed)continue;
        const dx=b.x-a.x,dy=b.y-a.y;
        const ox=(a.m.w+b.m.w)/2+20-Math.abs(dx),oy=(a.m.h+b.m.h)/2+20-Math.abs(dy);
        if(ox<=0||oy<=0)continue;
        const moveX=ox<oy?(dx>=0?1:-1)*(ox+.15):0,moveY=ox<oy?0:(dy>=0?1:-1)*(oy+.15);
        const shareA=a.fixed?0:b.fixed?1:.5,shareB=b.fixed?0:a.fixed?1:.5;
        a.x-=moveX*shareA;a.y-=moveY*shareA;b.x+=moveX*shareB;b.y+=moveY*shareB;
      }
      for(const n of simulation)if(!n.fixed){const radius=Math.hypot(n.x,n.y);if(radius<555){n.x*=555/radius;n.y*=555/radius;}}
    }
    for(const n of simulation)positions.set(n.id,{x:n.x,y:n.y,w:n.m.w,h:n.m.h});
  }
  function layout(data){
    const root={...data.root,m:metrics(data.root)},all=[root];
    for(const category of data.categories){
      const c={...category,parent:root,m:metrics(category)};all.push(c);
      for(const field of category.children||[])all.push({...field,parent:c,m:metrics(field)});
    }
    buildPositions(all);
    const full=[...positions.values()];
    const bx=Math.max(...full.map(p=>Math.abs(p.x)+p.w/2)),by=Math.max(...full.map(p=>Math.abs(p.y)+p.h/2));
    spread=Math.max(1,Math.min(1.95,((frame.clientWidth-50)/(frame.clientHeight-150))*.9/(bx/by)));
    for(const n of all){const p=positions.get(n.id);n.x=p.x*spread;n.y=p.y;n.m.h=Math.max(n.m.h,p.h);}
    return all;
  }
  function light(group,x,y,signal,r=5){
    const g=group.append('g').attr('role','img').attr('aria-label',signal.label);g.append('title').text(signal.label);
    g.append('circle').attr('class',`map-light${signal.ready===undefined?' unknown':signal.ready?' on':' missing'}`).attr('cx',x).attr('cy',y).attr('r',r);return g;
  }
  function drawNode(element,node){
    const group=d3.select(element);group.selectAll('*').remove();group.append('title').text(node.description||node.label);
    if(node.kind==='root'){
      const symbol=group.append('g').attr('class','map-root-symbol');
      symbol.append('circle').attr('class','map-root-halo').attr('r',82);symbol.append('circle').attr('class','map-root-disc').attr('r',70);
      text(symbol,'MapKAI',0,-8,'map-root-title');text(symbol,node.subtitle,0,15,'map-root-meta');text(symbol,zh?'240 个故事':'240 stories',0,33,'map-root-meta');return;
    }
    const {m}=node,left=-m.w/2+10,top=-m.h/2;
    group.append('rect').attr('class','map-hit').attr('x',-m.w/2-5).attr('y',top-5).attr('width',m.w+10).attr('height',m.h+10);
    if(node.kind==='category'){
      group.append('circle').attr('class','map-category-ring').attr('cy',top+19).attr('r',19);
      const circ=2*Math.PI*19;group.append('circle').attr('class','map-category-progress').attr('r',19).attr('stroke-dasharray',`${(node.total?node.complete/node.total:0)*circ} ${circ}`).attr('transform',`translate(0,${top+19}) rotate(-90)`);
      text(group,node.item.code,0,top+23,'map-category-code');
      const label=group.append('text').attr('class','map-label').attr('font-size',19).attr('text-anchor','middle');
      m.lines.forEach((line,i)=>label.append('tspan').attr('x',0).attr('y',top+57+i*21).text(line));
      text(group,node.subtitle,0,top+57+m.lines.length*21,'map-category-meta').attr('text-anchor','middle');return;
    }
    const last=top+m.last;
    const label=group.append('text').attr('class','map-label').attr('font-size',17);
    m.lines.forEach((line,i)=>label.append('tspan').attr('x',left).attr('y',top+18+i*20).text(line));
    group.append('path').attr('class','map-underline').attr('d',`M${-m.w/2},${last+5}H${m.w/2}`);
    const edge=node.x>=node.parent.x?-m.w/2:m.w/2;
    group.append('circle').attr('class','map-junction').attr('cx',edge).attr('cy',last+5).attr('r',3.7);
    const status=group.append('text').attr('class',`map-availability ${node.score===3?'complete':node.score===null?'unverified':'needs-work'}`).attr('font-size',11.5);
    m.statusLines.forEach((line,i)=>status.append('tspan').attr('x',left).attr('y',last+21+i*13).text(line));
    const resourceY=last+39+m.extra,step=(m.w-20)/3;
    const resources=group.append('g').attr('class','map-resource-lights');
    node.signals.forEach((signal,i)=>{const x=left+4+i*step;light(resources,x,resourceY,signal);text(resources,(zh?['音乐','视频','故事']:['Music','Video','Stories'])[i]+(signal.shared?(zh?'·共':' ·S'):''),x+10,resourceY+4,'map-resource-label').attr('font-size',11);});
    const stories=group.append('g').attr('class','map-story-lights');
    node.storySignals.forEach((signal,i)=>{
      const x=left+i*step,y=last+58+m.extra;
      const tag=stories.append('g').attr('class',`map-story-tag ${signal.newer?'newer':'older'}${model.selected===signal.node.id?' is-selected':''}`).attr('data-story-id',signal.id).attr('role','button').attr('tabindex',0).attr('aria-label',signal.label).attr('aria-pressed',String(model.selected===signal.node.id))
        .on('click',event=>{event.stopPropagation();onActivate(signal.node);})
        .on('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();onActivate(signal.node);}})
        .on('focus',function(){if(this.matches(':focus-visible'))ensureVisible(node);});
      tag.append('rect').attr('class','map-version-surface').attr('x',x-3).attr('y',y-10).attr('width',step-7).attr('height',23).attr('rx',4);
      light(tag,x+4,y,signal,3.4);text(tag,`${i+1} ${zh?(signal.newer?'新':'旧'):(signal.newer?'New':'Earlier')}`,x+12,y+4,'map-version-label').attr('font-size',11);
    });
  }
  function linkPath(n){
    if(n.kind==='category'){
      const py=n.y-n.m.h/2+19,angle=Math.atan2(py,n.x),sx=Math.cos(angle)*90,sy=Math.sin(angle)*90;
      return `M${sx},${sy}C${Math.cos(angle)*190},${Math.sin(angle)*190} ${n.x*.78},${py*.78} ${n.x},${py}`;
    }
    const side=n.x>=n.parent.x?-1:1,tx=n.x+side*n.m.w/2,ty=n.y-n.m.h/2+n.m.last+5;
    const sy=n.parent.y-n.parent.m.h/2+19,dx=tx-n.parent.x,dy=ty-sy;
    return `M${n.parent.x},${sy}C${n.parent.x+dx*.46},${sy+dy*.12} ${tx-dx*.18},${ty} ${tx},${ty}`;
  }
  function render(data){
    model=data;nodes=layout(data);width=frame.clientWidth;height=frame.clientHeight;
    surface.attr('viewBox',`0 0 ${width} ${height}`).attr('width',width).attr('height',height);svg.dataset.nodes=String(nodes.length);frame.dataset.layout='radial';
    const activeNode=document.activeElement?.dataset.node,activeStory=document.activeElement?.dataset.storyId;
    guides.selectAll('ellipse').data([150,400,790]).join('ellipse').attr('rx',r=>r*spread).attr('ry',r=>r);
    links.selectAll('path').data(nodes.filter(n=>n.parent),n=>n.id).join('path').attr('class',n=>`map-link ${n.kind==='category'?'map-trunk':n.score===3?'complete-link':''}`).attr('data-target',n=>n.id).attr('d',linkPath);
    const joined=marks.selectAll('g.map-node').data(nodes,n=>n.id).join('g')
      .attr('class',n=>`map-node map-${n.kind}${n.id===data.selected?' is-selected':''}${n.score===3?' is-complete':''}`).attr('data-node',n=>n.id).attr('data-kind',n=>n.kind).attr('transform',n=>`translate(${n.x},${n.y})`)
      .attr('role','button').attr('tabindex',0).attr('aria-label',n=>n.description||n.label).attr('aria-controls',n=>n.kind!=='root'?'map-selection':null).attr('aria-expanded',n=>n.kind==='field'?String(n.id===data.selected||n.storySignals.some(s=>s.node.id===data.selected)):null).attr('aria-pressed',n=>String(n.id===data.selected))
      .on('click',(event,n)=>{event.stopPropagation();onActivate(n);})
      .on('keydown',(event,n)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();onActivate(n);}})
      .on('focus',function(_,n){if(this.matches(':focus-visible'))ensureVisible(n);});
    joined.each(function(n){drawNode(this,n);});drawMini();
    if(activeStory)marks.selectAll('[data-story-id]').filter(function(){return this.dataset.storyId===activeStory;}).node()?.focus({preventScroll:true});else if(activeNode)joined.filter(n=>n.id===activeNode).node()?.focus({preventScroll:true});
    const nextKey=data.viewKey||'';
    if(viewKey!==nextKey){viewKey=nextKey;const matches=nodes.filter(n=>n.kind==='field');if(data.searching&&matches.length&&matches.length<=8){focusMode={kind:'results'};focusBounds(matches,false);}else fit(false);}
    else {scene.attr('transform',d3.zoomTransform(svg));surface.call(zoom.transform,d3.zoomTransform(svg));}
  }
  function moveCamera(transform,animate=true){
    const target=animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches?surface.transition().duration(300):surface;
    target.call(zoom.transform,transform);
  }
  function fit(animate=true){
    if(!nodes.length)return;focusMode=null;
    const bx=Math.max(...nodes.map(n=>Math.abs(n.x)+n.m.w/2))+45,by=Math.max(...nodes.map(n=>Math.abs(n.y)+n.m.h/2))+45;
    const k=Math.max(.07,Math.min(1.4,(width-50)/(2*bx),(height-(width<600?200:150))/(2*by)));
    moveCamera(d3.zoomIdentity.translate(width/2,height/2).scale(k),animate);
  }
  function focusCategory(code,animate=true){
    if(!code){fit(animate);return;}
    const id=`category-${code}`,group=nodes.filter(n=>n.id===id||n.parent?.id===id);if(!group.length)return;
    focusMode={kind:'category',code};focusBounds(group,animate);
  }
  function focusBounds(group,animate=true){
    const left=Math.min(...group.map(n=>n.x-n.m.w/2)),right=Math.max(...group.map(n=>n.x+n.m.w/2)),top=Math.min(...group.map(n=>n.y-n.m.h/2)),bottom=Math.max(...group.map(n=>n.y+n.m.h/2));
    const panel=!document.getElementById('map-selection').hidden&&width>780?390:0,available=width-panel;
    const k=Math.max(.15,Math.min(1.35,(available-70)/(right-left+50),(height-100)/(bottom-top+50)));
    moveCamera(d3.zoomIdentity.translate(available/2-k*(left+right)/2,height/2-k*(top+bottom)/2).scale(k),animate);
  }
  function focusNode(id,animate=true){const node=nodes.find(n=>n.id===id);if(!node)return;focusMode={kind:'node',id};focusBounds([node],animate);}
  function ensureVisible(node){
    const rect=frame.getBoundingClientRect(),clearTop=(header?.getBoundingClientRect().height||0)+(toolbar?.offsetHeight||0);
    if(rect.bottom<clearTop+100||rect.top>innerHeight-100)frame.scrollIntoView({block:'center',behavior:'instant'});
    const transform=d3.zoomTransform(svg),x=transform.applyX(node.x),y=transform.applyY(node.y);
    if(x<40||x>width-40||y<40||y>height-70)moveCamera(d3.zoomIdentity.translate(width/2-transform.k*node.x,height/2-transform.k*node.y).scale(transform.k),false);
  }
  function drawMini(){
    const bx=Math.max(300,...nodes.map(n=>Math.abs(n.x)+n.m.w/2))+25,by=Math.max(300,...nodes.map(n=>Math.abs(n.y)+n.m.h/2))+25;miniScale=Math.min((miniW-14)/(2*bx),(miniH-14)/(2*by));
    miniLines.selectAll('path').data(nodes.filter(n=>n.parent),n=>n.id).join('path').attr('d',n=>`M${miniW/2+n.parent.x*miniScale},${miniH/2+n.parent.y*miniScale}L${miniW/2+n.x*miniScale},${miniH/2+n.y*miniScale}`);
    miniNodes.selectAll('circle').data(nodes,n=>n.id).join('circle').attr('cx',n=>miniW/2+n.x*miniScale).attr('cy',n=>miniH/2+n.y*miniScale).attr('r',n=>n.kind==='root'?3:n.kind==='category'?2:1.3);updateMini();
  }
  function updateMini(){
    if(!nodes.length)return;const t=d3.zoomTransform(svg),a=t.invert([0,0]),b=t.invert([width,height]);
    miniWindow.attr('x',miniW/2+a[0]*miniScale).attr('y',miniH/2+a[1]*miniScale).attr('width',(b[0]-a[0])*miniScale).attr('height',(b[1]-a[1])*miniScale);
  }
  mini.attr('role','button').attr('tabindex',0).on('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();fit();}});
  mini.on('click',event=>{const [x,y]=d3.pointer(event,mini.node()),wx=(x-miniW/2)/miniScale,wy=(y-miniH/2)/miniScale,k=d3.zoomTransform(svg).k;focusMode=null;moveCamera(d3.zoomIdentity.translate(width/2-k*wx,height/2-k*wy).scale(k));});
  const scaleBy=factor=>{focusMode=null;const target=matchMedia('(prefers-reduced-motion: reduce)').matches?surface:surface.transition().duration(160);target.call(zoom.scaleBy,factor);};
  document.getElementById('map-zoom-in').addEventListener('click',()=>scaleBy(1.4));document.getElementById('map-zoom-out').addEventListener('click',()=>scaleBy(1/1.4));
  document.getElementById('map-fit').addEventListener('click',()=>{onDismiss?.();fit();});
  const fullscreen=document.getElementById('map-fullscreen');
  const exitExpanded=()=>{if(!frame.classList.contains('is-expanded'))return;frame.classList.remove('is-expanded');fullscreen.textContent=zh?'全屏':'Full screen';resize();};
  fullscreen.addEventListener('click',async()=>{try{if(document.fullscreenElement===frame)await document.exitFullscreen();else await frame.requestFullscreen();}catch{frame.classList.toggle('is-expanded');fullscreen.textContent=frame.classList.contains('is-expanded')?(zh?'退出全屏':'Exit full screen'):(zh?'全屏':'Full screen');resize();}});
  document.addEventListener('fullscreenchange',()=>{fullscreen.textContent=document.fullscreenElement===frame?(zh?'退出全屏':'Exit full screen'):(zh?'全屏':'Full screen');resize();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')exitExpanded();});
  surface.on('keydown.map',event=>{
    if(event.key==='Escape'){event.stopPropagation();exitExpanded();onDismiss?.();}
    else if(event.key==='+'||event.key==='='){event.preventDefault();scaleBy(1.4);}else if(event.key==='-'){event.preventDefault();scaleBy(1/1.4);}else if(event.key==='Home'){event.preventDefault();fit();}
    else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();focusMode=null;const k=d3.zoomTransform(svg).k;surface.call(zoom.translateBy,(event.key==='ArrowLeft'?70:event.key==='ArrowRight'?-70:0)/k,(event.key==='ArrowUp'?70:event.key==='ArrowDown'?-70:0)/k);}
  });
  function resize(){
    const w=frame.clientWidth,h=frame.clientHeight;if(!model||(w===width&&h===height))return;
    const mode=focusMode;render(model);if(mode?.kind==='category')focusCategory(mode.code,false);else if(mode?.kind==='node')focusNode(mode.id,false);else if(mode?.kind==='results')focusBounds(nodes.filter(n=>n.kind==='field'),false);else fit(false);
  }
  new ResizeObserver(resize).observe(frame);
  return {render,fit,focusCategory,focusNode};
}
