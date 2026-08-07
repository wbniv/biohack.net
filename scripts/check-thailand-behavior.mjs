import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chrome=process.env.CHROME||spawnSync('sh',['-c','command -v google-chrome || command -v chromium'],{encoding:'utf8'}).stdout.trim();
if(!chrome)throw new Error('Chrome/Chromium required');
const profile=await mkdtemp(join(tmpdir(),'thailand-behavior-')),port=14000+(process.pid%1000),page=process.env.THAILAND_TEST_URL||`file://${resolve('dist/thailand/index.html')}`;
const child=spawn(chrome,['--headless=new','--no-sandbox',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,page],{stdio:'ignore'}),pause=ms=>new Promise(r=>setTimeout(r,ms));
try{
 let target;for(let i=0;i<120;i++){try{target=(await fetch(`http://127.0.0.1:${port}/json`).then(r=>r.json())).find(t=>t.type==='page');if(target)break}catch{}await pause(100)}if(!target)throw new Error('Chrome target unavailable');
 const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((ok,fail)=>{ws.onopen=ok;ws.onerror=fail});let seq=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};const call=(method,params={})=>new Promise(ok=>{const id=++seq;pending.set(id,ok);ws.send(JSON.stringify({id,method,params}))});await call('Runtime.enable');await pause(300);
 const expression=`(async()=>{const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],result={};result.tasks=qa('[data-task-id]').length;result.closed=qa('.task-card details[open]').length===0;const cb=q('[data-task-checkbox="mission-questions"]');cb.click();await new Promise(r=>setTimeout(r,30));result.progress=q('#complete-count').textContent==='1';result.persist=localStorage.getItem('biohack.thailand.v2.mission-questions')==='1';result.calendar=qa('[data-event-id="mission-answers"]').every(n=>n.classList.contains('is-complete'));q('[data-filter="visa"]').click();result.filter=q('[data-filter="visa"]').getAttribute('aria-pressed')==='true'&&Number(q('#visible-count').textContent.match(/\\d+/)[0])>0;q('#open-calendar').click();result.dialog=q('#calendar-sheet').open;q('#calendar-sheet').close();cb.click();return result})()`;
 const res=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true}),result=res.result.result.value;if(!result||Object.values(result).some(v=>v===false)||result.tasks<32)throw new Error(`Behavior failure: ${JSON.stringify(result)}`);console.log(`Thailand behavior PASS: ${JSON.stringify(result)}`);ws.close();
}finally{child.kill('SIGTERM')}
