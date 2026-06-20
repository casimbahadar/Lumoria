const fs=require("fs"),path=require("path"),vm=require("vm");
const read=f=>fs.readFileSync(path.join("/home/user/Lumoria/js",f),"utf8");
const s={};vm.createContext(s);
vm.runInContext(read("data.js")+"\n;globalThis.__D={MONSTERS_DATA,WORLD_DATA:(typeof WORLD_DATA!=='undefined'?WORLD_DATA:null)};",s,{filename:"v"});
const {MONSTERS_DATA:M,WORLD_DATA:W}=s.__D;
const BST=b=>b.hp+b.atk+b.def+b.spa+b.spd+b.spe; const bstId=id=>BST(M[id].base);
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const earliest={};for(const a of Object.values(W||{})){const rb=a.requiredBadges||0;for(const wm of (a.wildMonsters||[])){if(earliest[wm.id]==null||rb<earliest[wm.id])earliest[wm.id]=rb;}}
const inDex=id=>id>=10&&id<=313, isRoot=id=>!Object.keys(M).map(Number).some(x=>M[x].evolveTo===id);
const chain=id=>{const o=[id];let c=id,g=0;while(M[c]&&M[c].evolveTo&&g++<9){o.push(M[c].evolveTo);c=M[c].evolveTo;}return o;};
const leg=id=>M[id].rarity==="legendary";
const EXC3=new Set([232,244,142,211,147,266,262,215]), EXC2=new Set([59,308,130,226,278,106,193,291]);
function lineProg(ids){let b=null;for(const id of ids){if(earliest[id]!=null&&(b==null||earliest[id]<b))b=earliest[id];}if(b==null)return Math.max(0,Math.min(1,(ids[0]-10)/303));return Math.max(0,Math.min(1,b/18));}
const lerp=(a,b,t)=>a+(b-a)*t, cl=(lo,hi,v)=>Math.max(lo,Math.min(hi,v));
function scaleTo(base,target){const cur=BST(base),k=target/cur,keys=["hp","atk","def","spa","spd","spe"];let nb={};for(const key of keys)nb[key]=Math.max(12,Math.round(base[key]*k));let diff=target-BST(nb);const order=keys.slice().sort((x,y)=>nb[y]-nb[x]);let i=0,g=0;while(diff!==0&&g++<600){const key=order[i%6];if(diff>0){nb[key]++;diff--;}else if(nb[key]>12){nb[key]--;diff++;}i++;}return nb;}
function targets(){const out={};const roots=Object.keys(M).map(Number).filter(id=>inDex(id)&&isRoot(id));
  for(const r of roots){const ids=chain(r).filter(inDex);if(ids.some(leg))continue;const prog=lineProg(ids),R=rng(r*7+1);const jit=sp=>(R()*2-1)*sp;
    const ob=ids.map(bstId);
    if(ids.length===1){ out[ids[0]]=Math.round(cl(400,Math.min(510,ob[0]),lerp(405,505,prog)+jit(22))); }
    else if(ids.length===2){
      if(EXC2.has(r)){const fin=Math.round(Math.min(500,485+R()*15));const base=Math.round(Math.max(200,fin-lerp(90,120,R())));out[ids[0]]=base;out[ids[1]]=fin;}
      else{const base=Math.round(cl(200,ob[0],lerp(210,360,prog)+jit(20)));const fin=Math.round(Math.min(480,Math.min(ob[1],base+lerp(95,120,R()))));out[ids[0]]=base;out[ids[1]]=fin;}}
    else if(ids.length===3){
      if(EXC3.has(r)){const fin=Math.round(Math.min(535,515+R()*20));const mid=Math.round(fin-lerp(70,100,R()));const base=Math.round(Math.max(200,mid-lerp(90,120,R())));out[ids[0]]=base;out[ids[1]]=mid;out[ids[2]]=fin;}
      else{const base=Math.round(cl(200,ob[0],lerp(205,300,prog)+jit(18)));const mid=Math.round(Math.min(400,Math.min(ob[1],base+lerp(95,120,R()))));const fin=Math.round(Math.min(510,Math.min(ob[2],mid+lerp(95,120,R()))));out[ids[0]]=base;out[ids[1]]=mid;out[ids[2]]=fin;}}}
  return out;}
const T=targets();
const mode=process.argv[2]||"report",lo=+(process.argv[3]||10),hi=+(process.argv[4]||70);
const isExcId=id=>Object.keys(M).map(Number).some(r=>(EXC2.has(r)||EXC3.has(r))&&chain(r).includes(id));
if(mode==="report"){for(const id of Object.keys(T).map(Number).filter(id=>id>=lo&&id<=hi).sort((a,b)=>a-b)){const nb=scaleTo(M[id].base,T[id]);console.log(`#${String(id).padEnd(3)} ${M[id].name.padEnd(15)} [${M[id].rarity}] ${bstId(id)} -> ${T[id]}  {${nb.hp},${nb.atk},${nb.def},${nb.spa},${nb.spd},${nb.spe}}${isExcId(id)?" *EXC":""}`);}}
if(mode==="verify"){const roots=Object.keys(M).map(Number).filter(id=>inDex(id)&&isRoot(id));let v=0,e3=0,e2=0,mn=999,mx=0,incNon=0,gapV=0;
  for(const r of roots){const ids=chain(r).filter(inDex);if(ids.some(leg))continue;const t=ids.map(id=>T[id]),ob=ids.map(bstId);const ex=EXC3.has(r)||EXC2.has(r);
    for(let i=0;i<ids.length;i++){mn=Math.min(mn,t[i]);mx=Math.max(mx,t[i]);if(!ex&&t[i]>ob[i]+0){incNon++;}}
    for(let i=1;i<ids.length;i++)if(t[i]-t[i-1]>120)gapV++;
    if(t[0]<200)v++;
    if(ids.length===1){if(t[0]<400||t[0]>510)v++;}
    else if(ids.length===2){if(EXC2.has(r)){if(t[1]>480)e2++;if(t[1]>500)v++;}else if(t[1]>480)v++;}
    else if(ids.length===3){if(EXC3.has(r)){if(t[1]>400||t[2]>510)e3++;if(t[2]>535)v++;}else{if(t[1]>400)v++;if(t[2]>510)v++;}}}
  console.log(`hard violations:${v} | non-exc increases:${incNon} | gap>120:${gapV} | 3-exc over-cap:${e3} | 2-exc over-cap:${e2} | BST ${mn}-${mx}`);}

if(mode==="apply"){
  let txt=fs.readFileSync("/home/user/Lumoria/js/data.js","utf8");
  let done=0,miss=[];
  for(const id of Object.keys(T).map(Number)){
    const nb=scaleTo(M[id].base,T[id]);
    const ns=`base:{hp:${nb.hp},atk:${nb.atk},def:${nb.def},spa:${nb.spa},spd:${nb.spd},spe:${nb.spe}}`;
    const re=new RegExp("(\\n\\s{0,4}"+id+": \\{ id:"+id+",[\\s\\S]*?)base:\\{[^}]*\\}");
    if(!re.test(txt)){miss.push(id);continue;}
    txt=txt.replace(re,"$1"+ns); done++;
  }
  fs.writeFileSync("/home/user/Lumoria/js/data.js",txt);
  console.log("applied:",done," misses:",miss.length,miss.slice(0,20).join(","));
}
