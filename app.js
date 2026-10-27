/* LocalTrue prototype — static, no backend. State lives in localStorage ("lt_state_v1"). */
(function(){
const B = window.BRAND;
const $ = (s,r=document)=>r.querySelector(s);
const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.title = `${B.name} — ${B.tagline}`;
document.documentElement.style.setProperty('--accent', B.accent);

/* ---------- data ---------- */
const REGIONS = [
  {id:'carbondale', name:'Southern Illinois / Carbondale', towns:'Carbondale · Murphysboro · Marion · Herrin', status:'open', left:38},
  {id:'cape', name:'Cape Girardeau', towns:'Cape · Jackson · Scott City', status:'soon', wl:187, need:250},
  {id:'paducah', name:'Paducah', towns:'Paducah · Metropolis · Mayfield', status:'wl', wl:96, need:250},
  {id:'evansville', name:'Evansville', towns:'Evansville · Newburgh · Mt. Vernon IN', status:'wl', wl:61, need:250},
  {id:'mtvernon', name:'Mount Vernon / Centralia', towns:'Mt. Vernon · Centralia · Salem', status:'wl', wl:44, need:250},
  {id:'popbluff', name:'Poplar Bluff', towns:'Poplar Bluff · Dexter · Sikeston', status:'wl', wl:39, need:250},
];
const regionName = id => (REGIONS.find(r=>r.id===id)||REGIONS[0]).name;

const PALS = [
  ['#ffb88c','#de6262','#3b1f2b'],['#f9d423','#ff6a3c','#2a1a2e'],['#8fd3f4','#6a8cff','#14213d'],
  ['#fbc2eb','#a18cd1','#2b2d42'],['#84fab0','#4fb89a','#14332a'],['#ffd8a8','#e8836b','#4a2c2a']];
function photo(seed, i){
  const p = PALS[(seed + (i%3)) % PALS.length];
  const v = i % 4, dx = [0,-40,30,10][v], sc = [1,.92,1.08,.98][v];
  const hills = v%2 ? `<path d="M0 600 C150 520 250 560 360 500 S560 520 600 480 V800 H0Z" fill="${p[2]}" opacity=".55"/><path d="M0 680 C120 620 300 700 600 610 V800 H0Z" fill="${p[2]}" opacity=".9"/>`
                    : `<path d="M0 560 C100 500 220 540 330 520 S520 470 600 520 V800 H0Z" fill="${p[2]}" opacity=".5"/><path d="M0 650 C180 700 360 600 600 680 V800 H0Z" fill="${p[2]}" opacity=".9"/>`;
  const sun = `<circle cx="${[430,170,460,300][v]}" cy="${[230,260,200,170][v]}" r="${[70,90,60,110][v]}" fill="#fff" opacity=".35"/>`;
  const tx = 300+dx;
  const person = `<g transform="translate(${tx} 0) scale(${sc}) translate(${-tx} 0)"><ellipse cx="${tx}" cy="780" rx="230" ry="190" fill="#2b1c17" opacity=".92"/><rect x="${tx-28}" y="470" width="56" height="70" rx="22" fill="#4a322a"/><circle cx="${tx}" cy="420" r="82" fill="#4a322a"/><path d="M${tx-86} 410 Q${tx-70} 320 ${tx} 328 Q${tx+80} 322 ${tx+88} 410 Q${tx+60} 360 ${tx} 366 Q${tx-60} 362 ${tx-86} 410Z" fill="#2b1c17"/></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs><rect width="600" height="800" fill="url(#g)"/>${sun}${hills}${person}<text x="300" y="786" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#fff" opacity=".35">placeholder photo</text></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
const photos = (p,n=4)=>Array.from({length:n},(_,i)=>photo(p.seed,i));

const PEOPLE = [
 {id:'jess',name:'Jess',age:29,g:'women',town:'Murphysboro',dist:12,seed:0,score:96,likesYou:true,
  tags:['💍 Something serious','🙅‍♀️ No kids','🍷 Drinks socially','🚭 Non-smoker','🩺 Nurse at the hospital','⛪ Faith: spiritual'],
  prompts:[['My perfect Saturday around here is…','Sunrise hike at Giant City, then pie in Makanda, then a Cardinals game on the porch.'],['Best local spot nobody knows about…','The little overlook past the Cedar Lake dam. Bring a blanket.'],["You'll win me over if…","You can laugh at yourself and you're nice to waiters."]],
  interests:['Hiking','Cardinals fan','Country music','Fishing','Farmers market','Dogs'],
  why:'You both love the outdoors, want something serious, and live within 15 miles.'},
 {id:'amber',name:'Amber',age:31,g:'women',town:'Carbondale',dist:5,seed:1,score:91,likesYou:false,
  tags:['💍 Something serious','👶 Has 1 kid','🍷 Rarely drinks','🚭 Non-smoker','🎓 Teacher at SIU','⛪ Faith: Christian'],
  prompts:[['My perfect Saturday around here is…','Soccer game in the morning with my son, tacos on the square, early movie night.'],['Best local spot nobody knows about…','The Little Grassy Lake picnic tables at sunset.'],["You'll win me over if…","You can cook one thing really well."]],
  interests:['Church','Kids\' sports','Cooking','Lake days','Thrifting','Podcasts'],
  why:'You both put family first and want someone steady for the long run.'},
 {id:'kayla',name:'Kayla',age:27,g:'women',town:'Marion',dist:19,seed:2,score:88,likesYou:false,
  tags:['❤️ Serious, taking it slow','🤔 Open to kids','🍺 Drinks socially','🚭 Non-smoker','🐴 Vet tech','⛪ Faith: Christian'],
  prompts:[['My perfect Saturday around here is…','Trail ride, farmers market, then a bonfire with friends.'],['Best local spot nobody knows about…','The back booth at the old drive-in diner in Herrin.'],["You'll win me over if…","You can two-step, or at least try."]],
  interests:['Horses','Two-stepping','Bonfires','Country music','Road trips','Baking'],
  why:'Matching on country life, open to kids, and similar ideas of a great Saturday.'},
 {id:'lindsey',name:'Lindsey',age:34,g:'women',town:'Herrin',dist:16,seed:3,score:84,likesYou:true,
  tags:['💍 Something serious','👶 Wants kids','🍷 Drinks socially','🚭 Non-smoker','🛠️ Owns a salon','⛪ Faith: any'],
  prompts:[['My perfect Saturday around here is…','Breakfast, a long drive on the back roads, and trying a new winery.'],['Best local spot nobody knows about…','Shawnee Hills wine trail, the one with the porch swings.'],["You'll win me over if…","You plan the date. Seriously, I love it when someone plans."]],
  interests:['Wine trail','Back roads','Brunch','Lake days','Gardening','Pickleball'],
  why:'You both want kids someday and enjoy low-key, plan-ahead dates.'},
 {id:'tyler',name:'Tyler',age:32,g:'men',town:'Carbondale',dist:6,seed:4,score:95,likesYou:true,
  tags:['💍 Something serious','🙅 No kids','🍺 Drinks socially','🚭 Non-smoker','🔧 Electrician','⛪ Faith: Christian'],
  prompts:[['My perfect Saturday around here is…','Fish the Crab Orchard in the morning, grill out, then a Salukis game.'],['Best local spot nobody knows about…','The gravel road to Pine Hills overlook.'],["You'll win me over if…","You can talk about anything and you don't mind getting a little muddy."]],
  interests:['Fishing','Salukis fan','Grilling','Hiking','Trucks','Country music'],
  why:'Similar life stage, both want something serious, and you both love the outdoors.'},
 {id:'cody',name:'Cody',age:30,g:'men',town:'Murphysboro',dist:11,seed:5,score:90,likesYou:false,
  tags:['❤️ Serious, taking it slow','🤔 Open to kids','🍺 Drinks socially','🚭 Non-smoker','🌾 Farmer','⛪ Faith: Christian'],
  prompts:[['My perfect Saturday around here is…','Fix something, fish something, eat something.'],['Best local spot nobody knows about…','A pie shop in Alto Pass that closes at 4 sharp.'],["You'll win me over if…","You like dogs more than people sometimes."]],
  interests:['Farming','Dogs','Fishing','Church','Cardinals fan','Bonfires'],
  why:'You both value small-town life and being close to family.'},
 {id:'ben',name:'Ben',age:35,g:'men',town:'Marion',dist:18,seed:0,score:86,likesYou:false,
  tags:['💍 Something serious','👶 Has 1 kid','🍷 Rarely drinks','🚭 Non-smoker','🚒 Firefighter','⛪ Faith: spiritual'],
  prompts:[['My perfect Saturday around here is…','Pancakes with my daughter, the park, then dinner out when she is at her mom\'s.'],['Best local spot nobody knows about…','The Cedar Lake boat dock on a weekday.'],["You'll win me over if…","You're kind, honest, and bring good snacks."]],
  interests:['Parenting','Grilling','Lake days','Football','Camping','Trivia night'],
  why:'Both of you have kids or are great with them, and want something steady.'},
 {id:'josh',name:'Josh',age:28,g:'men',town:'Herrin',dist:15,seed:2,score:82,likesYou:true,
  tags:['❤️ Serious, taking it slow','🤔 Open to kids','🍺 Drinks socially','🚬 Occasionally smokes','🎓 Grad student','⛪ Faith: any'],
  prompts:[['My perfect Saturday around here is…','Coffee, a record store, a hike, tacos. Repeat.'],['Best local spot nobody knows about…','Open mic night at the little bookshop.'],["You'll win me over if…","You have a favorite album and defend it."]],
  interests:['Vinyl','Hiking','Coffee','Board games','Trivia night','Dogs'],
  why:'You overlap on hiking, live music, and a laid-back pace.'},
];
const person = id=>PEOPLE.find(p=>p.id===id);

const VENUES = {
 carbondale:[
  {id:'v1',name:'Mill Street Diner',type:'Diner · American',em:'🥧',bg:'linear-gradient(135deg,#ffb88c,#de6262)',perk:'Free slice of pie to share',hrs:{wk:['17:00','17:30','18:00','18:30','19:00','19:30','20:00'],we:['11:30','12:00','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30']},closed:[1]},
  {id:'v2',name:'Union Hill Coffee Roasters',type:'Coffee · First-date friendly',em:'☕',bg:'linear-gradient(135deg,#d9a066,#6b3f2a)',perk:'2-for-1 lattes',hrs:{wk:['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'],we:['09:00','10:00','11:00','12:00','13:00','14:00','15:00']},closed:[]},
  {id:'v3',name:'Cedar Creek Winery',type:'Winery · Tastings',em:'🍷',bg:'linear-gradient(135deg,#a18cd1,#5b2a66)',perk:'Complimentary tasting flight for two',hrs:{wk:['16:00','17:00','18:00'],we:['12:00','13:00','14:00','15:00','16:00','17:00','18:00']},closed:[1,2]},
  {id:'v4',name:'Strike Zone Lanes',type:'Bowling · Casual & fun',em:'🎳',bg:'linear-gradient(135deg,#6a8cff,#2a2f6e)',perk:'Free shoe rental + one free game',hrs:{wk:['18:00','19:00','20:00','21:00'],we:['13:00','14:00','15:00','18:00','19:00','20:00','21:00']},closed:[]},
  {id:'v5',name:'Lakeside Pizza Co.',type:'Pizza · Patio seating',em:'🍕',bg:'linear-gradient(135deg,#ffd8a8,#e8836b)',perk:'Free appetizer with any entrée',hrs:{wk:['17:00','18:00','19:00','20:00'],we:['12:00','13:00','17:00','18:00','19:00','20:00']},closed:[0]},
 ]};
VENUES.cape = VENUES.carbondale.map(v=>({...v})); VENUES.paducah = VENUES.carbondale.map(v=>({...v}));
const venuesFor = r=>VENUES[r]||VENUES.carbondale;

/* ---------- state ---------- */
const KEY='lt_state_v2';
const DEF = {loggedIn:false, user:{name:'Alex',email:'',verified:false,gender:'man',interested:'women',ageMin:27,ageMax:38,distance:30,looking:'serious',kids:'none',futureKids:'open',faith:'any',drinking:'social',smoking:'never',politics:'moderate',relImp:'some',timeline:'someday',smokeTol:'rare',drinkTol:'social',pets:'both',loveLang:'time',seeFreq:'few',eduImp:'some',imp:{},vis:{politics:'priv'},region:'carbondale',onboarded:false},
  swipes:{}, matched:{}, view:'me', date:{withId:null,venueId:null,stage:'none',proposal:null,confirmed:null,venueStatus:'none',suggested:null,code:null}, biz:{s1:'pending'}, waitlist:{}, opened:{}, notify:{email:true,text:true}, invites:0};
let state;
try{ state = Object.assign({},JSON.parse(JSON.stringify(DEF)),JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){ state=JSON.parse(JSON.stringify(DEF)); }
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const resetAll=()=>{state=JSON.parse(JSON.stringify(DEF));save();S={};verify={step:1,id:false,selfie:false};ob={step:1};location.hash='#/';render();toast('Demo reset');};

let S={};              // scheduler ephemeral state
let verify={step:1,id:false,selfie:false};
let ob={step:1};

/* ---------- helpers ---------- */
const ICON_CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="#06210f" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const LOGO=`<svg viewBox="0 0 32 32"><path d="M16 29S4 20.5 4 12.2A6.7 6.7 0 0 1 16 8a6.7 6.7 0 0 1 12 4.2C28 20.5 16 29 16 29Z" fill="${B.accent}"/><circle cx="16" cy="13.5" r="3.4" fill="#14100e"/></svg>`;
const brandLink=`<a class="brand" href="#/">${LOGO}<span>${esc(B.name)}</span></a>`;
const vbadge=t=>`<span class="vbadge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>${t||'ID Verified'}</span>`;
const vcheck=`<span class="vcheck" title="ID Verified">${ICON_CHECK}</span>`;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600);}
function modal(html){ $('#modal-root').innerHTML=`<div class="modal-bg" data-act="close-modal-bg"><div class="modal">${html}</div></div>`; }
function closeModal(){ $('#modal-root').innerHTML=''; }
const pad=n=>String(n).padStart(2,'0');
const iso=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
const parseIso=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const fmtDay=s=>parseIso(s).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
const fmtDayLong=s=>parseIso(s).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
const fmtT=t=>{let [h,m]=t.split(':').map(Number);const ap=h>=12?'PM':'AM';h=h%12||12;return `${h}:${pad(m)} ${ap}`;};
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;};
function slotsFor(v,dstr){
  const d=parseIso(dstr),dow=d.getDay();
  if(v.closed.includes(dow))return [];
  const base=(dow===0||dow===5||dow===6)?v.hrs.we:v.hrs.wk;
  return base.map(t=>({t,taken:hash(v.id+dstr+t)%5===0}));
}
const today=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate());};
const me=()=>state.user.name||'Alex';
const other=()=>person(state.date.withId)||PEOPLE.find(p=>p.g===state.user.interested)||PEOPLE[0];
const myPhoto=()=>photo(7,1);

