// Lane A.1 — base-dex BST distribution REDO (post-renumber / post-#115).
//
// Re-runs the e9d9892 rescale methodology (scripts/bst_reduce.js) against the
// FINALIZED encounter tables and the new availability-ordered ids:
//   - scales FROM the pre-rescale originals (e9d9892^) so finalized availability
//     fully re-determines each line's BST (role/spread preserved);
//   - progression signal = min requiredBadges across wildMonsters (id-position
//     fallback, now meaningful since id == availability);
//   - same caps: standalone 400-510, 2-stage final <=480 (8 exc <=500),
//     3-stage mid<=400/final<=510 (8 exc final<=535), min 200, step gap <=120,
//     non-exception lines never exceed their original BST;
//   - exception lines identified by ROOT NAME (renumber-proof).
// Starters (1-9) and legendaries are not touched here (starters carry the
// separately-confirmed A.1 values; legendaries are a later A.1 step).
//
// Usage: node scripts/bst_redo.js [summary|verify|report <lo> <hi>|apply]
const fs=require("fs"),vm=require("vm"),{execSync}=require("child_process");
function loadText(t){const c={};vm.createContext(c);vm.runInContext(t+"\n;this.__M=MONSTERS_DATA;this.__W=(typeof WORLD_DATA!=='undefined')?WORLD_DATA:null;",c);return {M:c.__M,W:c.__W};}
const {M,W}=loadText(fs.readFileSync(__dirname+"/../js/data.js","utf8"));            // current (new numbering) + finalized availability
const orig=loadText(execSync("git show e9d9892^:js/data.js",{maxBuffer:1<<26}).toString()).M;  // pre-rescale originals
const origByName={};for(const id in orig)origByName[orig[id].name]=orig[id];
const BST=b=>b.hp+b.atk+b.def+b.spa+b.spd+b.spe;
const curBST=id=>BST(M[id].base);
const origBase=id=>{const o=origByName[M[id].name];return o?o.base:M[id].base;};
const origBST=id=>BST(origBase(id));
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const earliest={};for(const a of Object.values(W||{})){const rb=a.requiredBadges||0;for(const wm of (a.wildMonsters||[])){if(earliest[wm.id]==null||rb<earliest[wm.id])earliest[wm.id]=rb;}}
const ids=Object.keys(M).map(Number);
const inDex=id=>id>=10&&id<322;
const isRoot=id=>!ids.some(x=>M[x].evolveTo===id);
const chain=id=>{const o=[id];let c=id,g=0;while(M[c]&&M[c].evolveTo&&g++<9){o.push(M[c].evolveTo);c=M[c].evolveTo;}return o;};
const leg=id=>M[id].rarity==="legendary"||M[id].rarity==="mythical";
const EXC3N=["Serphaxon","Staticclaw","Dawnirel","Cinderfrost","Scrapsapien","Shadowcub","Transluceed","Veilwisp"];
const EXC2N=["Lunaveris","Seafraith","Necralia","Spectroo","Ironpix","Geoclad","Cliffpinch","Breefawn"];
const idByName={};for(const id of ids)idByName[M[id].name]=id;
const EXC3=new Set(EXC3N.map(n=>idByName[n])), EXC2=new Set(EXC2N.map(n=>idByName[n]));
const BASESPAN=321-10;
function lineProg(idsL){let b=null;for(const id of idsL){if(earliest[id]!=null&&(b==null||earliest[id]<b))b=earliest[id];}if(b==null)return Math.max(0,Math.min(1,(idsL[0]-10)/BASESPAN));return Math.max(0,Math.min(1,b/18));}
const lerp=(a,b,t)=>a+(b-a)*t, cl=(lo,hi,v)=>Math.max(lo,Math.min(hi,v));
function scaleTo(base,target){const cur=BST(base),k=target/cur,keys=["hp","atk","def","spa","spd","spe"];let nb={};for(const key of keys)nb[key]=Math.max(12,Math.round(base[key]*k));let diff=target-BST(nb);const order=keys.slice().sort((x,y)=>nb[y]-nb[x]);let i=0,g=0;while(diff!==0&&g++<600){const key=order[i%6];if(diff>0){nb[key]++;diff--;}else if(nb[key]>12){nb[key]--;diff++;}i++;}return nb;}
function targets(){const out={};const roots=ids.filter(id=>inDex(id)&&isRoot(id));
  for(const r of roots){const idsL=chain(r).filter(inDex);if(idsL.some(leg))continue;const prog=lineProg(idsL),R=rng(r*7+1);const jit=sp=>(R()*2-1)*sp;
    const ob=idsL.map(origBST);
    if(idsL.length===1){out[idsL[0]]=Math.round(cl(400,Math.min(510,ob[0]),lerp(405,505,prog)+jit(22)));}
    else if(idsL.length===2){
      if(EXC2.has(r)){const fin=Math.round(Math.min(500,485+R()*15));const base=Math.round(Math.max(200,fin-lerp(90,120,R())));out[idsL[0]]=base;out[idsL[1]]=fin;}
      else{const base=Math.round(cl(200,ob[0],lerp(210,360,prog)+jit(20)));const fin=Math.round(Math.min(480,Math.min(ob[1],base+lerp(95,120,R()))));out[idsL[0]]=base;out[idsL[1]]=fin;}}
    else if(idsL.length===3){
      if(EXC3.has(r)){const fin=Math.round(Math.min(535,515+R()*20));const mid=Math.round(fin-lerp(70,100,R()));const base=Math.round(Math.max(200,mid-lerp(90,120,R())));out[idsL[0]]=base;out[idsL[1]]=mid;out[idsL[2]]=fin;}
      else{const base=Math.round(cl(200,ob[0],lerp(205,300,prog)+jit(18)));const mid=Math.round(Math.min(400,Math.min(ob[1],base+lerp(95,120,R()))));const fin=Math.round(Math.min(510,Math.min(ob[2],mid+lerp(95,120,R()))));out[idsL[0]]=base;out[idsL[1]]=mid;out[idsL[2]]=fin;}}}
  return out;}
