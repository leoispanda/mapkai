// D3 is served locally so the map works with the site's existing content policy.
export function createMindMap({ svg, frame, language, onActivate }) {
  const d3 = globalThis.d3;
  if (!d3?.tree || !d3?.zoom) throw new Error('Map renderer unavailable');
  const zh = language === 'zh';
  const surface = d3.select(svg);
  const viewport = surface.append('g').attr('class', 'map-viewport');
  const links = viewport.append('g').attr('class', 'map-links').attr('aria-hidden', 'true');
  const marks = viewport.append('g').attr('class', 'map-nodes');
  const output = document.getElementById('map-zoom');
  let model, nodes = [], width = 1000, height = 620, portrait = false;
  const measuring = document.createElement('canvas').getContext('2d');
  const family = getComputedStyle(svg).fontFamily;
  const zoom = d3.zoom().scaleExtent([0.1, 2.5]).clickDistance(6)
    .filter(event => (!portrait || !event.type.startsWith('touch') || event.touches?.length > 1) && (!event.ctrlKey || event.type === 'wheel') && !event.button)
    .on('zoom', event => {
      viewport.attr('transform', event.transform);
      output.value = `${Math.round(event.transform.k * 100)}%`;
    });
  surface.call(zoom).on('dblclick.zoom', null);

  function wrap(label, size, maxWidth = 247) {
    measuring.font = `500 ${size}px ${family}`;
    const tokens = String(label).match(/\p{Script=Han}|[^\s\p{Script=Han}]+|\s+/gu) || [];
    const lines = []; let line = '';
    for (const token of tokens) {
      if (line && measuring.measureText(line + token).width > maxWidth) {
        lines.push(line.trim()); line = token.trimStart();
      } else line += token;
    }
    if (line.trim()) lines.push(line.trim());
    if (lines.length > 3) {
      lines.length = 3;
      while (measuring.measureText(lines[2] + '…').width > maxWidth) lines[2] = lines[2].slice(0, -1);
      lines[2] += '…';
    }
    return lines;
  }

  function layout(data) {
    portrait = width < 600;
    frame.classList.toggle('is-portrait', portrait);
    if (portrait) {
      const root = { ...data.root, x:width/2, y:145, side:1 };
      const result = [root]; let y=285;
      function branch(item,parent,depth){
        const node={...item,x:26+(depth-1)*24,y,side:1,parent};
        result.push(node);y+=110;
        for(const child of item.children||[])branch(child,node,depth+1);
      }
      for(const category of data.categories)branch(category,root,1);
      frame.style.height=`${Math.max(600,Math.min(1800,y+45))}px`;
      height=frame.clientHeight;
      surface.attr('viewBox',`0 0 ${width} ${height}`);
      return result;
    }
    frame.style.removeProperty('height');
    height=frame.clientHeight;
    surface.attr('viewBox',`0 0 ${width} ${height}`);
    const result = [{ ...data.root, x:0, y:0, side:1 }];
    const split = data.focused ? 0 : Math.ceil(data.categories.length / 2);
    const sides = data.focused ? [[1, data.categories]] : [[-1, data.categories.slice(0, split)], [1, data.categories.slice(split)]];
    for (const [side, categories] of sides) {
      if (!categories.length) continue;
      const root = d3.hierarchy({ ...data.root, children:categories });
      const spacing=data.categories.some(category=>category.children?.length)?108:88;
      d3.tree().nodeSize([spacing, 340]).separation((a,b) => a.parent === b.parent ? 1 : 1.18)(root);
      const positions = new Map([[root, result[0]]]);
      for (const node of root.descendants().slice(1)) {
        const position = { ...node.data, x:side * [0, 235, 575, 920][node.depth], y:node.x, side, parent:positions.get(node.parent) };
        positions.set(node, position); result.push(position);
      }
    }
    return result;
  }

  function drawSignal(group, datum, small = false) {
    const signals = small ? datum.storySignals : datum.signals;
    const offset = small ? 13 : 20;
    const y = small ? 38 : 18;
    const row = group.append('g').attr('class', small ? 'map-story-lights' : 'map-resource-lights');
    (signals || []).forEach((signal, index) => {
      const x = datum.side * (17 + index * offset);
      const dot = row.append('g').attr('role','img').attr('aria-label',signal.label);
      dot.append('title').text(signal.label);
      dot.append('circle').attr('cx',x).attr('cy',y).attr('r',small ? 3.7 : 6)
        .attr('class',`map-light${signal.ready === undefined ? ' unknown' : signal.ready ? ' on' : ''}`);
      if (signal.shared && signal.ready && !small) dot.append('text').attr('class','map-shared').attr('x',x).attr('y',y+2.8).text(zh?'共':'S');
    });
  }

  function drawNode(element, node) {
    const group = d3.select(element);
    group.selectAll('*').remove();
    group.append('title').text(node.description || node.label);
    if (node.kind === 'root') {
      group.append('circle').attr('class','map-root-halo').attr('r',77);
      group.append('circle').attr('class','map-root-disc').attr('r',65);
      group.append('text').attr('class','map-root-title').attr('y',-12).text('MapKAI');
      group.append('text').attr('class','map-root-meta').attr('y',12).text(node.subtitle);
      group.append('text').attr('class','map-root-meta').attr('y',30).text(node.note);
      return;
    }
    const side = node.side;
    const size = node.kind === 'category' ? 17 : node.kind === 'field' ? 15 : 14;
    const nodeWidth=portrait?Math.min(277,width-node.x-20):277;
    const lines = wrap(node.label, size, nodeWidth-24);
    group.append('rect').attr('class','map-hit').attr('x',side>0?-10:-281).attr('y',-65).attr('width',portrait?nodeWidth+10:291).attr('height',112).attr('rx',0);
    group.append('path').attr('class','map-underline').attr('d',`M${side*12},0H${side*nodeWidth}`);
    group.append('circle').attr('class','map-junction').attr('r',node.kind==='story'?4:6);
    if (node.expandable) group.append('text').attr('class','map-toggle').attr('x',0).attr('y',3).text(node.expanded?'−':'+');
    const label = group.append('text').attr('class','map-label').attr('x',side*16).attr('text-anchor',side>0?'start':'end');
    lines.forEach((line,i) => label.append('tspan').attr('x',side*16).attr('y',-12-(lines.length-i-1)*19).text(line));
    if (node.kind === 'story') {
      group.append('text').attr('class','map-node-meta').attr('x',side*31).attr('y',21).attr('text-anchor',side>0?'start':'end').text(node.subtitle);
    } else {
      group.append('text').attr('class','map-node-meta').attr('x',side*86).attr('y',21).attr('text-anchor',side>0?'start':'end').text(node.subtitle);
    }
    drawSignal(group,node);
    if (node.storySignals) {
      drawSignal(group,node,true);
      group.append('text').attr('class','map-version-meta').attr('x',side*62).attr('y',41).attr('text-anchor',side>0?'start':'end').text(node.note);
    }
  }

  function render(data, refit = false) {
    model = data; nodes = layout(data);
    svg.dataset.nodes = String(nodes.length);
    const activeId = document.activeElement?.closest?.('[data-node]')?.dataset.node;
    links.selectAll('path').data(nodes.filter(n=>n.parent), n=>n.id).join('path')
      .attr('class',n=>`map-link${n.kind==='story'?' story-link':''}`)
      .attr('d',n=>{
        if(portrait){
          const sx=n.parent.x;
          const sy=n.parent.kind==='root'?n.parent.y+67:n.parent.y+9;
          const elbow=n.parent.kind==='root'?8:n.parent.x;
          return `M${sx},${sy}Q${elbow},${sy} ${elbow},${sy+20}V${n.y-16}Q${elbow},${n.y} ${n.x},${n.y}`;
        }
        const start = n.parent.x+n.side*(n.parent.kind==='root'?67:277);
        const middle = (start+n.x)/2;
        return `M${start},${n.parent.y}C${middle},${n.parent.y} ${middle},${n.y} ${n.x},${n.y}`;
      });
    const joined = marks.selectAll('g.map-node').data(nodes,n=>n.id).join('g')
      .attr('class',n=>`map-node map-${n.kind}${n.id===data.selected?' is-selected':''}`)
      .attr('data-node',n=>n.id).attr('data-kind',n=>n.kind).attr('transform',n=>`translate(${n.x},${n.y})`)
      .attr('role','button').attr('tabindex',0)
      .attr('aria-label',n=>n.description||`${n.label}. ${n.subtitle||''}`)
      .attr('aria-expanded',n=>n.expandable?String(Boolean(n.expanded)):null)
      .attr('aria-pressed',n=>String(n.id===data.selected))
      .on('click',(event,n)=>{ event.stopPropagation(); onActivate(n); })
      .on('keydown',(event,n)=>{
        if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();onActivate(n);}
      })
      .on('focus',(_,n)=>ensureVisible(n));
    joined.each(function(n){drawNode(this,n);});
    if (refit) fit(false, Boolean(data.focused));
    if(activeId) joined.filter(n=>n.id===activeId).node()?.focus({preventScroll:true});
  }

  function fit(animate = true, readable = false) {
    if (!nodes.length) return;
    if(portrait&&nodes.at(-1).y+45<=height){
      surface.call(zoom.transform,d3.zoomIdentity);return;
    }
    const left = d3.min(nodes,n=>n.x-(n.kind==='root'?80:n.side<0?290:14));
    const right = d3.max(nodes,n=>n.x+(n.kind==='root'?80:n.side>0?290:14));
    const top = d3.min(nodes,n=>n.y-80), bottom = d3.max(nodes,n=>n.y+62);
    let scale = Math.min(1.15,(width-70)/(right-left),(height-110)/(bottom-top));
    // A focused branch stays readable. Fit map can still show its whole extent.
    if(readable) scale=Math.max(Math.min(width<600?0.54:0.66,(width-46)/(right-left)),scale);
    scale=Math.max(0.1,Math.min(2.5,scale));
    const transform=d3.zoomIdentity.translate(width/2-scale*(left+right)/2,height/2-scale*(top+bottom)/2).scale(scale);
    const target=animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches?surface.transition().duration(260):surface;
    target.call(zoom.transform,transform);
  }
  function ensureVisible(node) {
    const current=d3.zoomTransform(svg);
    const x=current.applyX(node.x),y=current.applyY(node.y);
    if(x<35||x>width-35||y<70||y>height-65){
      surface.call(zoom.translateBy,(width/2-x)/current.k,(height/2-y)/current.k);
    }
  }
  function scaleBy(factor) { surface.call(zoom.scaleBy,factor); }
  document.getElementById('map-zoom-in').addEventListener('click',()=>scaleBy(1.3));
  document.getElementById('map-zoom-out').addEventListener('click',()=>scaleBy(1/1.3));
  document.getElementById('map-fit').addEventListener('click',()=>fit());
  surface.on('keydown.map',event=>{
    if(event.key==='+'||event.key==='='){event.preventDefault();scaleBy(1.3);}
    else if(event.key==='-'){event.preventDefault();scaleBy(1/1.3);}
    else if(event.key==='Home'){event.preventDefault();fit();}
    else if(event.key==='Escape'){event.preventDefault();onActivate({kind:'root'});}
    else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      event.preventDefault();const k=d3.zoomTransform(svg).k;
      surface.call(zoom.translateBy,(event.key==='ArrowLeft'?65:event.key==='ArrowRight'?-65:0)/k,(event.key==='ArrowUp'?65:event.key==='ArrowDown'?-65:0)/k);
    }
  });
  new ResizeObserver(()=>{
    const previousWidth=width,previousHeight=height;
    width=frame.clientWidth;height=frame.clientHeight;
    surface.attr('viewBox',`0 0 ${width} ${height}`);
    if(model&&Math.abs(width-previousWidth)>1)render(model,true);
    else if(model&&Math.abs(height-previousHeight)>1)fit(false,Boolean(model.focused));
  }).observe(frame);
  width=frame.clientWidth;height=frame.clientHeight;
  surface.attr('viewBox',`0 0 ${width} ${height}`);
  return {render,fit};
}