const ATTR={
 jess:{looking:'serious',kids:'none',futureKids:'no',faith:'spiritual',drinking:'social',smoking:'never',politics:'moderate',relImp:'some',timeline:'someday',smokeTol:'no',drinkTol:'social',pets:'dog',loveLang:'time',seeFreq:'few',eduImp:'some',edu:'degree',priv:['politics','timeline']},
 amber:{looking:'serious',kids:'have',futureKids:'open',faith:'christian',drinking:'no',smoking:'never',politics:'conservative',relImp:'very',timeline:'soon',smokeTol:'no',drinkTol:'none',pets:'both',loveLang:'acts',seeFreq:'few',eduImp:'some',edu:'degree',priv:['politics','seeFreq']},
 kayla:{looking:'serious',kids:'none',futureKids:'open',faith:'christian',drinking:'social',smoking:'never',politics:'conservative',relImp:'some',timeline:'someday',smokeTol:'rare',drinkTol:'social',pets:'dog',loveLang:'touch',seeFreq:'daily',eduImp:'low',edu:'some',priv:['politics']},
 lindsey:{looking:'serious',kids:'none',futureKids:'want',faith:'any',drinking:'social',smoking:'never',politics:'moderate',relImp:'low',timeline:'soon',smokeTol:'no',drinkTol:'ok',pets:'cat',loveLang:'gifts',seeFreq:'few',eduImp:'low',edu:'trade',priv:['loveLang','timeline']},
 tyler:{looking:'serious',kids:'none',futureKids:'no',faith:'christian',drinking:'social',smoking:'never',politics:'conservative',relImp:'some',timeline:'someday',smokeTol:'rare',drinkTol:'ok',pets:'dog',loveLang:'acts',seeFreq:'few',eduImp:'low',edu:'trade',priv:['politics']},
 cody:{looking:'serious',kids:'none',futureKids:'open',faith:'christian',drinking:'social',smoking:'never',politics:'conservative',relImp:'very',timeline:'someday',smokeTol:'rare',drinkTol:'ok',pets:'dog',loveLang:'time',seeFreq:'week',eduImp:'low',edu:'some',priv:['politics','eduImp']},
 ben:{looking:'serious',kids:'have',futureKids:'open',faith:'spiritual',drinking:'no',smoking:'never',politics:'moderate',relImp:'some',timeline:'someday',smokeTol:'no',drinkTol:'none',pets:'dog',loveLang:'time',seeFreq:'week',eduImp:'some',edu:'some',priv:['seeFreq']},
 josh:{looking:'casual',kids:'none',futureKids:'open',faith:'any',drinking:'social',smoking:'occasional',politics:'liberal',relImp:'low',timeline:'slow',smokeTol:'ok',drinkTol:'ok',pets:'cat',loveLang:'words',seeFreq:'few',eduImp:'high',edu:'degree',priv:[]}};
PEOPLE.forEach(p=>{p.a=ATTR[p.id];p.priv=p.a.priv;});
PEOPLE.find(p=>p.id==='josh').tags[0]='🙂 Casual, seeing where it goes';

/* ---------- questions & match importance engine ---------- */
const IMP=[['deal','Dealbreaker'],['very','Very important'],['some','Somewhat'],['none',"Doesn't matter"]];
const IMP_W={deal:4,very:3,some:1.5,none:0};
const IMP_DEF={looking:'very',age:'very',distance:'some',kids:'some',futureKids:'very',faith:'some',drinking:'some',smoking:'some',politics:'some',relImp:'some',timeline:'some',smokeTol:'some',drinkTol:'some',pets:'none',loveLang:'none',seeFreq:'some',eduImp:'none'};
const VIS_DEF={politics:'priv'};
const Q_LABEL={looking:'What you want',age:'Age',distance:'Distance',kids:'Kids',futureKids:'Future kids',faith:'Faith',drinking:'Drinking',smoking:'Smoking',politics:'Political beliefs',relImp:'Importance of religion',timeline:'Relationship timeline',smokeTol:'Partner smoking',drinkTol:'Partner drinking',pets:'Pets',loveLang:'Love language',seeFreq:'How often to see each other',eduImp:'Education'};
const Q_ICON={looking:'💍',kids:'👶',futureKids:'🍼',faith:'⛪',drinking:'🍷',smoking:'🚭',politics:'🗳️',relImp:'🙏',timeline:'⏳',smokeTol:'🚬',drinkTol:'🥂',pets:'🐾',loveLang:'💌',seeFreq:'📆',eduImp:'🎓'};
const LABELS={
 looking:{serious:'Something serious',casual:'Casual dating',friends:'Friends first'},
 kids:{none:'No kids',have:'Has kids'},
 futureKids:{want:'Wants kids someday',open:'Open to kids',no:"Doesn't want (more) kids"},
 faith:{any:'Open on faith',christian:'Christian',spiritual:'Spiritual',other:'Other faith',none:'Not religious'},
 drinking:{no:'Rarely drinks',social:'Drinks socially',often:'Drinks regularly'},
 smoking:{never:'Non-smoker',occasional:'Occasional smoker',yes:'Smoker'},
 politics:{liberal:'Liberal',moderate:'Moderate',conservative:'Conservative',apolitical:'Not into politics'},
 relImp:{very:'Religion very important',some:'Religion somewhat important',low:'Religion not important'},
 timeline:{soon:'Marriage-minded, ~2 years',someday:'Marriage in a few years',slow:'No rush on a timeline'},
 smokeTol:{ok:'Fine with smokers',rare:'OK with occasional smoking',no:'Prefers non-smokers'},
 drinkTol:{ok:'Fine with drinking',social:'OK with social drinking',none:'Prefers a non-drinker'},
 pets:{dog:'Dog person',cat:'Cat person',both:'Loves both',none:'No pets'},
 loveLang:{words:'Words of affirmation',time:'Quality time',touch:'Physical touch',gifts:'Gifts',acts:'Acts of service'},
 seeFreq:{daily:'Almost every day',few:'A few times a week',week:'About once a week',space:'Needs lots of space'},
 eduImp:{high:'Education very important',some:'Education somewhat important',low:'Education not important'},
 edu:{degree:'College degree',some:'Some college',trade:'Trade / vocational'}};
const imp=k=>((state.user.imp||{})[k])||IMP_DEF[k];
const visOf=k=>((state.user.vis||{})[k])||VIS_DEF[k]||'show';
const regOpen=id=>{const r=REGIONS.find(x=>x.id===id);return !!r&&(r.status==='open'||!!(state.opened&&state.opened[id]));};
const ord=(list,step)=>(w,h)=>Math.max(.05,1-step*Math.abs(list.indexOf(w)-list.indexOf(h)));
function compat(k,want,p){
  const has=p.a[k];
  if(k==='smokeTol'){const h=p.a.smoking;return {never:1,occasional:{ok:1,rare:.8,no:0}[want],yes:{ok:1,rare:.4,no:0}[want]}[h]??1;}
  if(k==='drinkTol'){const h=p.a.drinking;return {no:1,social:{ok:1,social:1,none:0}[want],often:{ok:1,social:.4,none:0}[want]}[h]??1;}
  if(k==='eduImp'){const h=p.a.edu;return {high:{degree:1,some:.55,trade:.4},some:{degree:1,some:.85,trade:.7},low:{degree:1,some:1,trade:1}}[want][h]??1;}
  if(want===has) return 1;
  if(k==='relImp') return ord(['very','some','low'],.5)(want,has);
  if(k==='timeline') return ord(['soon','someday','slow'],.45)(want,has);
  if(k==='seeFreq') return ord(['daily','few','week','space'],.3)(want,has);
  if(k==='loveLang') return .55;
  if(k==='pets') return {dog:{cat:.4,both:.85,none:.3},cat:{dog:.4,both:.85,none:.3},both:{dog:.85,cat:.85,none:.4},none:{dog:.3,cat:.3,both:.4}}[want][has]??.5;
  if(k==='faith'){ if(want==='any'||has==='any') return 1; const pair=[want,has].sort().join(); return pair==='christian,spiritual'?.4:pair==='other,spiritual'?.5:0; }
  const M={
   looking:{serious:{casual:.2,friends:.5},casual:{serious:.3,friends:.7},friends:{serious:.6,casual:.7}},
   kids:{none:{have:.4},have:{none:.4}},
   futureKids:{want:{no:0,open:.8},no:{want:0,open:.7},open:{want:.8,no:.7}},
   drinking:{no:{social:.5,often:0},social:{no:.6,often:.6},often:{no:0,social:.6}},
   smoking:{never:{occasional:.35,yes:0},occasional:{never:.6,yes:.6},yes:{never:.2,occasional:.6}},
   politics:{liberal:{moderate:.65,conservative:0,apolitical:.6},moderate:{liberal:.65,conservative:.65,apolitical:.7},conservative:{liberal:0,moderate:.65,apolitical:.6},apolitical:{liberal:.6,moderate:.7,conservative:.6}}};
  return ((M[k]||{})[want]||{})[has]??0;
}
const THEIRS={smokeTol:p=>LABELS.smoking[p.a.smoking],drinkTol:p=>LABELS.drinking[p.a.drinking],eduImp:p=>LABELS.edu[p.a.edu]};
const PRIVKEY={smokeTol:'smoking',drinkTol:'drinking'};
const isPriv=(p,k)=>p.priv.includes(PRIVKEY[k]||k);
const QKEYS=['looking','age','distance','kids','futureKids','faith','drinking','smoking','politics','relImp','timeline','smokeTol','drinkTol','pets','loveLang','seeFreq','eduImp'];
function scoreOf(p){
  const u=state.user, rows=[];
  QKEYS.forEach(k=>{
    let c,mine,theirs;
    if(k==='age'){const ad=p.age<u.ageMin?u.ageMin-p.age:p.age>u.ageMax?p.age-u.ageMax:0;c=ad===0?1:ad<=2?.5:0;mine=`${u.ageMin}–${u.ageMax}`;theirs=`${p.age}`;}
    else if(k==='distance'){c=p.dist<=u.distance?1:p.dist<=u.distance*1.3?.4:0;mine=`within ${u.distance} mi`;theirs=`${p.dist} mi`;}
    else{c=compat(k,u[k],p);mine=(LABELS[k]||{})[u[k]]||'Not set';theirs=THEIRS[k]?THEIRS[k](p):LABELS[k][p.a[k]];}
    rows.push({k,c,imp:imp(k),mine,theirs,priv:k!=='age'&&k!=='distance'&&isPriv(p,k)});
  });
  let w=0,t=0,blocked=[];
  rows.forEach(r=>{const wt=IMP_W[r.imp]; if(r.imp==='deal'&&r.c<.5) blocked.push(r); w+=wt; t+=wt*r.c;});
  const fit=w?t/w:1;
  const score=Math.max(40,Math.min(99,Math.round(fit*72+p.score*.27)));
  return {score,rows,blocked};
}
const matchAll=()=>PEOPLE.filter(p=>p.g===state.user.interested);
const matchList=()=>matchAll().map(p=>({p,s:scoreOf(p)})).filter(x=>!x.s.blocked.length).sort((a,b)=>b.s.score-a.s.score).map(x=>x.p);
const hiddenList=()=>matchAll().filter(p=>scoreOf(p).blocked.length);
const CHIP_ORDER=['looking','kids','futureKids','faith','drinking','smoking','politics','relImp','timeline','smokeTol','drinkTol','pets','loveLang','seeFreq','eduImp'];
function chipsFrom(get,isPrivate,n){
  const out=CHIP_ORDER.filter(k=>!isPrivate(k)&&get(k)&&LABELS[k][get(k)]).map(k=>`<span class="chip">${Q_ICON[k]} ${esc(LABELS[k][get(k)])}</span>`);
  return n?out.slice(0,n):out;
}
const publicChips=(p,n)=>chipsFrom(k=>p.a[k],k=>p.priv.includes(k),n);
const align=c=>c>=.85?'Aligned':c>=.5?'Partly aligned':'Not aligned';