const T=targets();
const mode=process.argv[2]||"summary";
const isExcId=id=>ids.some(r=>(EXC2.has(r)||EXC3.has(r))&&chain(r).includes(id));
if(mode==="report"){const lo=+(process.argv[3]||10),hi=+(process.argv[4]||321);
  for(const id of Object.keys(T).map(Number).filter(id=>id>=lo&&id<=hi).sort((a,b)=>a-b)){const nb=scaleTo(origBase(id),T[id]);
    console.log(`#${String(id).padEnd(3)} ${M[id].name.padEnd(15)} rb${String(earliest[id]??"-").padStart(2)} orig${String(origBST(id)).padStart(3)} cur${String(curBST(id)).padStart(3)} -> ${String(T[id]).padStart(3)}  {${nb.hp},${nb.atk},${nb.def},${nb.spa},${nb.spd},${nb.spe}}${isExcId(id)?" *EXC":""}`);}}
if(mode==="verify"){const roots=ids.filter(id=>inDex(id)&&isRoot(id));let v=0,e3=0,e2=0,mn=999,mx=0,incNon=0,gapV=0,nLines=0,nMon=0,sum=0;
  for(const r of roots){const idsL=chain(r).filter(inDex);if(idsL.some(leg))continue;nLines++;const t=idsL.map(id=>T[id]),ob=idsL.map(origBST);const ex=EXC3.has(r)||EXC2.has(r);
    for(let i=0;i<idsL.length;i++){nMon++;sum+=t[i];mn=Math.min(mn,t[i]);mx=Math.max(mx,t[i]);if(!ex&&t[i]>ob[i])incNon++;}
    for(let i=1;i<idsL.length;i++)if(t[i]-t[i-1]>120)gapV++;
    if(t[0]<200)v++;
    if(idsL.length===1){if(t[0]<400||t[0]>510)v++;}
    else if(idsL.length===2){if(EXC2.has(r)){if(t[1]>500)v++;}else if(t[1]>480)v++;}
    else if(idsL.length===3){if(EXC3.has(r)){if(t[2]>535)v++;}else{if(t[1]>400)v++;if(t[2]>510)v++;}}}
  console.log(`lines:${nLines} mons:${nMon} | hard violations:${v} | non-exc increases-over-original:${incNon} | gap>120:${gapV} | BST ${mn}-${mx} | avg ${(sum/nMon).toFixed(1)} | EXC 3-stage ${[...EXC3].length}/8 2-stage ${[...EXC2].length}/8`);}
if(mode==="apply"){
  let txt=fs.readFileSync(__dirname+"/../js/data.js","utf8");
  const setBase=(id,nb)=>{const ns=`base:{hp:${nb.hp},atk:${nb.atk},def:${nb.def},spa:${nb.spa},spd:${nb.spd},spe:${nb.spe}}`;
    const re=new RegExp("(\\n\\s{0,4}"+id+": \\{ id:"+id+",[\\s\\S]*?)base:\\{[^}]*\\}");
    if(!re.test(txt))return false; txt=txt.replace(re,"$1"+ns); return true;};
  let done=0,miss=[];
  for(const id of Object.keys(T).map(Number)){const nb=scaleTo(origBase(id),T[id]);if(setBase(id,nb))done++;else miss.push(id);}
  fs.writeFileSync(__dirname+"/../js/data.js",txt);
  console.log("applied:",done,"miss:",miss.length,miss.slice(0,20).join(","));}
