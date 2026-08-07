import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chrome = process.env.CHROME || '/usr/bin/google-chrome';
const profile = await mkdtemp(join(tmpdir(), 'thailand-contrast-'));
const port = 9333;
const page = `file://${resolve('dist/thailand/index.html')}`;
const child = spawn(chrome, ['--headless=new','--no-sandbox',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,page], {stdio:'ignore'});
const pause = ms => new Promise(r => setTimeout(r, ms));
try {
  let target;
  for (let i=0;i<40;i++) { try { const tabs=await fetch(`http://127.0.0.1:${port}/json`).then(r=>r.json()); target=tabs.find(t=>t.type==='page'&&t.url.includes('/dist/thailand/index.html')); if(target)break; } catch {} await pause(100); }
  if(!target) throw new Error('Chrome debugging target unavailable');
  const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((ok,fail)=>{ws.onopen=ok;ws.onerror=fail});
  let seq=0; const pending=new Map(); ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
  const call=(method,params={})=>new Promise(ok=>{const id=++seq;pending.set(id,ok);ws.send(JSON.stringify({id,method,params}))});
  await call('Runtime.enable'); await pause(300);
  const expression=`(() => { const rgb=s=>(s.match(/[\\d.]+/g)||[]).slice(0,3).map(Number); const lum=c=>{c=c/255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4}; const ratio=(a,b)=>{a=rgb(a);b=rgb(b);const A=.2126*lum(a[0])+.7152*lum(a[1])+.0722*lum(a[2]),B=.2126*lum(b[0])+.7152*lum(b[1])+.0722*lum(b[2]);return (Math.max(A,B)+.05)/(Math.min(A,B)+.05)}; return [...document.querySelectorAll('.mermaid-diagram .node')].map(n=>{const shape=n.querySelector('rect,polygon,path');const label=n.querySelector('.nodeLabel p,.nodeLabel,text');const fill=getComputedStyle(shape).fill;const color=getComputedStyle(label).color||getComputedStyle(label).fill;return {text:label?.textContent.trim(),fill,color,contrast:ratio(fill,color)}}) })()`;
  const res=await call('Runtime.evaluate',{expression,returnByValue:true}); const rows=res.result.result.value||[]; const bad=rows.filter(r=>!Number.isFinite(r.contrast)||r.contrast<4.5);
  if (!rows.length) throw new Error('No Mermaid nodes found; contrast test cannot pass vacuously');
  console.log(rows.map(r=>`${r.contrast.toFixed(2)}  ${r.text}`).join('\n')); if(bad.length) throw new Error(`${bad.length} Mermaid node(s) below 4.5:1 contrast`); ws.close();
} finally { child.kill('SIGTERM'); }