function regCount(r){return regOpen(r.id)&&r.status!=='open'?250:r.status==='open'?250-r.left:r.wl+(state.waitlist[r.id]?1:0);}
function regionProgress(r){
  const n=regCount(r), pct=Math.min(100,Math.round(n/250*100));
  return `<span class="rbar"><i style="width:${pct}%"></i></span><span class="st">${r.status==='open'?`${n} of 250 founding spots claimed · ${r.left} left`:regOpen(r.id)?'Open · 250 of 250 verified':`${n} of 250 verified members · ${250-n} to go`}</span>`;
}

/* ---------- nav ---------- */
function renderNav(route){
  const wait=!regOpen(state.user.region);
  const appMode = state.loggedIn && !['','login','signup','verify'].includes(route);
  const lk=(h,l,on)=>`<a href="${h}" class="${on?'on':''}">${l}</a>`;
  let html='';
  if(!appMode){
    html=`<div class="topbar"><div class="in">${brandLink}<div class="spacer"></div>
      <nav class="navlinks"><a class="hide-m" href="#/" data-scroll="how">How it works</a><a class="hide-m" href="#/" data-scroll="regions">Regions</a><a class="hide-m" href="#/" data-scroll="partners">For businesses</a>
      <a href="#/login">Log in</a><a class="btn primary sm" href="#/signup">Sign up free</a></nav></div></div>`;
    document.body.classList.remove('has-tabs');
  } else {
    html=`<div class="topbar"><div class="in">${brandLink}<div class="spacer"></div>
      <nav class="navlinks hide-m">${wait?lk('#/waiting','Waitlist',route==='waiting'):lk('#/matches','This week',route==='matches'||route==='profile')}${wait?'':lk('#/schedule','Dates',route==='schedule')}${lk('#/business','Business view',route==='business')}${lk('#/onboarding','Preferences',route==='onboarding')}</nav>
      <img class="avatar-sm" src="${myPhoto()}" alt="">
      </div></div>
      <nav class="tabbar">${wait?`<a href="#/waiting" class="${route==='waiting'?'on':''}"><span>⏳</span>Waitlist</a>`:`<a href="#/matches" class="${route==='matches'||route==='profile'?'on':''}"><span>💞</span>Matches</a><a href="#/schedule" class="${route==='schedule'?'on':''}"><span>📅</span>Dates</a>`}<a href="#/business" class="${route==='business'?'on':''}"><span>🏪</span>Business</a><a href="#/onboarding" class="${route==='onboarding'?'on':''}"><span>⚙️</span>Prefs</a></nav>`;
    document.body.classList.add('has-tabs');
  }
  $('#nav').innerHTML=html;
}
let fabOpen=false;
function renderFab(){
  $('#fab').innerHTML=`${fabOpen?`<div class="fab-menu"><small>Jump to screen</small>
  <a href="#/">1 · Landing</a><a href="#/signup">2 · Sign up + ID verify</a><a href="#/login">2b · Log in</a><a href="#/onboarding">3 · “Interested in”</a><a href="#/matches">4 · Weekly matches</a><a href="#/profile/jess">5 · Profile</a><a href="#/schedule">6 · Schedule a date</a><a href="#/business">7 · Business view</a><hr>
  <a href="#/waiting" data-act="demo-waiting">3b · Waiting screen (Paducah)</a><button data-act="demo-login">⚡ Skip to logged-in demo</button><button data-act="reset">↺ Reset demo data</button></div>`:''}<button class="fab-btn" data-act="fab">🧭 Demo menu</button>`;
}

/* ---------- landing ---------- */
function pLanding(){
  const first=PEOPLE[0];
  return `
  <section class="hero"><div class="wrap">
    <div>
      <div class="eyebrow">18+ · Every member ID-verified</div>
      <h1>Real people.<br><em>Real local.</em><br>Real dates.</h1>
      <p class="lead">${esc(B.name)} is dating for small-town Illinois, Missouri and Kentucky. No fakes, no endless swiping. Just a few thoughtful local matches every week, and a button that turns “we matched” into a table for two.</p>
      <div class="row"><a class="btn primary lg" href="#/signup">Join free — verify in 2 minutes</a><a class="btn ghost lg" href="#/login">Log in</a></div>
      <div class="trust"><div><b>100%</b>ID-verified</div><div><b>3–5</b>matches a week</div><div><b>0</b>swiping</div><div><b>$0</b>for founding members</div></div>
    </div>
    <div class="hero-art"><div class="phone"><div class="scr">
      <img src="${photo(0,0)}" alt="Sample profile"><div class="cap"><div class="row" style="justify-content:space-between"><b style="font-family:var(--serif);font-size:1.3rem">${first.name}, ${first.age}</b>${vbadge()}</div><div class="muted small">${first.town} · ${first.dist} mi · Nurse</div></div>
      <div class="float" style="top:18px;right:-6px;color:var(--green)">✓ ID verified</div>
      <div class="float" style="bottom:90px;left:-12px">💘 96% match</div></div></div></div>
  </div></section>

  <section id="how" data-sec="how"><div class="wrap"><div class="eyebrow">How it works</div><h2>From “hello” to a table for two.</h2>
    <div class="grid g3 steps" style="margin-top:28px">
      <div class="card step"><span class="ico">🪪</span><h3>Verify</h3><p>Upload an ID and snap a quick selfie. We confirm you're 18+ and a real person, and you get the green check. Nobody gets in without one.</p></div>
      <div class="card step"><span class="ico">💞</span><h3>Get matched</h3><p>Answer a few questions about what you want. Each week you get 3–5 hand-picked locals with a note on why you fit. Tap Interested or Pass.</p></div>
      <div class="card step"><span class="ico">🍽️</span><h3>Schedule a date</h3><p>When you both say yes, propose up to three days and times at a local partner spot. They pick one or counter. The venue gets the reservation request and you get a perk.</p></div>
    </div></div></section>

  <section id="regions" data-sec="regions" style="padding-top:20px"><div class="wrap"><div class="eyebrow">Regions</div><h2>Pick your home town area.</h2>
    <p class="lead" style="margin:10px 0 24px">Like classifieds, but for dating: you only see and match with people near you. A region opens once 250 ID-verified locals have joined its waitlist. Join the queue with a real, verified account and we'll notify you the day it opens.</p>
    <div class="grid g2">${REGIONS.map(r=>`<button class="region" data-act="region" data-id="${r.id}"><span class="dot" style="background:${r.status==='open'?'var(--green)':r.status==='soon'?'var(--amber)':'#8d7d72'}"></span><span style="flex:1"><span class="nm">${r.name}</span><br><span class="st">${r.towns}</span>${regionProgress(r)}</span>
      <span class="tag ${regOpen(r.id)?'open':r.status==='soon'?'soon':'wl'}">${regOpen(r.id)?'Open now':state.waitlist[r.id]?'In the queue ✓':r.status==='soon'?'Almost there':'Join waitlist'}</span></button>`).join('')}</div></div></section>

  <section><div class="wrap"><div class="offer">
    <div><div class="eyebrow">Founding member offer</div><h2>The first 250 verified members in every region are free.</h2>
      <p class="lead" style="margin-top:12px">Join early and lock in a free founding membership. Your region's match quality gets better with every verified neighbor who joins.</p>
      <div class="row" style="margin-top:20px"><a class="btn primary lg" href="#/signup">Claim a founding spot</a></div></div>
    <div class="card" style="background:rgba(20,16,14,.55)"><div class="small muted">Southern Illinois / Carbondale</div><div style="font-family:var(--serif);font-size:2.6rem;font-weight:700">212 <span class="muted" style="font-size:1.1rem;font-weight:500">of 250 claimed</span></div>
      <div class="bar" style="margin:10px 0 12px"><i style="width:85%"></i></div><div class="small muted"><b style="color:var(--amber)">38 founding spots left.</b> Founding members stay free, and the price is the same for everyone if we ever charge.</div></div>
  </div></div></section>

  <section id="partners" data-sec="partners" style="padding-top:20px"><div class="wrap"><div class="biz">
    <div style="flex:1;min-width:260px"><div class="eyebrow">For local businesses</div><h2>Be where the first dates happen.</h2>
      <p class="lead" style="margin-top:10px">Restaurants, cafés, wineries, bowling alleys: list your spot on the “Schedule a date” button. <b style="color:var(--text)">The first 50 businesses per region are free for 6 months</b>, with a Founding Partner badge, a locked-in rate, and a monthly report of dates you hosted.</p></div>
    <div class="row"><button class="btn primary lg" data-act="partner">Become a partner</button><a class="btn ghost lg" href="#/business">See the business view</a></div></div></div></section>

  <footer><div class="wrap row" style="justify-content:space-between"><div>${brandLink}<div class="small" style="margin-top:6px">Prototype. All profiles, venues and numbers are fake demo data.</div></div><div class="small">18+ only · Every member ID-verified · One-on-one dating</div></div></footer>`;
}

