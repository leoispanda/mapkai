// The atlas keeps every field at a readable size; the page supplies scrolling.
export function createMindMap({svg, frame, language, onActivate, onDismiss}) {
  const d3=globalThis.d3;
  if(!d3?.select)throw new Error('Map renderer unavailable');
  const zh=language==='zh',surface=d3.select(svg);
  const scene=surface.append('g').attr('class','map-viewport');
  const links=scene.append('g').attr('class','map-links').attr('aria-hidden','true');
  const marks=scene.append('g').attr('class','map-nodes');
  const measure=document.createElement('canvas').getContext('2d');
  const family=getComputedStyle(svg).fontFamily;
  let model,nodes=[],width=frame.clientWidth,scale=1;
  const text=(group,label,x,y,className)=>group.append('text').attr('class',className).attr('x',x).attr('y',y).text(label);
  function wrap(label,size,maxWidth){
    measure.font=`500 ${size}px ${family}`;
    const tokens=String(label).match(/\p{Script=Han}|[^\s\p{Script=Han}]+|\s+/gu)||[];
    const lines=[];let line='';
    for(const token of tokens){
      if(line&&measure.measureText(line+token).width>maxWidth){lines.push(line.trim());line=token.trimStart();}
      else line+=token;
    }
    if(line.trim())lines.push(line.trim());
    if(lines.length>3){lines.length=3;while(measure.measureText(lines[2]+'…').width>maxWidth)lines[2]=lines[2].slice(0,-1);lines[2]+='…';}
    return lines;
  }
  function metrics(item,available){
    const size=(item.kind==='category'?17:item.kind==='story'?13:15)*scale;
    const lines=wrap(item.label,size,available);
    const last=16*scale+(lines.length-1)*20*scale;
    const statusLines=['field','story'].includes(item.kind)?wrap(item.subtitle,(item.kind==='field'?11.5:11)*scale,available):[];
    const statusExtra=Math.max(0,statusLines.length-1)*15*scale;
    return {size,lines,last,statusLines,statusExtra,height:last+(item.kind==='field'?76:item.kind==='category'?47:38)*scale+statusExtra};
  }
  function layout(data){
    const columns=Math.min(data.categories.length||1,4,Math.max(1,Math.floor((width+24)/(300*scale+24))));
    const gap=28,padding=width<500?8:16;
    const usable=Math.min(width-padding*2,columns*420+gap*(columns-1));
    const left=(width-usable)/2,columnWidth=(usable-gap*(columns-1))/columns;
    const cursor=Array(columns).fill(142),base=Array(columns).fill(0),placements=[];
    const root={...data.root,x:width/2,y:52,side:1};
    const result=[root];
    // Assign columns using collapsed field sizes, keeping branches stable when stories open.
    for(const category of data.categories){
      const column=base.indexOf(Math.min(...base));
      let weight=110;
      for(const field of category.children||[])weight+=metrics(field,columnWidth-68).height+9*scale;
      base[column]+=weight;placements.push(column);
    }
    data.categories.forEach((category,index)=>{
      const column=placements[index],columnLeft=left+column*(columnWidth+gap);
      const m=metrics(category,columnWidth-58);
      const node={...category,x:columnLeft+24,y:cursor[column],width:columnWidth-36,m,parent:root,bus:columnLeft+3};
      result.push(node);cursor[column]+=m.height+13*scale;
      for(const field of category.children||[]){
        const fm=metrics(field,columnWidth-68);
        const f={...field,x:columnLeft+40,y:cursor[column],width:columnWidth-50,m:fm,parent:node};
        result.push(f);cursor[column]+=fm.height+9*scale;
        for(const story of field.children||[]){
          const sm=metrics(story,columnWidth-90);
          result.push({...story,x:columnLeft+61,y:cursor[column],width:columnWidth-71,m:sm,parent:f});
          cursor[column]+=sm.height+7*scale;
        }
      }
      cursor[column]+=43*scale;
    });
    const height=Math.max(360,...cursor)+30;
    surface.attr('viewBox',`0 0 ${width} ${height}`).attr('width',width).attr('height',height);
    frame.dataset.columns=String(columns);frame.dataset.mapHeight=String(height);
    return result;
  }
  function light(group,x,y,signal,r=5){
    const dot=group.append('g').attr('role','img').attr('aria-label',signal.label);
    dot.append('title').text(signal.label);
    dot.append('circle').attr('cx',x).attr('cy',y).attr('r',r*scale)
      .attr('class',`map-light${signal.ready===undefined?' unknown':signal.ready?' on':' missing'}`);
    return dot;
  }
  function drawNode(element,node){
    const group=d3.select(element);group.selectAll('*').remove();
    group.append('title').text(node.description||node.label);
    if(node.kind==='root'){
      group.append('circle').attr('class','map-root-halo').attr('r',49);
      group.append('circle').attr('class','map-root-disc').attr('r',42);
      text(group,'MapKAI',0,-3,'map-root-title');text(group,node.subtitle,0,15,'map-root-meta');
      return;
    }
    const {m}=node;
    group.append('rect').attr('class','map-hit').attr('x',-10).attr('y',-13).attr('width',node.width+13).attr('height',m.height+8);
    if(node.kind==='category'){
      group.append('circle').attr('class','map-category-ring').attr('r',18);
      const fraction=node.total?node.complete/node.total:0,circ=2*Math.PI*18;
      group.append('circle').attr('class','map-category-progress').attr('r',18).attr('stroke-dasharray',`${fraction*circ} ${circ}`).attr('transform','rotate(-90)');
      text(group,node.item.code,0,4,'map-category-code');
      const label=group.append('text').attr('class','map-label').attr('font-size',m.size);
      m.lines.forEach((line,i)=>label.append('tspan').attr('x',31).attr('y',i*20*scale+2).text(line));
      text(group,node.subtitle,31,m.last+11*scale,'map-category-meta');
      return;
    }
    group.append('circle').attr('class','map-junction').attr('cy',9*scale).attr('r',3.4*scale);
    const label=group.append('text').attr('class','map-label').attr('font-size',m.size);
    m.lines.forEach((line,i)=>label.append('tspan').attr('x',14).attr('y',16*scale+i*20*scale).text(line));
    group.append('path').attr('class','map-underline').attr('d',`M14,${m.last+6*scale}H${node.width-4}`);
    if(node.kind==='story'){
      light(group,18,m.last+24*scale,node.signals[0],3.8);
      const subtitle=group.append('text').attr('class','map-story-meta').attr('font-size',11*scale);
      m.statusLines.forEach((line,i)=>subtitle.append('tspan').attr('x',29).attr('y',m.last+28*scale+i*15*scale).text(line));
      return;
    }
    const status=group.append('text').attr('class',`map-availability ${node.score===3?'complete':node.score===null?'unverified':'needs-work'}`).attr('font-size',11.5*scale);
    m.statusLines.forEach((line,i)=>status.append('tspan').attr('x',14).attr('y',m.last+22*scale+i*15*scale).text(line));
    const resourceY=m.last+40*scale+m.statusExtra,step=(node.width-21)/3;
    const resourceRow=group.append('g').attr('class','map-resource-lights');
    node.signals.forEach((signal,index)=>{
      const x=19+index*step;light(resourceRow,x,resourceY,signal);
      text(resourceRow,(zh?['音乐','视频','故事']:['Music','Video','Stories'])[index]+(signal.shared?(zh?'·共':' ·S'):''),x+10*scale,resourceY+4*scale,'map-resource-label').attr('font-size',11*scale);
    });
    const storyRow=group.append('g').attr('class','map-story-lights');
    node.storySignals.forEach((signal,index)=>{
      const tag=storyRow.append('g').attr('class',`map-story-tag ${signal.newer?'newer':'older'}${model.selected===signal.node.id?' is-selected':''}`)
        .attr('data-story-id',signal.id).attr('role','button').attr('tabindex',0).attr('aria-label',signal.label)
        .attr('aria-pressed',String(model.selected===signal.node.id))
        .on('click',event=>{event.stopPropagation();onActivate(signal.node);})
        .on('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();onActivate(signal.node);}});
      const x=14+index*step,y=m.last+59*scale+m.statusExtra;
      tag.append('rect').attr('class','map-version-surface').attr('x',x-4).attr('y',y-10*scale).attr('width',step-6).attr('height',23*scale).attr('rx',4);
      light(tag,x+4,y,signal,3.4);
      text(tag,`${index+1} ${zh?(signal.newer?'新':'旧'):(signal.newer?'New':'Earlier')}`,x+12*scale,y+4*scale,'map-version-label').attr('font-size',11*scale);
    });
  }
  function render(data){
    model=data;width=frame.clientWidth;nodes=layout(data);svg.dataset.nodes=String(nodes.length);
    const activeNode=document.activeElement?.dataset.node,activeStory=document.activeElement?.dataset.storyId;
    links.selectAll('path').data(nodes.filter(n=>n.parent),n=>n.id).join('path')
      .attr('class',n=>`map-link ${n.kind==='category'?'map-trunk':n.kind==='story'?'story-link':n.score===3?'complete-link':''}`)
      .attr('d',n=>{
        if(n.kind==='category')return `M${n.parent.x},${n.parent.y+43}V107H${n.bus}V${n.y}H${n.x-18}`;
        if(n.kind==='field')return `M${n.parent.x},${n.parent.y+23}V${n.y-5}Q${n.parent.x},${n.y+9*scale} ${n.parent.x+12},${n.y+9*scale}H${n.x}`;
        const start=n.parent.y+n.parent.m.height-8;
        return `M${n.parent.x+3},${start}V${n.y-4}Q${n.parent.x+3},${n.y+9*scale} ${n.x},${n.y+9*scale}`;
      });
    const joined=marks.selectAll('g.map-node').data(nodes,n=>n.id).join('g')
      .attr('class',n=>`map-node map-${n.kind}${n.id===data.selected?' is-selected':''}${n.score===3?' is-complete':''}`)
      .attr('data-node',n=>n.id).attr('data-kind',n=>n.kind).attr('transform',n=>`translate(${n.x},${n.y})`)
      .attr('role','button').attr('tabindex',0).attr('aria-label',n=>n.description||n.label)
      .attr('aria-expanded',n=>n.expandable?String(Boolean(n.expanded)):null).attr('aria-pressed',n=>String(n.id===data.selected))
      .on('click',(event,n)=>{event.stopPropagation();onActivate(n);})
      .on('keydown',(event,n)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();onActivate(n);}});
    joined.each(function(n){drawNode(this,n);});
    if(activeStory)marks.selectAll('[data-story-id]').filter(function(){return this.dataset.storyId===activeStory;}).node()?.focus({preventScroll:true});
    else if(activeNode)joined.filter(n=>n.id===activeNode).node()?.focus({preventScroll:true});
    document.getElementById('map-zoom').value=`${Math.round(scale*100)}%`;
    document.getElementById('map-zoom-in').disabled=scale>=1.3;
    document.getElementById('map-zoom-out').disabled=scale<=0.85;
  }
  function resizeText(next){
    if(!model)return;
    const anchor=[...svg.querySelectorAll('.map-field')].find(el=>{const r=el.getBoundingClientRect();return r.top>160&&r.top<innerHeight-100;});
    const before=anchor?.getBoundingClientRect().top,id=anchor?.dataset.node;
    scale=Math.max(.85,Math.min(1.3,next));render(model);
    if(id){const target=[...svg.querySelectorAll('[data-node]')].find(el=>el.dataset.node===id);if(target)window.scrollBy({top:target.getBoundingClientRect().top-before,behavior:'instant'});}
  }
  function focusCategory(code){
    const id=code?`category-${code}`:'root';
    const target=[...svg.querySelectorAll('[data-node]')].find(el=>el.dataset.node===id);if(!target)return;
    const toolbar=document.querySelector('.atlas-toolbar');
    window.scrollTo({top:Math.max(0,scrollY+target.getBoundingClientRect().top-(toolbar?.offsetHeight||0)-30),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    target.classList.add('is-located');setTimeout(()=>target.classList.remove('is-located'),1600);
  }
  document.getElementById('map-zoom-in').addEventListener('click',()=>resizeText(scale+.15));
  document.getElementById('map-zoom-out').addEventListener('click',()=>resizeText(scale-.15));
  document.getElementById('map-fit').addEventListener('click',()=>resizeText(1));
  surface.on('keydown.map',event=>{if(event.key==='Escape')onDismiss?.();else if(event.key==='+'||event.key==='='){event.preventDefault();resizeText(scale+.15);}else if(event.key==='-'){event.preventDefault();resizeText(scale-.15);}});
  new ResizeObserver(()=>{if(model&&Math.abs(frame.clientWidth-width)>1)render(model);}).observe(frame);
  return {render,fit:()=>resizeText(1),focusCategory};
}