/* ---------- auth ---------- */
function pAuth(mode){
  return `<div class="auth"><div class="narrow" style="max-width:480px">
   <div class="tabs"><a href="#/signup" class="${mode==='signup'?'on':''}">Sign up</a><a href="#/login" class="${mode==='login'?'on':''}">Log in</a></div>
   ${mode==='signup'?`
    ${!regOpen(state.user.region)?`<div class="banner" style="margin-bottom:14px"><div class="small"><b>Joining the ${esc(regionName(state.user.region).split(' / ')[0])} queue.</b> Create a real account and verify your ID. Only verified members count toward the 250 that opens your region.</div></div>`:''}
    <h2 style="font-size:2rem">Create your account</h2><p class="muted" style="margin-top:6px">Free for founding members. Next step: verify your ID.</p>
    <form data-form="signup">
      <label class="f">First name</label><input type="text" name="name" placeholder="Alex" required>
      <label class="f">Email</label><input type="email" name="email" placeholder="you@email.com" required>
      <label class="f">Password</label><input type="password" name="pw" placeholder="At least 8 characters" required minlength="4">
      <label class="check"><input type="checkbox" name="age" required><span>I confirm I am <b style="color:var(--text)">18 or older</b> and agree to the Terms and Privacy Policy.</span></label>
      <button class="btn primary block lg" type="submit">Continue to ID verification →</button>
    </form>`:`
    <h2 style="font-size:2rem">Welcome back</h2><p class="muted" style="margin-top:6px">Your weekly matches are waiting.</p>
    <form data-form="login">
      <label class="f">Email</label><input type="email" name="email" placeholder="you@email.com">
      <label class="f">Password</label><input type="password" name="pw" placeholder="Password">
      <button class="btn primary block lg" type="submit" style="margin-top:20px">Log in</button>
      <p class="small muted center" style="margin-top:14px">Demo: any email and password works (or leave blank).</p>
    </form>`}
  </div></div>`;
}
function pVerify(){
  const v=verify;
  const stepbar=`<div class="progress">${[1,2,3].map(i=>`<i class="${v.step>=i?'on':''}"></i>`).join('')}</div>`;
  let body='';
  if(v.step===1) body=`<div class="eyebrow">Step 1 of 3</div><h2 style="font-size:1.9rem">Upload your photo ID</h2><p class="muted" style="margin:6px 0 18px">Driver's license, state ID or passport. We check your birthdate (18+) and name. Your ID is never shown to other members.</p>
    <div class="idcard ${v.id?'done':''}">${v.id?`<div class="fakeid"><div class="ph"></div><div><b>ILLINOIS · DRIVER LICENSE</b><div class="ln"></div><div class="ln" style="width:70%"></div><div class="ln" style="width:50%"></div></div></div><div style="color:var(--green);font-weight:700">✓ ID received · age 18+ confirmed (demo)</div>`:`<div style="font-size:2.2rem">🪪</div><p class="muted" style="margin:8px 0 16px">Drag a photo here or choose a file</p><div class="row" style="justify-content:center"><label class="btn ghost sm" style="cursor:pointer">Choose file<input type="file" accept="image/*" hidden data-act-change="id"></label><button class="btn primary sm" data-act="id">Use sample ID (demo)</button></div>`}</div>
    <button class="btn primary block lg" style="margin-top:20px" data-act="vnext" ${v.id?'':'disabled'}>Continue →</button>`;
  if(v.step===2) body=`<div class="eyebrow">Step 2 of 3</div><h2 style="font-size:1.9rem">Take a quick selfie</h2><p class="muted" style="margin:6px 0 18px">We match your face to your ID photo so we know it's really you. Takes 5 seconds.</p>
    <div class="idcard ${v.selfie?'done':''}"><div class="selfie ${v.selfie?'done':''}"></div>${v.selfie?'<div style="color:var(--green);font-weight:700">✓ Selfie captured</div>':'<button class="btn primary" data-act="selfie">📸 Take selfie (demo)</button>'}</div>
    <div class="row" style="margin-top:20px"><button class="btn ghost" data-act="vback">← Back</button><button class="btn primary lg" style="flex:1" data-act="vnext" ${v.selfie?'':'disabled'}>Verify me →</button></div>`;
  if(v.step===3) body=`<div class="center" style="padding:30px 0"><div class="spinner"></div><h2 style="font-size:1.7rem">Checking your ID…</h2><p class="muted" style="margin-top:8px">Matching face · confirming age · checking for duplicates</p></div>`;
  if(v.step===4) body=`<div class="center" style="padding:16px 0"><div class="bigcheck">${ICON_CHECK}</div><h2 style="font-size:2rem">You're verified!</h2><p class="muted" style="margin:8px 0 18px">Everyone you meet here is verified too. That's the whole point.</p><div style="margin-bottom:24px">${vbadge('ID Verified · 18+')}</div><a class="btn primary block lg" href="#/onboarding" data-act="verified">Set up my matches →</a></div>`;
  return `<div class="auth"><div class="narrow" style="max-width:480px">${v.step<4?stepbar:''}<div class="card" style="padding:26px">${body}</div></div></div>`;
}

/* ---------- onboarding ---------- */
const OPT={
 looking:[['serious','Something serious','A real relationship'],['casual','Casual dating','See where it goes'],['friends','Friends first','Take it slow']],
 faith:[['any','Not important'],['christian','Christian'],['spiritual','Spiritual'],['other','Other faith'],['none','Not religious']],
 drinking:[['no','Never'],['social','Socially'],['often','Regularly']],
 smoking:[['never','Never'],['occasional','Occasionally'],['yes','Yes']]};
['kids','futureKids','politics','relImp','timeline','smokeTol','drinkTol','pets','loveLang','seeFreq','eduImp'].forEach(k=>{OPT[k]=Object.entries(LABELS[k]);});
OPT.kids=[['none',"I don't have kids"],['have','I have kids']];
OPT.eduImp=[['high','Very important'],['some','Somewhat'],['low',"Doesn't matter"]];
OPT.relImp=[['very','Very important'],['some','Somewhat'],['low','Not important']];
const IMPS={deal:'Dealbreaker',very:'Very',some:'Somewhat',none:"Doesn't matter"};
function impRow(k,noVis){const cur=imp(k),v=visOf(k);return `<div class="imp"><span class="lbl">How important is it that this matches?</span><div class="seg" role="group">${IMP.map(([x,l])=>`<button class="${cur===x?'on '+x:''}" data-act="imp" data-k="${k}" data-v="${x}">${l}</button>`).join('')}</div>${noVis?'':`<button class="vis ${v}" data-act="vis" data-k="${k}" title="Private answers still help us match you, but are never shown on your profile">${v==='priv'?'🔒 Private':'🔓 Shown'}</button>`}</div>`;}
function optGroup(k,big){return `<div class="opts">${OPT[k].map(o=>`<button class="opt ${big?'big':''} ${state.user[k]===o[0]?'on':''}" data-act="pick" data-k="${k}" data-v="${o[0]}">${o[1]}${o[2]?`<small>${o[2]}</small>`:''}</button>`).join('')}</div>${impRow(k)}`;}
const qb=(k,title,big)=>`<div class="q">${title}</div>${optGroup(k,big)}`;
const previewBtn=()=>`<button class="btn ghost sm" data-act="preview" style="float:right">👁 Preview profile</button>`;
function pOnboard(){
  const u=state.user, st=ob.step, N=5;
  let b='';
  if(st===1) b=`<h2 style="font-size:1.9rem">Let's find your people</h2><p class="muted" style="margin-top:6px">Takes about two minutes. Everything is private until you choose to show it.</p>
    <div class="q">I am a…</div><div class="opts">${[['man','Man'],['woman','Woman']].map(o=>`<button class="opt big ${u.gender===o[0]?'on':''}" data-act="pick" data-k="gender" data-v="${o[0]}">${o[1]}</button>`).join('')}</div>
    <div class="q">Interested in…</div><div class="opts">${[['women','Women'],['men','Men']].map(o=>`<button class="opt big ${u.interested===o[0]?'on':''}" data-act="pick" data-k="interested" data-v="${o[0]}">${o[1]}</button>`).join('')}</div>
    ${qb('looking',"I'm looking for…",true)}`;
  if(st===2) b=`<h2 style="font-size:1.9rem">Age &amp; distance</h2>
    <div class="q">Age range <span class="bigval" id="ageout" style="margin-left:8px">${u.ageMin}–${u.ageMax}</span></div>
    <div class="dual"><div class="track"></div><div class="fill" id="agefill"></div><input type="range" min="18" max="80" value="${u.ageMin}" id="ageMin"><input type="range" min="18" max="80" value="${u.ageMax}" id="ageMax"></div>${impRow('age',true)}
    <div class="q">Distance <span class="bigval" id="distout" style="margin-left:8px">${u.distance} mi</span></div>
    <input type="range" min="5" max="100" step="5" value="${u.distance}" id="dist"><div class="small muted" style="margin-top:6px">Small-town friendly: most of your matches will be within 30 miles.</div>${impRow('distance',true)}`;
  if(st===3) b=`${previewBtn()}<h2 style="font-size:1.9rem">Values &amp; beliefs</h2><p class="muted small" style="margin-top:6px">Under each question, tell us how much it matters. <b style="color:var(--text)">Dealbreakers</b> hide people who don't fit; the rest weight your match scores. Tap <b style="color:var(--text)">🔓 Shown / 🔒 Private</b> to choose whether an answer appears on your profile. Private answers still help us match you, but nobody else ever sees them.</p>
    ${qb('politics','Your political beliefs')}${qb('faith','Faith')}${qb('relImp','How important is religion in your life?')}${qb('kids','Kids')}${qb('futureKids','Do you want kids in the future?')}${qb('timeline','Relationship timeline')}`;
  if(st===4) b=`${previewBtn()}<h2 style="font-size:1.9rem">Lifestyle &amp; chemistry</h2><p class="muted small" style="margin-top:6px">The small stuff that decides whether a second date feels easy.</p>
    ${qb('drinking','Your drinking')}${qb('smoking','Your smoking')}${qb('smokeTol','How do you feel about a partner who smokes?')}${qb('drinkTol','How do you feel about a partner who drinks?')}${qb('pets','Pets')}${qb('loveLang','Love language')}${qb('seeFreq','How often do you want to see your partner?')}${qb('eduImp',"How important is a partner's education?")}`;
  if(st===5){const wl=!regOpen(u.region); b=`<h2 style="font-size:1.9rem">Choose your region</h2><p class="muted" style="margin-top:6px">You'll be matched with verified people in this area. Regions still filling up put you in the queue: we open a region once <b style="color:var(--text)">250 verified members</b> have joined, and we'll notify you the moment it does.</p>
    <div class="grid" style="margin-top:18px;gap:10px">${REGIONS.map(r=>`<button class="region" style="${u.region===r.id?'border-color:var(--accent);background:rgba(255,90,60,.1)':''}" data-act="pick" data-k="region" data-v="${r.id}"><span class="dot" style="background:${regOpen(r.id)?'var(--green)':'var(--amber)'}"></span><span><span class="nm">${r.name}</span><br><span class="st">${r.towns}</span>${regionProgress(r)}</span><span class="tag ${regOpen(r.id)?'open':'wl'}">${regOpen(r.id)?'Open now':'Join queue'}</span></button>`).join('')}</div>`;}
  const last=st===N, wl=!regOpen(u.region);
  return `<div class="auth"><div class="narrow" style="max-width:600px"><div class="progress">${Array.from({length:N},(_,i)=>`<i class="${st>i?'on':''}"></i>`).join('')}</div>
   <div class="card" style="padding:26px">${b}<div class="row" style="margin-top:28px">${st>1?'<button class="btn ghost" data-act="obback">← Back</button>':''}<button class="btn primary lg" style="flex:1" data-act="obnext">${last?(wl?'Join the queue →':'See my matches →'):'Next →'}</button></div></div></div></div>`;
}
function bindOnboard(){
  const a=$('#ageMin'),b=$('#ageMax'),f=$('#agefill'),d=$('#dist');
  if(a&&b){
    const upd=src=>{let lo=+a.value,hi=+b.value; if(lo>hi-1){ if(src===a){lo=hi-1;a.value=lo}else{hi=lo+1;b.value=hi} }
      state.user.ageMin=lo;state.user.ageMax=hi;$('#ageout').textContent=`${lo}–${hi}`;f.style.left=((lo-18)/62*100)+'%';f.style.width=((hi-lo)/62*100)+'%';save();};
    a.oninput=()=>upd(a);b.oninput=()=>upd(b);upd();
  }
  if(d) d.oninput=()=>{state.user.distance=+d.value;$('#distout').textContent=d.value+' mi';save();};
}

function lineup(p){
  const sc=scoreOf(p), mark=c=>c>=.85?['✓','ok']:c>=.5?['~','mid']:['✕','no'];
  const rows=sc.rows.filter(r=>r.imp!=='none');
  const skipped=sc.rows.filter(r=>r.imp==='none').map(r=>Q_LABEL[r.k]).join(', ');
  return `<div class="psec"><h4>How you line up</h4><div class="lineup">${rows.map(r=>{const m=mark(r.c);return `<div class="lu ${m[1]}"><i>${m[0]}</i><div><b>${Q_LABEL[r.k]}</b>${r.priv?`<span class="small muted"> · 🔒 ${esc(p.name)} keeps this private · <b style="color:var(--text)">${align(r.c)}</b></span>`:`<span class="small muted"> · you: ${esc(r.mine)} · ${esc(p.name)}: ${esc(r.theirs)}</span>`}</div><em class="impt ${r.imp}">${IMPS[r.imp]}</em></div>`}).join('')}</div>${skipped?`<div class="small muted" style="margin-top:8px">Not counted (you said it doesn't matter): ${skipped}.</div>`:''}<div class="small muted" style="margin-top:8px">🔒 Private answers still count toward your match. We only tell you whether you're aligned, never what they said.</div><a class="small accent" href="#/onboarding" style="display:inline-block;margin-top:8px" data-act="edit-prefs">Change what matters to you →</a></div>`;
}

/* ---------- matches ---------- */
function mCard(p){
  const sw=state.swipes[p.id], matched=state.matched[p.id];
  const act = matched?`<a class="status match" href="#/profile/${p.id}">💚 It's a match · Schedule a date</a>`
    : sw==='interested'?`<div class="status int">❤️ Interested · waiting on ${p.name}</div>`
    : sw==='pass'?`<div class="status pass">Passed</div>`
    : `<div class="acts"><button class="btn ghost" data-act="pass" data-id="${p.id}">Pass</button><button class="btn primary" data-act="like" data-id="${p.id}">Interested</button></div>`;
  return `<article class="mcard"><a class="ph" href="#/profile/${p.id}"><img src="${photo(p.seed,0)}" alt="${p.name}">${vcheck}<span class="score">${scoreOf(p).score}% match</span><span class="nm">${p.name}, ${p.age}<small>${p.town} · ${p.dist} mi away</small></span></a>
   <div class="bd"><div class="tagrow" style="margin:0"><span class="chip">${p.tags[4]}</span>${publicChips(p,2).join('')}</div>
   <div class="why"><b>Why we matched you</b>${esc(p.why)}</div>${act}</div></article>`;
}
function pMatches(){
  const list=matchList();
  const dt=state.date;
  const vn=()=>{const v=venuesFor(state.user.region).find(v=>v.id===dt.venueId);return v?v.name:''};
  const dateBanner = dt.stage==='confirmed'?`<div class="banner"><div style="font-size:1.8rem">🎉</div><div style="flex:1"><b>Upcoming date with ${esc(person(dt.withId).name)}</b><div class="small muted">${fmtDay(dt.confirmed.d)} at ${fmtT(dt.confirmed.t)} · ${esc(vn())}</div></div><a class="btn primary sm" href="#/schedule">View details</a></div>`:
    dt.stage==='proposed'?`<div class="banner"><div style="font-size:1.8rem">📅</div><div style="flex:1"><b>Date proposal in progress with ${esc(person(dt.withId).name)}</b></div><a class="btn primary sm" href="#/schedule">Open</a></div>`:'';
  const monday=new Date(today().getTime()-((today().getDay()+6)%7)*864e5).toLocaleDateString('en-US',{month:'long',day:'numeric'});
  return `<div class="wrap"><div class="pagehead"><div class="eyebrow">Week of ${monday} · ${esc(regionName(state.user.region))}</div>
   <h2>Hi ${esc(me())}, here ${list.length===1?'is your 1 match':'are your '+list.length+' matches'}.</h2><p class="muted" style="margin-top:8px">Hand-picked from verified locals within ${state.user.distance} miles, weighted by what you said matters most. New matches arrive every Monday morning.</p>${dateBanner}</div>
   ${hiddenList().length?`<div class="hidenote">🚫 ${hiddenList().length} ${hiddenList().length===1?'person was':'people were'} hidden by your dealbreakers (${[...new Set(hiddenList().flatMap(p=>scoreOf(p).blocked.map(r=>Q_LABEL[r.k])))].join(', ')}). <a class="accent" href="#/onboarding">Review</a></div>`:''}
   ${list.length?'':`<div class="card center" style="margin-bottom:20px"><b>No matches fit your dealbreakers this week.</b><p class="muted small" style="margin-top:6px">Try loosening one on the <a class="accent" href="#/onboarding">preferences page</a>.</p></div>`}
   <div class="mgrid">${list.map(p=>mCard(p)).join('')}</div>
   <div class="card center" style="margin-bottom:50px"><b>That's your week.</b><p class="muted small" style="margin-top:4px">Want to look around? <a class="accent" href="#/matches" data-act="browse">Browse everyone in your region</a> (verified members only).</p></div></div>`;
}

/* ---------- profile ---------- */
function pProfile(id){
  const p=person(id); if(!p) return `<div class="wrap"><p>Profile not found. <a href="#/matches" class="accent">Back</a></p></div>`;
  const sw=state.swipes[p.id], matched=state.matched[p.id];
  const imgs=photos(p);
  const bar = matched?`<div class="in"><button class="btn ghost" data-act="pass" data-id="${p.id}" style="flex:.5">Unmatch</button><a class="btn primary lg" href="#/schedule" data-act="start-date" data-id="${p.id}">📅 Schedule a date</a></div>`
   : sw==='interested'?`<div class="in"><div class="status int" style="flex:1;margin:0">❤️ Interested · waiting on ${p.name}</div><button class="btn ghost" data-act="demo-yes" data-id="${p.id}" style="flex:.7">Demo: ${p.name} says yes</button></div>`
   : sw==='pass'?`<div class="in"><div class="status pass" style="flex:1;margin:0">You passed</div><button class="btn ghost" data-act="undo" data-id="${p.id}" style="flex:.5">Undo</button></div>`
   : `<div class="in"><button class="btn ghost lg" data-act="pass" data-id="${p.id}">✕ Pass</button><button class="btn primary lg" data-act="like" data-id="${p.id}">❤ Interested</button></div>`;
  return `<div class="wrap"><a href="#/matches" class="small muted" style="display:inline-block;margin-top:16px">← Back to matches</a>
  <div class="profile">
    <div class="car"><div class="track" id="track">${imgs.map(s=>`<img src="${s}" alt="${p.name}">`).join('')}</div>${vcheck}
      <div class="dots" id="dots">${imgs.map((_,i)=>`<i class="${i===0?'on':''}"></i>`).join('')}</div>
      <button class="nav l" data-act="car" data-d="-1" aria-label="Previous photo">‹</button><button class="nav r" data-act="car" data-d="1" aria-label="Next photo">›</button></div>
    <div>
      <div class="row" style="gap:10px;margin-bottom:6px">${vbadge('ID Verified · 18+')}<span class="chip amber">${scoreOf(p).score}% match</span></div>
      <div class="pname">${p.name}, <span>${p.age}</span></div>
      <div class="muted" style="margin-top:6px">📍 ${p.town}, IL · ${p.dist} miles away</div>
      <div class="tagrow"><span class="chip">${p.tags[4]}</span>${publicChips(p).join('')}</div>
      ${p.priv.length?`<div class="small muted" style="margin-top:-6px">🔒 ${esc(p.name)} chose to keep ${p.priv.length} ${p.priv.length===1?'answer':'answers'} private. They still count toward how well you match.</div>`:''}
      <div class="why" style="margin:6px 0 4px"><b>Why we matched you</b>${esc(p.why)}</div>
      ${scoreOf(p).blocked.length?`<div class="banner" style="margin:10px 0;border-color:#ff5a3c"><div class="small"><b>Outside your dealbreakers:</b> ${scoreOf(p).blocked.map(r=>Q_LABEL[r.k]).join(', ')}. ${esc(p.name)} wouldn't normally show up in your matches.</div></div>`:''}
      ${lineup(p)}
      ${p.prompts.map(q=>`<div class="prompt"><small>${esc(q[0])}</small><p>${esc(q[1])}</p></div>`).join('')}
      <div class="psec"><h4>Interests</h4><div class="tagrow" style="margin:0">${p.interests.map(i=>`<span class="chip on">${i}</span>`).join('')}</div></div>
      <div class="card small muted" style="margin-top:24px">🔒 ${matched?`You and ${p.name} are a match. Pick a local spot and propose some times.`:`When you both tap Interested, “Schedule a date” unlocks. No chatting required to get to a first date.`}</div>
    </div></div>
  <div class="stickybar">${bar}</div></div>`;
}
function bindProfile(){
  const t=$('#track'); if(!t) return;
  t.onscroll=()=>{const i=Math.round(t.scrollLeft/t.clientWidth);document.querySelectorAll('#dots i').forEach((d,j)=>d.classList.toggle('on',j===i));};
}

/* ---------- scheduler ---------- */
function initSched(){
  const t=today();
  if(!S.month) S.month={y:t.getFullYear(),m:t.getMonth()};
  if(!S.draft) S.draft=[];
  if(S.day===undefined) S.day=null;
}
function stageIdx(){
  const d=state.date; if(d.stage==='confirmed')return 5;
  if(d.stage==='proposed')return 3;
  return d.venueId?2:1;
}
function stepper(){
  const i=stageIdx(),L=['Pick a spot','Propose times','They respond','Confirmed'];
  return `<div class="stepper">${L.map((l,k)=>`<div class="${k+1<i?'done':k+1===i?'on':''}"><b>Step ${k+1}</b>${k+1<i?'✓ ':''}${l}</div>`).join('')}</div>`;
}
function demoBar(){
  const o=other();
  return `<div class="demobar"><span class="lbl">Demo</span><span class="small muted">Viewing as:</span>
  <div class="viewtoggle"><button class="${state.view==='me'?'on':''}" data-act="view" data-v="me">My view (${esc(me())})</button><button class="${state.view==='them'?'on':''}" data-act="view" data-v="them">Their view (${esc(o.name)})</button></div>
  <button class="btn ghost sm" data-act="restart-date" style="margin-left:auto">↺ Restart this date</button></div>`;
}
function calendar(venue){
  const {y,m}=S.month, first=new Date(y,m,1), days=new Date(y,m+1,0).getDate(), t0=today();
  const minM=t0.getFullYear()*12+t0.getMonth(), cur=y*12+m;
  const hasSet=new Set(S.draft.map(o=>o.d));
  let cells='';
  for(let i=0;i<first.getDay();i++) cells+='<span class="day empty"></span>';
  for(let d=1;d<=days;d++){
    const ds=iso(y,m,d), dt=new Date(y,m,d), past=dt<=t0, none=!past&&slotsFor(venue,ds).filter(s=>!s.taken).length===0;
    cells+=`<button class="day ${S.day===ds?'sel':''} ${hasSet.has(ds)?'has':''}" data-act="day" data-d="${ds}" ${past||none?'disabled':''}>${d}</button>`;
  }
  return `<div class="cal"><div class="hd"><button class="arrow" data-act="month" data-d="-1" ${cur<=minM?'disabled':''}>‹</button><b>${first.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</b><button class="arrow" data-act="month" data-d="1" ${cur>=minM+2?'disabled':''}>›</button></div>
   <div class="dow">${'SMTWTFS'.split('').map(c=>`<span>${c}</span>`).join('')}</div><div class="days">${cells}</div>
   <div class="small muted" style="margin-top:12px">Greyed-out days are closed or fully booked at ${esc(venue.name)}.</div>
   ${S.day?`<div style="margin-top:18px;border-top:1px solid var(--line);padding-top:16px"><b>${fmtDayLong(S.day)}</b><div class="small muted">Tap a time to add it to your options</div><div class="slots">${slotsFor(venue,S.day).map(s=>{const on=S.draft.some(o=>o.d===S.day&&o.t===s.t);return `<button class="slot ${on?'on':''}" data-act="slot" data-t="${s.t}" ${s.taken?'disabled':''}>${fmtT(s.t)}</button>`}).join('')}</div></div>`:`<div class="small" style="margin-top:16px;color:var(--amber)">👆 Pick a day to see open times.</div>`}</div>`;
}
function optsPanel(venue,sendLabel,note){
  const rows=S.draft.map((o,i)=>`<div class="optrow"><span class="n">${i+1}</span><div><b>${fmtDay(o.d)}</b><div class="small muted">${fmtT(o.t)}</div></div><button class="x" data-act="rm" data-i="${i}" aria-label="Remove">✕</button></div>`).join('');
  const empties=Array.from({length:3-S.draft.length},(_,i)=>`<div class="optrow empty">Option ${S.draft.length+i+1} · pick a day &amp; time</div>`).join('');
  return `<div class="card sumcard"><div class="summary"><div class="em" style="background:${venue.bg}">${venue.em}</div><div><b>${esc(venue.name)}</b><div class="small muted">${esc(venue.type)}</div></div></div>
   <div class="perk">🎁 ${esc(venue.perk)} when you book through ${esc(B.name)}</div>
   <div style="margin-top:16px"><b>Your options</b> <span class="small muted">(up to 3)</span></div>${rows}${empties}
   ${S.draft.length>=3?'<div class="small" style="color:var(--amber);margin-top:10px">That\'s 3. Remove one to pick a different time.</div>':''}
   <button class="btn primary block lg" style="margin-top:16px" data-act="send" ${S.draft.length?'':'disabled'}>${sendLabel}</button>
   <div class="small muted center" style="margin-top:10px">${note}</div></div>`;
}
function pSchedule(){
  initSched();
  const d=state.date, region=state.user.region, V=venuesFor(region);
  const matchedAny=Object.keys(state.matched).length>0;
  if(!d.withId && matchedAny){ d.withId=Object.keys(state.matched)[0]; save(); }
  const o=other();
  const head=`<div class="wrap sched"><div><div class="eyebrow">Schedule a date</div><h2 style="font-size:clamp(1.7rem,4vw,2.4rem)">${d.stage==='confirmed'?`Your date with ${esc(o.name)}`:`Plan a date with ${esc(o.name)}`}</h2></div>${demoBar()}${stepper()}`;
  if(!matchedAny){
    return head+`<div class="card center"><div style="font-size:2.4rem">🔒</div><h3 style="margin:8px 0">Schedule a date unlocks when you both say Interested</h3><p class="muted" style="margin:6px 0 16px">For this demo, ${esc(o.name)} is already interested in you.</p><a class="btn primary" href="#/profile/${o.id}">Open ${esc(o.name)}'s profile</a> <a class="btn ghost" href="#/schedule" data-act="start-date" data-id="${o.id}">Skip: we're matched</a></div></div>`;
  }
  const p=o;
  const venue=V.find(v=>v.id===d.venueId);
  const myName=me(), theirName=p.name;

  if(d.stage==='none'){
    if(state.view==='them') return head+`<div class="card center"><div style="font-size:2.2rem">⏳</div><h3 style="margin:8px 0">${esc(myName)} hasn't proposed times yet</h3><p class="muted" style="margin:6px 0 14px">Nothing for ${esc(theirName)} to respond to. Switch to your view to pick a spot and send a proposal.</p><button class="btn primary" data-act="view" data-v="me">Switch to my view</button></div></div>`;
    if(!venue){
      return head+`<div style="margin:6px 0 16px"><b style="font-size:1.15rem">Where should you two go?</b><div class="small muted">Partner spots in ${esc(regionName(region))}. Every one offers a date-night perk for ${esc(B.name)} members.</div></div>
       <div class="venues">${V.map(v=>`<button class="venue" data-act="venue" data-id="${v.id}"><div class="img" style="background:${v.bg}">${v.em}</div><div class="bd"><div class="nm">${esc(v.name)}</div><div class="small muted">${esc(v.type)}</div><div class="perk">🎁 ${esc(v.perk)}</div></div></button>`).join('')}</div>
       <p class="small muted" style="margin-top:16px">Demo venues. In the real thing, local businesses sign up as partners.</p></div>`;
    }
    return head+`<div class="row" style="margin:0 0 14px"><button class="btn ghost sm" data-act="change-venue">← Change spot</button><b>Pick up to 3 days &amp; times that work for you</b></div>
      <div class="pick">${calendar(venue)}${optsPanel(venue,`Send proposal to ${esc(theirName)}`,`${esc(theirName)} can accept one or suggest their own times. Nothing is booked until you both agree.`)}</div></div>`;
  }

  if(d.stage==='proposed'){
    const pr=d.proposal, v=venue, proposerName=pr.by==='me'?myName:theirName;
    const responder=pr.by==='me'?'them':'me';
    const respName=responder==='me'?myName:theirName;
    if(state.view===responder){
      if(S.countering){
        return head+`<div class="row" style="margin:0 0 14px"><button class="btn ghost sm" data-act="cancel-counter">← Back to ${esc(proposerName)}'s options</button><b>Counter: pick up to 3 of your own days &amp; times</b></div>
        <div class="pick">${calendar(v)}${optsPanel(v,`Send counter to ${esc(proposerName)}`,`${esc(proposerName)} can then accept one of yours.`)}</div></div>`;
      }
      return head+`<div class="card" style="margin-top:4px"><div class="summary"><div class="em" style="background:${v.bg}">${v.em}</div><div style="flex:1"><div class="small muted">${pr.counter?'Counter-proposal':'New date proposal'} from <b style="color:var(--text)">${esc(proposerName)}</b></div><b style="font-size:1.15rem">${esc(v.name)}</b><div class="small muted">${esc(v.type)} · ${esc(regionName(region))}</div></div><span class="chip green">✓ Verified</span></div>
         <div class="perk">🎁 ${esc(v.perk)}</div>
         <h3 style="margin:18px 0 4px">${pr.counter?`${esc(proposerName)} suggested these instead:`:`${esc(proposerName)} would like to take you out. Pick a time:`}</h3>
         ${pr.options.map((x,i)=>`<div class="choice"><span class="optrow" style="margin:0;padding:0;background:none;border:0"><span class="n">${i+1}</span></span><div><div class="when">${fmtDay(x.d)}</div><div class="muted">${fmtT(x.t)} · party of 2</div></div><button class="btn primary" data-act="accept" data-i="${i}">Accept this one</button></div>`).join('')}
         <div class="row" style="margin-top:20px;justify-content:space-between"><div class="small muted">None of these work?</div><button class="btn outline" data-act="counter">↔ Counter with my own times</button></div></div></div>`;
    }
    return head+`<div class="card"><div class="center" style="padding:6px 0 4px"><div style="font-size:2.2rem">${pr.counter?'↔️':'📨'}</div><h3 style="margin:6px 0">${pr.counter?`Counter sent to ${esc(proposerName==='me'?theirName:myName)}`:`Proposal sent to ${esc(respName)}`}</h3>
      <p class="muted">Waiting for ${esc(respName)} to ${pr.counter?'accept one of the counter-times':'accept one or counter'}.</p></div>
      <div class="summary" style="margin-top:14px"><div class="em" style="background:${v.bg}">${v.em}</div><div><b>${esc(v.name)}</b><div class="small muted">${esc(v.perk)}</div></div></div>
      ${pr.options.map((x,i)=>`<div class="optrow"><span class="n">${i+1}</span><div><b>${fmtDay(x.d)}</b><div class="small muted">${fmtT(x.t)}</div></div></div>`).join('')}
      <div class="banner" style="margin-top:18px"><div style="flex:1" class="small"><b>Demo tip:</b> flip to <b>${responder==='me'?'My':'Their'} view</b> to see what ${esc(respName)} sees, and try Accept or Counter.</div><button class="btn primary sm" data-act="view" data-v="${responder}">Switch to ${responder==='me'?'my':'their'} view</button></div></div></div>`;
  }

  const c=d.confirmed, v=venue, vs=d.venueStatus;
  const venueLine = vs==='confirmed'?`<li class="ok"><i>✓</i>${esc(v.name)} confirmed your table</li>`:vs==='suggested'?`<li class="wait"><i>!</i>${esc(v.name)} suggested ${fmtT(d.suggested.t)} instead</li>`:`<li class="wait"><i>…</i>Reservation request sent to ${esc(v.name)} · awaiting their confirmation</li>`;
  return head+`<div class="confirm" style="padding-top:10px"><div class="bigcheck">${ICON_CHECK}</div><h2 style="font-size:clamp(1.8rem,5vw,2.6rem)">It's a date!</h2><p class="muted" style="margin-top:6px">${esc(myName)} &amp; ${esc(theirName)} · ${fmtDayLong(c.d)} at ${fmtT(c.t)}</p></div>
  <div class="mid" style="padding:0"><div class="ticket"><div class="top"><div class="em" style="background:${v.bg}">${v.em}</div><div style="flex:1"><div class="eyebrow" style="margin:0">Date booked through ${esc(B.name)}</div><div style="font-family:var(--serif);font-size:1.5rem;font-weight:700">${esc(v.name)}</div><div class="muted small">${esc(v.type)} · ${esc(regionName(region))}</div></div></div>
   <div class="mid2"><div><small>When</small><b>${fmtDay(c.d)} · ${fmtT(c.t)}</b></div><div><small>Party</small><b>2 people</b></div><div><small>Perk</small><b>🎁 ${esc(v.perk)}</b></div><div><small>Your perk code</small><span class="code" style="font-size:1rem;padding:4px 10px">${d.code}</span></div></div></div>
   <div class="card"><b>Reservation status</b><ul class="timeline"><li class="ok"><i>✓</i>${esc(state.view==='me'?theirName:myName)} accepted ${c.from==='counter'?'the counter-time':'the proposal'}</li>${venueLine}<li class="ok"><i>✓</i>Reminder set for the day before</li></ul>
    ${vs==='suggested'?`<div class="row" style="margin:8px 0"><button class="btn primary sm" data-act="accept-suggest">Accept ${fmtT(d.suggested.t)}</button><button class="btn ghost sm" data-act="reproposal">Pick another time</button></div>`:''}
    <div class="small muted" style="margin-top:8px">Show the code <b style="color:var(--amber)">${d.code}</b> at the table to get your perk.</div>
    <a class="btn ghost sm" href="#/business" style="margin-top:12px">🏪 See what ${esc(v.name)} sees →</a></div>
   <div class="grid g2" style="margin-top:16px"><button class="btn ghost lg" data-act="ics">📅 Add to calendar</button><button class="btn outline lg" data-act="share">🛡️ Share with a friend</button></div>
   <div class="small muted center" style="margin-top:16px">Plans change? <button class="accent" data-act="restart-date" style="text-decoration:underline">Cancel &amp; reschedule</button></div></div></div>`;
}

/* ---------- waiting room ---------- */
function pWaiting(){
  const r=REGIONS.find(x=>x.id===state.user.region)||REGIONS[0], short=r.name.split(' / ')[0];
  if(regOpen(r.id)) return `<div class="wrap"><div class="narrow center" style="max-width:560px;padding:40px 0 60px"><div style="font-size:3.4rem">🎉</div><div class="eyebrow">Queue complete</div><h2 style="font-size:clamp(2rem,6vw,3rem)">${esc(short)} is open!</h2>
    <p class="lead" style="margin:10px 0 20px">250 verified neighbors made it. Your first weekly matches are ready.</p>
    <div class="card" style="text-align:left"><div class="small muted">${state.notify.text?'📱 Text':'✉️ Email'} · just now</div><p style="margin-top:6px"><b>${esc(B.name)}:</b> Good news, ${esc(me())}! ${esc(short)} just hit 250 verified members and is now open. Your first matches are waiting.</p></div>
    <a class="btn primary lg" style="margin-top:22px" href="#/matches" data-act="see-matches">See my matches →</a></div></div>`;
  const n=regCount(r), pct=Math.round(n/250*100), left=250-n;
  const code=(me().toUpperCase().replace(/[^A-Z]/g,'')||'FRIEND')+'-'+hashCode();
  const steps=[['Account created',1],['ID verified · 18+',1],['Profile & preferences saved',1],[`${left} more verified neighbors to open ${esc(short)}`,0]];
  return `<div class="wrap"><div class="narrow" style="max-width:720px;padding:34px 0 70px">
   <div class="eyebrow">You're in the queue</div><h2 style="font-size:clamp(1.9rem,5vw,2.8rem)">Waiting for others in ${esc(short)}</h2>
   <p class="lead" style="margin-top:8px">Thanks, ${esc(me())}. You're verified and your profile is ready. We open ${esc(r.name)} once <b style="color:var(--text)">250 verified members</b> have joined, and we'll notify you the moment it does.</p>
   <div class="card" style="margin-top:22px"><div class="row" style="justify-content:space-between;align-items:flex-end"><div><div style="font-family:var(--serif);font-size:3rem;font-weight:700;line-height:1">${n}<span class="muted" style="font-size:1.3rem;font-weight:500"> / 250</span></div><div class="small muted">verified members in ${esc(short)}</div></div><span class="chip amber">${left} to go</span></div>
     <div class="bar" style="margin:14px 0 16px;height:12px"><i style="width:${pct}%"></i></div>
     <ul class="timeline">${steps.map(x=>`<li class="${x[1]?'ok':'wait'}"><i>${x[1]?'✓':'…'}</i>${x[0]}</li>`).join('')}</ul></div>
   <div class="grid g2" style="margin-top:16px">
    <div class="card"><h3 style="margin-bottom:6px">🔔 We'll notify you</h3><p class="small muted">The day ${esc(short)} opens you'll get:</p>
      <div class="notifprev">“${esc(B.name)}: Good news, ${esc(me())}. ${esc(short)} just hit 250 verified members and is now open. Your first matches are waiting.”</div>
      <div class="setrow"><span>Email me</span><span class="switch ${state.notify.email?'on':''}" data-act="notif" data-k="email"></span></div>
      <div class="setrow"><span>Text me</span><span class="switch ${state.notify.text?'on':''}" data-act="notif" data-k="text"></span></div></div>
    <div class="card"><h3 style="margin-bottom:6px">👯 Invite friends</h3><p class="small muted">The faster verified neighbors join, the sooner ${esc(short)} opens. Friends must ID-verify to count.</p>
      <div class="invitebox">${B.name.toLowerCase()}.example/join/${code}</div>
      <div class="row" style="margin-top:12px"><button class="btn primary sm" data-act="invite">Copy invite link</button><button class="btn ghost sm" data-act="invite-share">Text a friend</button></div>
      <div class="small muted" style="margin-top:10px">${state.invites?`${state.invites} invite${state.invites>1?'s':''} shared so far`:'No invites shared yet'}</div></div></div>
   <div class="card" style="margin-top:16px"><div class="row" style="justify-content:space-between"><div><h3>✏️ Your profile</h3><div class="small muted">Edit your answers, importance settings and what's shown or private while you wait.</div></div><div class="row"><a class="btn ghost sm" href="#/onboarding" data-act="edit-prefs">Edit profile</a><button class="btn ghost sm" data-act="preview">👁 Preview</button></div></div></div>
   <div class="demobar" style="margin-top:22px"><span class="lbl">Demo</span><span class="small muted" style="flex:1">Skip the wait and see what happens when ${esc(short)} hits 250.</span><button class="btn primary sm" data-act="sim-open">▶ Simulate ${esc(short)} opening</button></div>
  </div></div>`;
}
function hashCode(){return Math.abs(hash(me()+state.user.region)).toString(36).toUpperCase().slice(0,4).padEnd(4,'X');}

/* ---------- business ---------- */
function pBusiness(){
  const d=state.date, V=venuesFor(state.user.region), v=V.find(x=>x.id===(d.venueId))||V[0];
  const live=d.stage==='confirmed'&&d.venueId;
  const reqCard=(key,title,whenTxt,st)=>{
    return `<div class="req ${st==='pending'?'new':''}"><div class="row" style="justify-content:space-between"><div><b style="font-size:1.1rem">${title}</b> ${st==='pending'?'<span class="chip on" style="margin-left:6px">New request</span>':''}</div>${st==='confirmed'?'<span class="chip green">✓ Confirmed</span>':st==='suggested'?'<span class="chip amber">Suggested new time</span>':''}</div>
     <div class="meta"><div><span>When</span><b>${whenTxt}</b></div><div><span>Party</span><b>2 guests</b></div><div><span>Source</span><b>Date booked via ${esc(B.name)}</b></div><div><span>Perk to honor</span><b>🎁 ${esc(v.perk)}</b></div></div>
     <div class="small muted">Both guests are ID-verified, 18+. Note: “First date. Please seat us somewhere quiet.”</div>
     ${st==='pending'?`<div class="row" style="margin-top:14px"><button class="btn green" data-act="biz-confirm" data-k="${key}">✓ Confirm</button><button class="btn ghost" data-act="biz-suggest" data-k="${key}">Suggest another time</button></div>`:''}</div>`;
  };
  const sampleWhen=(()=>{const t=today();t.setDate(t.getDate()+((6-t.getDay()+7)%7)+7);return `${fmtDay(iso(t.getFullYear(),t.getMonth(),t.getDate()))} · 7:30 PM`})();
  const liveStatus=d.venueStatus==='none'?'pending':d.venueStatus;
  const exp=new Date(today()); exp.setMonth(exp.getMonth()+6);
  const liveTitle=live?`${esc(me())} &amp; ${esc(person(d.withId).name)}`:'';
  return `<div class="wrap"><div class="bizhead"><div class="row" style="gap:16px"><div style="background:${v.bg};width:64px;height:64px;border-radius:18px;display:grid;place-items:center;font-size:2rem">${v.em}</div><div><div class="eyebrow" style="margin:0">Partner dashboard</div><h2 style="font-size:2rem">${esc(v.name)}</h2></div></div>
   <div class="spacer"></div><span class="chip amber">⭐ Founding Partner</span><span class="chip">Free until ${exp.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span></div>
   <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin:14px 0"><div class="stat"><b>11</b><span class="small muted">Dates hosted this month</span></div><div class="stat"><b>${live?3:2}</b><span class="small muted">Requests this week</span></div><div class="stat"><b>94%</b><span class="small muted">Confirm rate</span></div><div class="stat"><b>38</b><span class="small muted">Perks redeemed</span></div></div>
   <div class="pick" style="margin:20px 0 50px"><div><h3>Incoming date requests</h3>
     ${live?reqCard('live',liveTitle,`${fmtDay(d.confirmed.d)} · ${fmtT(d.confirmed.t)}`,liveStatus):''}
     ${reqCard('s1','Maddie &amp; Cole',sampleWhen,state.biz.s1||'pending')}
     ${reqCard('s2','Rachel &amp; Dan','Fri · 6:30 PM (last week)','confirmed')}
     ${!live?`<p class="small muted" style="margin-top:14px">Finish the Schedule a date flow to see your own request show up here live.</p>`:''}</div>
     <div class="card"><h3 style="margin-bottom:6px">Date-night settings</h3><div class="setrow"><span>Open days for date bookings</span><span class="small muted">Wed – Sun</span></div><div class="setrow"><span>Hours</span><span class="small muted">5:00 – 9:00 PM</span></div><div class="setrow"><span>Max date bookings per night</span><span class="small muted">4</span></div><div class="setrow"><span>Date-night perk</span><span class="small muted">${esc(v.perk)}</span></div><div class="setrow"><span>Email me new requests</span><span class="switch on" data-act="sw"></span></div><div class="setrow"><span>Text me new requests</span><span class="switch on" data-act="sw"></span></div>
     <div class="small muted" style="margin-top:12px">Requests arrive by email &amp; text with Confirm / Suggest another time buttons. No app required. The monthly report shows every date you hosted.</div></div></div></div>`;
}

/* ---------- router ---------- */
function route(){ const h=(location.hash||'#/').slice(2); const [r,arg]=h.split('/'); return {r:r||'',arg}; }
const GUARD=['matches','profile','schedule','onboarding','waiting'];
function render(){
  let {r,arg}=route();
  if(GUARD.includes(r)&&!state.loggedIn){ location.hash='#/login'; return; }
  const gated=['matches','profile','schedule'].includes(r);
  if(state.loggedIn&&gated&&!regOpen(state.user.region)){ location.hash='#/waiting'; return; }
  if(r==='waiting'&&regOpen(state.user.region)&&!state.celebrate){ location.hash='#/matches'; return; }
  renderNav(r); renderFab();
  const app=$('#app'); let html='';
  if(r==='') html=pLanding();
  else if(r==='login') html=pAuth('login');
  else if(r==='signup') html=pAuth('signup');
  else if(r==='verify') html=pVerify();
  else if(r==='onboarding') html=pOnboard();
  else if(r==='matches') html=pMatches();
  else if(r==='profile') html=pProfile(arg);
  else if(r==='schedule') html=pSchedule();
  else if(r==='business') html=pBusiness();
  else if(r==='waiting') html=pWaiting();
  else html=pLanding();
  app.innerHTML=html;
  if(r==='onboarding') bindOnboard();
  if(r==='profile') bindProfile();
  if(location.hash!==render.lh){ window.scrollTo(0,0); render.lh=location.hash; }
  if(r==='verify'&&verify.step===3){ clearTimeout(render.vt); render.vt=setTimeout(()=>{verify.step=4;state.user.verified=true;save();if(route().r==='verify')render();},2200); }
}
window.addEventListener('hashchange',render);

/* ---------- modals & helpers for actions ---------- */
function partnerModal(){modal(`<h3>Become a partner</h3><p class="muted small" style="margin-bottom:6px">First 50 businesses per region are free for 6 months. Founding Partner badge, locked-in rate, monthly report.</p><form data-form="partner"><label class="f">Business name</label><input type="text" name="biz" required placeholder="Mill Street Diner"><label class="f">Type</label><select><option>Restaurant</option><option>Café / coffee</option><option>Winery / brewery</option><option>Bowling / activity</option><option>Other</option></select><label class="f">Email</label><input type="email" required placeholder="owner@yourbiz.com"><div class="row" style="margin-top:20px"><button class="btn primary" type="submit" style="flex:1">Apply for a free spot</button><button class="btn ghost" type="button" data-act="close">Cancel</button></div></form>`);}
function regionModal(id){
  const r=REGIONS.find(x=>x.id===id), short=r.name.split(' / ')[0];
  if(regOpen(id)) return modal(`<h3>${r.name}</h3><p class="muted">${r.towns}</p><div style="margin:14px 0">${regionProgress(r)}</div><p style="margin:12px 0"><b class="accent">${r.left||0} founding spots left</b> at $0.</p><div class="row"><a class="btn primary" style="flex:1" href="#/signup" data-act="close-nav" data-region="${id}">Join ${short} free</a><button class="btn ghost" data-act="close">Close</button></div>`);
  const n=regCount(r), mine=state.loggedIn&&state.user.region===id&&state.waitlist[id];
  modal(`<h3>${r.name}</h3><p class="muted">${r.towns}</p><div style="margin:16px 0"><div class="row" style="justify-content:space-between"><b>${n} of 250 verified</b><span class="small muted">${250-n} to go</span></div><div class="bar" style="margin-top:8px"><i style="width:${Math.round(n/250*100)}%"></i></div></div>
   <p class="muted small">${short} opens when 250 ID-verified locals have joined. To get in line you create a real account, verify your ID, and finish your profile. Then we'll notify you the day it opens. No spots are held for unverified sign-ups.</p>
   ${mine?`<div class="chip green" style="margin:14px 0">✓ You're in the queue</div><div class="row"><a class="btn primary" style="flex:1" href="#/waiting" data-act="close">See my queue status</a><button class="btn ghost" data-act="close">Close</button></div>`:`<div class="row" style="margin-top:18px"><a class="btn primary" style="flex:1" href="#/signup" data-act="close-nav" data-region="${id}">Create account &amp; verify</a><button class="btn ghost" data-act="close">Close</button></div>`}`);
}
function matchPopup(p){
  modal(`<div class="matchpop"><div class="eyebrow">It's a match</div><h3>You and ${p.name} both said yes 🎉</h3><div class="pair"><img src="${myPhoto()}" alt=""><img src="${photo(p.seed,0)}" alt=""></div><p class="muted">Skip the small talk. Pick a local spot and propose a few times.</p><div class="row" style="margin-top:18px;justify-content:center"><a class="btn primary lg" href="#/schedule" data-act="start-date" data-id="${p.id}">📅 Schedule a date</a><button class="btn ghost" data-act="close">Later</button></div></div>`);
}
function doLike(id){
  const p=person(id); state.swipes[id]='interested';
  if(p.likesYou){ state.matched[id]=true; save(); render(); matchPopup(p); }
  else { save(); render(); toast(`Interest sent to ${p.name}. We'll tell you if ${p.name} says yes.`); }
}
function previewModal(){
  const priv=Object.keys(LABELS).filter(k=>CHIP_ORDER.includes(k)&&visOf(k)==='priv').length;
  modal(`<h3>How others see you</h3><p class="muted small">Only answers marked 🔓 Shown appear here.</p><div class="row" style="margin:14px 0;gap:14px"><img src="${myPhoto()}" alt="" style="width:64px;height:64px;border-radius:50%;object-fit:cover"><div><b style="font-family:var(--serif);font-size:1.4rem">${esc(me())}</b><div style="margin-top:4px">${vbadge('ID Verified · 18+')}</div></div></div>
   <div class="tagrow" style="margin:0">${chipsFrom(k=>state.user[k],k=>visOf(k)==='priv').join('')}</div>
   <div class="card small muted" style="margin-top:16px">🔒 ${priv} ${priv===1?'answer is':'answers are'} private. They still help us match you, but nobody sees them.</div><div class="row" style="margin-top:16px"><button class="btn primary" style="flex:1" data-act="close">Done</button></div>`);
}
function shareModal(){
  const d=state.date, v=venuesFor(state.user.region).find(x=>x.id===d.venueId), p=person(d.withId);
  const msg=`Hi! I have a date ${fmtDayLong(d.confirmed.d)} at ${fmtT(d.confirmed.t)} at ${v.name} (${regionName(state.user.region)}) with ${p.name}, who is ID-verified on ${B.name}. Can you check in on me?`;
  modal(`<h3>🛡️ Share with a friend</h3><p class="muted small">Send your plan to someone you trust. They'll see who, where and when. It's for safety only.</p>
   <label class="f">Friend's name</label><input type="text" id="fname" placeholder="Mom, best friend…" value="Sarah"><label class="f">Phone or email</label><input type="text" id="fcontact" placeholder="(618) 555-0142" value="(618) 555-0142">
   <label class="f">Message</label><textarea rows="4" id="fmsg">${esc(msg)}</textarea>
   <label class="check"><input type="checkbox" checked><span>Text me 30 minutes after the date starts to check I'm okay.</span></label>
   <div class="row"><button class="btn primary" style="flex:1" data-act="share-send">Send plan (demo)</button><button class="btn ghost" data-act="share-copy">Copy</button></div>`);
}
function icsDownload(){
  const d=state.date, v=venuesFor(state.user.region).find(x=>x.id===d.venueId), p=person(d.withId), c=d.confirmed;
  const [y,m,dd]=c.d.split('-'), [hh,mm]=c.t.split(':'), endH=pad((+hh+1)%24);
  const ics=['BEGIN:VCALENDAR','VERSION:2.0',`PRODID:-//${B.name}//Prototype//EN`,'BEGIN:VEVENT',`UID:${d.code}@${B.name.toLowerCase()}`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,`DTSTART:${y}${m}${dd}T${hh}${mm}00`,`DTEND:${y}${m}${dd}T${endH}${mm}00`,`SUMMARY:Date with ${p.name} at ${v.name}`,`LOCATION:${v.name}\\, ${regionName(state.user.region)}`,`DESCRIPTION:Perk code ${d.code} - ${v.perk}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); a.download='date.ics'; document.body.appendChild(a); a.click(); a.remove(); toast('Added: date.ics downloaded');
}
function confirmDate(opt,from){
  const d=state.date; d.stage='confirmed'; d.confirmed={d:opt.d,t:opt.t,from}; d.venueStatus='none'; d.suggested=null;
  d.code='LT-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+(10+Math.floor(Math.random()*89));
  S={}; save(); render(); toast('Date confirmed! Reservation request sent to the venue.');
}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act],[data-scroll]');
  if(!el){ if(fabOpen&&!e.target.closest('#fab')){fabOpen=false;renderFab();} return; }
  if(el.dataset.scroll){ e.preventDefault(); const go=()=>{const s=document.querySelector(`[data-sec="${el.dataset.scroll}"]`); s&&s.scrollIntoView({behavior:'smooth'});}; if(route().r!==''){location.hash='#/';setTimeout(go,80);} else go(); return; }
  const a=el.dataset.act, D=el.dataset;
  switch(a){
   case 'fab': fabOpen=!fabOpen; renderFab(); return;
   case 'reset': fabOpen=false; resetAll(); return;
   case 'demo-login': fabOpen=false; state.user.region='carbondale'; state.loggedIn=true; state.user.verified=true; state.user.onboarded=true; save(); if(location.hash==='#/matches') render(); else location.hash='#/matches'; return;
   case 'close': closeModal(); return;
   case 'close-modal-bg': if(e.target.closest('.modal'))return; closeModal(); return;
   case 'close-nav': state.user.region=D.region; save(); closeModal(); return;
   case 'region': regionModal(D.id); return;
   case 'partner': partnerModal(); return;
   case 'id': verify.id=true; render(); return;
   case 'selfie': verify.selfie=true; render(); return;
   case 'vnext': verify.step++; render(); return;
   case 'vback': verify.step--; render(); return;
   case 'verified': state.user.verified=true; save(); return;
   case 'imp': state.user.imp=Object.assign({},state.user.imp||{}); state.user.imp[D.k]=D.v; save(); render(); return;
   case 'pick': state.user[D.k]=D.v; save(); render(); return;
   case 'obnext': if(ob.step<5){ob.step++;render();} else {state.user.onboarded=true; const rg=state.user.region; ob.step=1; if(regOpen(rg)){save();location.hash='#/matches';} else {state.waitlist[rg]=true;save();if(location.hash==='#/waiting')render();else location.hash='#/waiting';}} return;
   case 'vis': {state.user.vis=Object.assign({},state.user.vis||{}); state.user.vis[D.k]=visOf(D.k)==='priv'?'show':'priv'; save(); render(); return;}
   case 'preview': previewModal(); return;
   case 'notif': state.notify[D.k]=!state.notify[D.k]; save(); render(); return;
   case 'invite': {const t=($('.invitebox')||{}).textContent||''; if(navigator.clipboard) navigator.clipboard.writeText('https://'+t).catch(()=>{}); state.invites++; save(); render(); toast('Invite link copied'); return;}
   case 'invite-share': state.invites++; save(); render(); toast('Invite text sent (demo, no message actually sent)'); return;
   case 'sim-open': {const rg=state.user.region; state.opened=Object.assign({},state.opened); state.opened[rg]=true; state.celebrate=true; save(); render(); return;}
   case 'see-matches': state.celebrate=false; save(); return;
   case 'edit-prefs': ob.step=1; return;
   case 'demo-waiting': {fabOpen=false; Object.assign(state.user,{region:'paducah',verified:true,onboarded:true}); state.loggedIn=true; state.waitlist.paducah=true; state.celebrate=false; save(); if(location.hash==='#/waiting')render(); return;}
   case 'obback': ob.step--; render(); return;
   case 'like': e.preventDefault(); doLike(D.id); return;
   case 'pass': e.preventDefault(); state.swipes[D.id]='pass'; delete state.matched[D.id]; save(); render(); return;
   case 'undo': delete state.swipes[D.id]; save(); render(); return;
   case 'demo-yes': state.matched[D.id]=true; save(); render(); matchPopup(person(D.id)); return;
   case 'browse': e.preventDefault(); toast('Browse mode is not part of this prototype. Weekly matches come first.'); return;
   case 'car': {const t=$('#track'); t.scrollBy({left:t.clientWidth*(+D.d),behavior:'smooth'}); return;}
   case 'start-date': {closeModal(); if(state.date.withId!==D.id){state.date=Object.assign({},DEF.date,{withId:D.id}); S={};} state.matched[D.id]=true; state.view='me'; save(); return;}
   case 'view': state.view=D.v; S.countering=false; S.draft=[]; S.day=null; save(); render(); return;
   case 'restart-date': state.date=Object.assign({},DEF.date,{withId:state.date.withId}); state.view='me'; S={}; save(); render(); toast('Date reset. Start again'); return;
   case 'venue': state.date.venueId=D.id; S.draft=[]; S.day=null; save(); render(); return;
   case 'change-venue': state.date.venueId=null; S.draft=[]; S.day=null; save(); render(); return;
   case 'month': {let {y,m}=S.month; m+=+D.d; if(m<0){m=11;y--} if(m>11){m=0;y++} S.month={y,m}; S.day=null; render(); return;}
   case 'day': S.day=D.d; render(); return;
   case 'slot': {
     const i=S.draft.findIndex(o=>o.d===S.day&&o.t===D.t);
     if(i>=0) S.draft.splice(i,1);
     else if(S.draft.length>=3){ toast('You can pick up to 3. Remove one first.'); return; }
     else S.draft.push({d:S.day,t:D.t});
     S.draft.sort((a,b)=>(a.d+a.t).localeCompare(b.d+b.t)); render(); return;}
   case 'rm': S.draft.splice(+D.i,1); render(); return;
   case 'send': {
     const d=state.date, by=state.view==='me'?'me':'them';
     d.proposal={by,options:S.draft.slice(),counter:!!S.countering}; d.stage='proposed';
     S.draft=[]; S.day=null; const wasCounter=S.countering; S.countering=false; save(); render(); toast(wasCounter?'Counter sent!':'Proposal sent! Flip to Their view to respond.'); return;}
   case 'accept': {const pr=state.date.proposal; confirmDate(pr.options[+D.i], pr.counter?'counter':'proposal'); return;}
   case 'counter': S.countering=true; S.draft=[]; S.day=null; render(); return;
   case 'cancel-counter': S.countering=false; S.draft=[]; S.day=null; render(); return;
   case 'ics': icsDownload(); return;
   case 'share': shareModal(); return;
   case 'share-send': {const n=$('#fname')?$('#fname').value:'your friend'; closeModal(); toast(`Plan shared with ${n||'your friend'} (demo, no text sent)`); return;}
   case 'share-copy': if(navigator.clipboard) navigator.clipboard.writeText($('#fmsg').value).then(()=>toast('Message copied')).catch(()=>toast('Copy blocked by browser')); return;
   case 'accept-suggest': {const d=state.date; d.confirmed.t=d.suggested.t; d.venueStatus='confirmed'; d.suggested=null; save(); render(); toast('Time updated. Venue confirmed.'); return;}
   case 'reproposal': state.date.stage='none'; state.date.proposal=null; state.date.confirmed=null; state.date.venueStatus='none'; S={}; save(); render(); return;
   case 'biz-confirm': if(D.k==='live') state.date.venueStatus='confirmed'; else state.biz[D.k]='confirmed'; save(); render(); toast('Confirmed. Both guests were notified.'); return;
   case 'biz-suggest': {
     if(D.k==='live'){const v=venuesFor(state.user.region).find(x=>x.id===state.date.venueId); const s=slotsFor(v,state.date.confirmed.d).filter(x=>!x.taken&&x.t!==state.date.confirmed.t); const alt=(s.find(x=>x.t>state.date.confirmed.t)||s[0]||{t:'20:00'}).t; state.date.venueStatus='suggested'; state.date.suggested={t:alt};}
     else state.biz[D.k]='suggested';
     save(); render(); toast('Suggested a new time. Guests were notified.'); return;}
   case 'sw': el.classList.toggle('on'); return;
  }
});
document.addEventListener('change',e=>{ if(e.target.matches('[data-act-change="id"]')){ verify.id=true; render(); } });
document.addEventListener('submit',e=>{
  const f=e.target.closest('form[data-form]'); if(!f) return; e.preventDefault();
  const k=f.dataset.form, fd=new FormData(f);
  if(k==='signup'){ state.user.name=((fd.get('name')||'Alex').trim().split(' ')[0])||'Alex'; state.user.email=fd.get('email'); state.loggedIn=true; state.user.verified=false; verify={step:1,id:false,selfie:false}; ob={step:1}; save(); location.hash='#/verify'; }
  if(k==='login'){ state.loggedIn=true; state.user.verified=true; state.user.onboarded=true; save(); location.hash='#/matches'; }
  if(k==='partner'){ closeModal(); toast('Thanks! You are on the partner list (demo).'); }
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
render();
})();
