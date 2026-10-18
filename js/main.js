
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

const pages={
"index.html":"Home","about.html":"About","martial-arts.html":"Martial Arts","classes.html":"Classes",
"membership.html":"Membership","fitness.html":"Fitness","instructors.html":"Instructors","facilities.html":"Facilities",
"community.html":"Community","contact.html":"Contact","login.html":"Account"
};
function getCurrentUser(){
 try{return JSON.parse(localStorage.getItem("dobuCurrent")||"null")}catch{return null}
}
function logoutUser(){
 localStorage.removeItem("dobuCurrent");
 location.href="login.html";
}
function injectChrome(){
 const current=location.pathname.split("/").pop()||"index.html";
 const currentUser=getCurrentUser();
 const navActions=currentUser
   ? `<a class="btn btn-outline" href="dashboard.html">Dashboard</a><a class="btn btn-primary" id="nav-logout" href="#">Log out</a>`
   : `<a class="btn btn-outline" href="login.html">Account</a><a class="btn btn-primary" href="membership.html">Join Now</a>`;
 const mobileActions=currentUser
   ? `<a class="nav-mobile-only" href="contact.html">Contact</a><a class="nav-mobile-only" href="dashboard.html">Dashboard</a><a class="nav-mobile-only" id="nav-logout-mobile" href="#">Log out</a>`
   : `<a class="nav-mobile-only" href="contact.html">Contact</a><a class="nav-mobile-only" href="login.html">Account</a><a class="nav-mobile-only" href="membership.html">Join Now</a>`;
 const nav=`<header class="navbar"><div class="container nav-inner">
 <a class="logo" href="index.html"><img src="assets/logo.png" alt="DoBu Martial Arts logo"></a>
 <button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="false"><span aria-hidden="true">☰</span></button>
 <nav class="nav-links" id="primary-navigation" aria-label="Primary navigation">${Object.entries(pages).slice(0,9).map(([p,n])=>`<a href="${p}" class="${current===p?"active":""}">${n}</a>`).join("")}${mobileActions}</nav>
 <div class="nav-actions">${navActions}</div>
 </div></header>`;
 const footer=`<footer class="footer"><div class="container footer-grid">
 <div><a class="logo" href="index.html"><img src="assets/logo.png" alt="DoBu logo"></a><p class="muted" style="margin-top:16px;max-width:360px">Strength is built. Courage is trained. A modern martial arts academy for confidence, discipline and resilience.</p></div>
 <div><strong>Explore</strong><a href="martial-arts.html">Martial Arts</a><a href="classes.html">Class Timetable</a><a href="membership.html">Membership</a><a href="instructors.html">Instructors</a></div>
 <div><strong>Training</strong><a href="fitness.html">Fitness & Self-defence</a><a href="facilities.html">Facilities</a><a href="community.html">Community</a><a href="contact.html">Contact</a></div>
 <div><strong>Account</strong><a href="login.html">Login / Register</a><a href="dashboard.html">Member Dashboard</a><p class="muted" style="margin-top:15px;font-size:.82rem">Mon–Sun · Training sessions vary by timetable</p></div>
 </div><div class="container footer-bottom"><span>© 2026 DoBu Martial Arts · HND Unit 13 project</span><span>Built with accessibility, UX, SEO and QA in mind.</span></div></footer>`;
 document.body.insertAdjacentHTML("afterbegin",nav); document.body.insertAdjacentHTML("beforeend",footer);
}
function initNav(){
 const nav=$(".navbar"), toggle=$(".menu-toggle"), links=$(".nav-links");
 if(!nav||!toggle||!links)return;
 const setOpen=open=>{
   links.classList.toggle("open",open);
   toggle.setAttribute("aria-expanded",String(open));
   toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
   toggle.querySelector("span").textContent=open?"×":"☰";
   document.body.classList.toggle("nav-open",open);
 };
 toggle.addEventListener("click",()=>setOpen(!links.classList.contains("open")));
 $$(".nav-links a").forEach(a=>a.addEventListener("click",()=>setOpen(false)));
 $("#nav-logout")?.addEventListener("click",e=>{e.preventDefault();logoutUser()});
 $("#nav-logout-mobile")?.addEventListener("click",e=>{e.preventDefault();logoutUser()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&links.classList.contains("open")){setOpen(false);toggle.focus();}});
 document.addEventListener("click",e=>{if(links.classList.contains("open")&&!nav.contains(e.target))setOpen(false)});
 addEventListener("resize",()=>{if(innerWidth>1120)setOpen(false)},{passive:true});
 const onScroll=()=>nav.classList.toggle("scrolled",scrollY>30); onScroll(); addEventListener("scroll",onScroll,{passive:true});
}
function initReveal(){
 const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target)}}),{threshold:.1});
 $$(".reveal").forEach((el,i)=>{el.style.setProperty("--i",i);obs.observe(el)});
}
function toast(msg){let t=$(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.append(t)}t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}

function initTimetable(){
 const table=$("#timetable-body"), filters=$$(".filter-btn");
 if(!table||!filters.length)return;

 const fallbackData=[
   ["06:00–07:30","Jiu-jitsu","Karate","Judo","Jiu-jitsu","Muay Thai","-","-"],
   ["08:00–10:00","Muay Thai","Private tuition","Private tuition","Private tuition","Jiu-jitsu","Private tuition","Private tuition"],
   ["10:30–12:00","Private tuition","Private tuition","Private tuition","Private tuition","Private tuition","Judo","Karate"],
   ["13:00–14:30","Open mat / personal practice","Open mat / personal practice","Open mat / personal practice","Open mat / personal practice","Open mat / personal practice","Karate","Judo"],
   ["15:00–17:00","Kids jiu-jitsu","Kids judo","Kids karate","Kids jiu-jitsu","Kids judo","Muay Thai","Jiu-jitsu"],
   ["17:30–19:00","Karate","Muay Thai","Judo","Jiu-jitsu","Muay Thai","-","-"],
   ["19:00–21:00","Jiu-jitsu","Judo","Jiu-jitsu","Karate","Private tuition","-","-"]
 ];
 const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
 const descriptions={
   "jiu-jitsu":"Technical grappling focused on control, leverage, escapes, positional work and practical movement.",
   "karate":"Structured striking practice developing precision, timing, footwork, balance and disciplined technique.",
   "judo":"Dynamic throws and grappling built around balance, timing, grip control and safe movement.",
   "muay thai":"Striking and conditioning using punches, kicks, knees, footwork and controlled partner drills.",
   "private tuition":"Focused coaching tailored to an individual goal, technical area or training plan.",
   "open mat / personal practice":"Flexible practice time for drilling techniques, reviewing skills and developing movement.",
   "kids":"Age-appropriate martial arts practice designed to build coordination, confidence, discipline and movement skills."
 };
 const norm=s=>String(s).toLowerCase().replace(/[^a-z]/g,"");
 function match(value,filter){
   const v=String(value).toLowerCase();
   if(filter==="all")return value!=="-";
   if(filter==="kids")return v.startsWith("kids");
   if(filter==="private")return v.includes("private");
   if(filter==="open")return v.includes("open mat");
   return norm(value).includes(norm(filter));
 }
 function descriptionFor(value){
   const v=String(value).toLowerCase();
   if(v.startsWith("kids"))return descriptions.kids;
   const key=Object.keys(descriptions).find(k=>v.includes(k));
   return descriptions[key]||"A scheduled DoBu training session. Ask a coach for more detail about the class.";
 }
 function showSession(value,day,time){
   const title=$("#session-detail-title"),copy=$("#session-detail-copy"),meta=$("#session-detail-meta");
   if(!title||!copy||!meta)return;
   title.textContent=value;
   copy.textContent=descriptionFor(value);
   meta.textContent=`${day} · ${time}`;
 }
 function render(data,filter="all"){
   table.innerHTML=data.map(row=>{
     const cells=row.slice(1).map((v,i)=>({value:v,day:days[i]}));
     const visible=cells.map(item=>match(item.value,filter)?item.value:"—");
     const any=visible.some(v=>v!=="—");
     if(filter!=="all"&&!any)return "";
     return `<tr><td>${row[0]}</td>${visible.map((v,i)=>`<td class="class-cell ${v!=="—"?"active":""}" data-class="${v!=="—"?v.replace(/"/g,'&quot;'):''}" data-day="${days[i]}" data-time="${row[0]}">${v}</td>`).join("")}</tr>`;
   }).join("");
   const shown=table.querySelectorAll("tr").length;
   const status=$("#filter-status");
   if(status){
     const label=filter==="all"?"all scheduled sessions":filter==="kids"?"Kids classes":filter==="private"?"Private tuition":filter==="open"?"Open mat / personal practice":`${filter} sessions`;
     status.textContent=`Showing ${label} · ${shown} time slots`;
   }
   $$(".class-cell.active",table).forEach(cell=>cell.addEventListener("click",()=>showSession(cell.dataset.class,cell.dataset.day,cell.dataset.time)));
 }
 function useData(data){
   if(!Array.isArray(data)||!data.length){data=fallbackData;}
   let current="all";
   filters.forEach(btn=>btn.addEventListener("click",()=>{
     current=btn.dataset.filter||"all";
     filters.forEach(b=>b.classList.remove("active"));
     btn.classList.add("active");
     render(data,current);
   }));
   render(data,current);
   $$("[data-focus-filter]").forEach(link=>link.addEventListener("click",()=>{
     const target=link.dataset.focusFilter;
     const btn=filters.find(b=>b.dataset.filter===target);
     if(btn){btn.click();}
   }));
 }
 if(location.protocol!=="file:"){
   fetch("data/timetable.json",{cache:"no-store"})
     .then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json()})
     .then(useData)
     .catch(error=>{console.warn("Using local timetable fallback:",error);useData(fallbackData);});
 }else{
   useData(fallbackData);
 }
}
function initAuth(){
 const form=$("#auth-form"); if(!form)return;
 const tabLogin=$("#tab-login"),tabRegister=$("#tab-register"),title=$("#auth-title"),sub=$("#auth-sub"),submit=$("#auth-submit"),nameField=$("#name-field");
 let mode="login";
 function setMode(m){mode=m;const reg=m==="register";tabLogin?.classList.toggle("active",!reg);tabRegister?.classList.toggle("active",reg);if(nameField) nameField.style.display=reg?"grid":"none";title.textContent=reg?"Create your account":"Welcome back";sub.textContent=reg?"Create a member profile to manage your training.":"Log in to manage your membership and classes.";submit.textContent=reg?"Create account":"Log in";}
 tabLogin?.addEventListener("click",()=>setMode("login"));tabRegister?.addEventListener("click",()=>setMode("register"));
 form.addEventListener("submit",e=>{
   e.preventDefault();const email=$("#email").value.trim().toLowerCase(),pass=$("#password").value,name=$("#name")?.value.trim();
   if(!email||!pass||(mode==="register"&&!name)){showFormMsg("Please complete all required fields.","error");return}
   const users=JSON.parse(localStorage.getItem("dobuUsers")||"[]");
   if(mode==="register"){
     if(users.some(u=>u.email===email)){showFormMsg("An account with this email already exists.","error");return}
     const user={name,email,password:pass,plan:"Not selected",created:new Date().toISOString()};users.push(user);localStorage.setItem("dobuUsers",JSON.stringify(users));localStorage.setItem("dobuCurrent",JSON.stringify(user));location.href="dashboard.html";
   }else{
     const user=users.find(u=>u.email===email&&u.password===pass);
     if(!user){showFormMsg("Invalid email or password. Try the account you created in this browser.","error");return}
     localStorage.setItem("dobuCurrent",JSON.stringify(user));location.href="dashboard.html";
   }
 });
}
function showFormMsg(msg,type){const el=$("#form-msg");if(!el)return;el.textContent=msg;el.className=`form-msg show ${type}`}

function initDashboard(){
 const box=$("#dashboard");if(!box)return;
 const user=getCurrentUser();
 if(!user){box.innerHTML=`<div class="card" style="text-align:center"><h2>Member access required</h2><p class="muted" style="margin:15px 0">Create an account or log in to view your member dashboard.</p><a class="btn btn-primary" href="login.html">Go to account</a></div>`;return}
 $("#member-name")&&( $("#member-name").textContent=user.name);
 $("#member-email")&&( $("#member-email").textContent=user.email);
 $("#member-plan")&&( $("#member-plan").textContent=user.plan||"Not selected");
 $("#logout")?.addEventListener("click",e=>{e.preventDefault();logoutUser()});
 const overviewLink=$("#dashboard-overview-link");
 const overview=$("#dashboard-overview");
 overviewLink?.addEventListener("click",e=>{
   e.preventDefault();
   overviewLink.classList.add("active");
   overview?.scrollIntoView({behavior:"smooth",block:"start"});
   history.replaceState(null,"",overviewLink.getAttribute("href"));
 });
}
function initJoinButtons(){
 $$(".join-plan").forEach(btn=>btn.addEventListener("click",()=>{
   const user=JSON.parse(localStorage.getItem("dobuCurrent")||"null");
   if(!user){toast("Create an account first to choose a membership.");location.href="login.html";return}
   const users=JSON.parse(localStorage.getItem("dobuUsers")||"[]"),plan=btn.dataset.plan;
   user.plan=plan;localStorage.setItem("dobuCurrent",JSON.stringify(user));localStorage.setItem("dobuUsers",JSON.stringify(users.map(u=>u.email===user.email?user:u)));
   toast(`${plan} membership selected.`);setTimeout(()=>location.href="dashboard.html",700);
 }))
}
document.addEventListener("DOMContentLoaded",()=>{injectChrome();initNav();initReveal();initTimetable();initAuth();initDashboard();initJoinButtons();initMartialArts();});

function initMartialArts(){
 const modal=$("#martial-modal");
 const cards=$$(".martial-card");
 if(!modal||!cards.length)return;
 const details={
  jiujitsu:{
   title:"Jiu-jitsu", image:"assets/jiujitsucls.jpg", intro:"A technical grappling discipline built around control, leverage, escapes and positional strategy. Instead of relying only on strength, students learn to solve movement problems through timing and technique.",
   learn:"Guard work, positional control, escapes, submissions, transitions and practical grappling movement.",
   benefits:"Patience, composure, body awareness, problem-solving and confidence under pressure.",
   focus:"Ground control, leverage, efficient movement and repeatable technique with a strong emphasis on technical development.",
   suits:"Beginners, experienced martial artists and anyone who enjoys technical, close-range training and progressive skill development."
  },
  karate:{
   title:"Karate", image:"assets/Karatecls.jpg", intro:"A disciplined striking art focused on precision, timing, movement and controlled technique. Training develops accuracy while building confidence, coordination and self-discipline.",
   learn:"Fundamental stances, punches, kicks, blocks, combinations, distance control and structured practice.",
   benefits:"Coordination, discipline, balance, confidence, speed and precise movement.",
   focus:"Clean technique, controlled striking, footwork, timing and repeatable combinations.",
   suits:"Students who want structured striking practice, technical progression and a strong foundation in martial arts fundamentals."
  },
  judo:{
   title:"Judo", image:"assets/Judocls.jpg", intro:"A throwing and grappling discipline that teaches students to use balance, timing and position efficiently. Judo turns movement and momentum into controlled technique.",
   learn:"Grip fighting, breakfalls, throws, balance disruption, transitions and controlled grappling sequences.",
   benefits:"Balance, coordination, timing, confidence, physical control and efficient use of movement.",
   focus:"Throws, grip control, kuzushi-style balance breaking, safe falling and controlled partner practice.",
   suits:"Beginners and experienced students who enjoy dynamic grappling, throws and learning how timing can overcome raw force."
  },
  muaythai:{
   title:"Muay Thai", image:"assets/muaythaicls.jpg", intro:"A demanding striking system that combines punches, kicks, knees and elbows with conditioning and resilient movement. Sessions develop both physical fitness and mental toughness.",
   learn:"Fundamental striking combinations, kicks, defensive movement, pad work, footwork, conditioning and controlled partner drills.",
   benefits:"Cardiovascular fitness, strength, coordination, resilience, confidence and practical striking skills.",
   focus:"Striking technique, conditioning, combinations, distance management and disciplined repetition.",
   suits:"Students looking for energetic striking sessions, fitness development and progressive combat-sport training."
  }
 };
 const title=$("#martial-modal-title"),intro=$("#martial-modal-intro"),learn=$("#martial-modal-learn"),benefits=$("#martial-modal-benefits"),focus=$("#martial-modal-focus"),suits=$("#martial-modal-suits"),image=$("#martial-modal-image"),eyebrow=$("#martial-modal-eyebrow");
 function open(key){
  const d=details[key]; if(!d)return;
  title.textContent=d.title; eyebrow.textContent=`${d.title} discipline`; intro.textContent=d.intro; learn.textContent=d.learn; benefits.textContent=d.benefits; focus.textContent=d.focus; suits.textContent=d.suits;
  image.src=d.image; image.alt=`${d.title} training`;
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("modal-open"); $(".modal-close")?.focus();
 }
 function close(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")}
 cards.forEach(card=>card.addEventListener("click",()=>open(card.dataset.discipline)));
 $$('[data-close-modal]',modal).forEach(el=>el.addEventListener("click",close));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))close()});
}


function initFitnessPage(){
  const cards=$$(".goal-card"), result=$("#goal-result"), title=$("#goal-result-title"), copy=$("#goal-result-copy"), link=$("#goal-result-link");
  if(!cards.length||!result)return;
  const goals={
    stronger:["Strength & power","Build functional strength and explosive movement. Pair strength work with martial-arts classes for practical performance.","classes.html"],
    fitness:["Conditioning & endurance","Focus on stamina, cardio capacity and movement quality. Conditioning and Muay Thai are strong choices.","classes.html"],
    defence:["Self-defence training","Start with awareness, movement, positioning and controlled responses. Build confidence progressively.","#self-defence"],
    confidence:["Confidence & discipline","Choose a consistent martial-arts routine and combine technical practice with conditioning. Progress comes step by step.","martial-arts.html"]
  };
  cards.forEach(card=>card.addEventListener("click",()=>{
    const d=goals[card.dataset.goal]; if(!d)return;
    cards.forEach(c=>c.classList.remove("active")); card.classList.add("active");
    title.textContent=d[0]; copy.textContent=d[1]; link.href=d[2]; link.innerHTML='Explore this direction <span>→</span>';
    result.classList.add("show");
  }));
}
document.addEventListener("DOMContentLoaded",initFitnessPage);


function initMartialArtsFinder(){
  const cards=$$('[data-martial-goal]'),result=$('#martial-goal-result'),title=$('#martial-goal-title'),copy=$('#martial-goal-copy'),link=$('#martial-goal-link'),label=$('#martial-goal-label');
  if(!cards.length||!result)return;
  const recommendations={
    technique:['Best match','Jiu-jitsu + Judo','Great choices if you enjoy technical problem-solving, control, balance and learning how movement creates an advantage.'],
    striking:['Best match','Karate + Muay Thai','Choose these if you want striking technique, timing, combinations, footwork and controlled partner work.'],
    fitness:['Best match','Muay Thai','A strong choice for energetic sessions combining striking practice, conditioning, movement and resilience.'],
    defence:['Good starting point','Jiu-jitsu + Karate','Start by building awareness, positioning, movement, control and disciplined responses through structured practice.']
  };
  cards.forEach(card=>card.addEventListener('click',()=>{
    const d=recommendations[card.dataset.martialGoal]; if(!d)return;
    cards.forEach(c=>c.classList.remove('active')); card.classList.add('active');
    label.textContent=d[0]; title.textContent=d[1]; copy.textContent=d[2]; link.href='#disciplines'; result.classList.add('show');
    setTimeout(()=>result.scrollIntoView({behavior:'smooth',block:'nearest'}),30);
  }));
}
document.addEventListener('DOMContentLoaded',initMartialArtsFinder);


/* =========================================================
   INSTRUCTORS PAGE INTERACTIONS
   ========================================================= */
function initInstructorsPage(){
  const cards=$$(".instructor-card");
  const filters=$$(".instructor-filter");
  const modal=$("#instructor-modal");
  if(!cards.length)return;

  const profiles={
    "mauricio-gomez":{
      name:"Mauricio Gomez",
      role:"Owner · Head Coach",
      image:"assets/Instructors/Mauricio gomez.png",
      intro:"Leads the DoBu coaching team and coaches across the academy's martial arts disciplines.",
      credentials:"4th Dan Judo · 3rd Dan Jiu-jitsu · 1st Dan Karate · Accredited Muay Thai coach",
      focus:"Judo · Jiu-jitsu · Karate · Muay Thai",
      coaching:"All martial arts"
    },
    "sarah-nova":{
      name:"Sarah Nova",
      role:"Assistant Coach",
      image:"assets/Instructors/Sarah Nova.png",
      intro:"An assistant coach specialising in disciplined karate practice and technical progression.",
      credentials:"5th Dan Karate",
      focus:"Karate",
      coaching:"Karate"
    },
    "guy-victory":{
      name:"Guy Victory",
      role:"Assistant Coach",
      image:"assets/Instructors/Guy Victory.png",
      intro:"An assistant coach with a grappling-focused background across Jiu-jitsu and Judo.",
      credentials:"2nd Dan Jiu-jitsu · 1st Dan Judo",
      focus:"Jiu-jitsu · Judo",
      coaching:"Jiu-jitsu · Judo"
    },
    "morris-davis":{
      name:"Morris Davis",
      role:"Assistant Coach",
      image:"assets/Instructors/Morris Davis.png",
      intro:"An assistant coach combining Muay Thai coaching with advanced Karate training.",
      credentials:"Accredited Muay Thai coach · 3rd Dan Karate",
      focus:"Muay Thai · Karate",
      coaching:"Muay Thai · Karate"
    },
    "traci-santiago":{
      name:"Traci Santiago",
      role:"Fitness Coach",
      image:"assets/Instructors/Traci Santiago.png",
      intro:"A fitness coach focused on strength and conditioning for combat athletes, supported by sports science and health and nutrition training.",
      credentials:"BSc Sports Science · Qualified in health and nutrition · Strength & conditioning for combat athletes",
      focus:"Strength & conditioning · Combat athlete fitness",
      coaching:"Fitness"
    },
    "harpreet-kaur":{
      name:"Harpreet Kaur",
      role:"Fitness Coach",
      image:"assets/Instructors/Harpreet Kaur.png",
      intro:"A fitness coach bringing physiotherapy and sports science knowledge to training.",
      credentials:"BSc Physiotherapy · MSc Sports Science",
      focus:"Fitness · Sports science · Physiotherapy-informed training",
      coaching:"Fitness"
    }
  };

  const modalName=$("#instructor-modal-name");
  const modalRole=$("#instructor-modal-role");
  const modalIntro=$("#instructor-modal-intro");
  const modalCredentials=$("#instructor-modal-credentials");
  const modalFocus=$("#instructor-modal-focus");
  const modalCoaching=$("#instructor-modal-coaching");
  const modalImage=$("#instructor-modal-image");

  function openProfile(key){
    const d=profiles[key];
    if(!d||!modal)return;
    modalName.textContent=d.name;
    modalRole.textContent=d.role;
    modalIntro.textContent=d.intro;
    modalCredentials.textContent=d.credentials;
    modalFocus.textContent=d.focus;
    modalCoaching.textContent=d.coaching;
    modalImage.src=d.image;
    modalImage.alt=`${d.name} — DoBu Martial Arts coach`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("instructor-modal-open");
    $("#instructor-modal-close")?.focus();
  }

  function closeProfile(){
    if(!modal)return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("instructor-modal-open");
  }

  cards.forEach(card=>{
    card.addEventListener("click",()=>openProfile(card.dataset.instructor));
    card.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){
        e.preventDefault();
        openProfile(card.dataset.instructor);
      }
    });
  });

  $$("[data-close-instructor-modal]",modal).forEach(el=>el.addEventListener("click",closeProfile));
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&modal?.classList.contains("open"))closeProfile();
  });

  filters.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const filter=btn.dataset.filter||"all";
      filters.forEach(b=>b.classList.toggle("active",b===btn));
      cards.forEach(card=>{
        const tags=(card.dataset.tags||"").split(" ");
        const show=filter==="all"||tags.includes(filter);
        card.classList.toggle("hidden",!show);
      });
      const status=$("#instructor-filter-status");
      if(status){
        const labels={all:"All coaches",martial:"Martial arts coaches",fitness:"Fitness coaches",striking:"Striking specialists",grappling:"Grappling specialists"};
        status.textContent=labels[filter]||"All coaches";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded",initInstructorsPage);

/* =========================================================
   MEMBERSHIP PAGE INTERACTIONS
   ========================================================= */
function initMembershipPage(){
  const cards=$$('[data-membership-goal]');
  const result=$('#membership-goal-result');
  const label=$('#membership-goal-label');
  const title=$('#membership-goal-title');
  const copy=$('#membership-goal-copy');
  const link=$('#membership-goal-link');
  if(!cards.length||!result)return;

  const recommendations={
    fitness:{label:'Recommended for fitness',title:'Intermediate',copy:'Three sessions per week gives you a stronger routine for building fitness while continuing martial arts development.',link:'#plans'},
    martial:{label:'Recommended for learning',title:'Basic',copy:'A simple two-session routine is a strong starting point for building technique, confidence and consistency.',link:'#plans'},
    defence:{label:'Recommended for self-defence',title:'Intermediate',copy:'A consistent three-session schedule gives you more time to develop movement, control, awareness and confidence.',link:'#plans'},
    performance:{label:'Recommended for performance',title:'Advanced',copy:'Five sessions per week and access to any two martial arts make Advanced a strong choice for higher-volume training.',link:'#plans'}
  };

  cards.forEach(card=>card.addEventListener('click',()=>{
    const d=recommendations[card.dataset.membershipGoal];
    if(!d)return;
    cards.forEach(c=>c.classList.toggle('active',c===card));
    label.textContent=d.label;
    title.textContent=d.title;
    copy.textContent=d.copy;
    link.href=d.link;
    result.classList.add('show');
    setTimeout(()=>result.scrollIntoView({behavior:'smooth',block:'nearest'}),30);
  }));
}

document.addEventListener('DOMContentLoaded',initMembershipPage);


/* =========================================================
   COMMUNITY PAGE INTERACTIONS
   ========================================================= */
function initCommunityPage(){
  const counters=$$(".community-counter");
  if(counters.length){
    const animateCounter=(el)=>{
      const target=Number(el.dataset.count||0), suffix=el.dataset.suffix||"";
      const start=performance.now(), duration=1100;
      const tick=(now)=>{
        const progress=Math.min((now-start)/duration,1);
        const eased=1-Math.pow(1-progress,3);
        el.textContent=`${Math.round(target*eased)}${suffix}`;
        if(progress<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const counterObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },{threshold:.35});
    counters.forEach(el=>counterObserver.observe(el));
  }

  $$(".event-action").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const event=btn.dataset.event||"this event";
      toast(`You're interested in ${event}. Ask the DoBu team to confirm your place.`);
      btn.textContent="Interest noted ✓";
      btn.disabled=true;
      btn.style.opacity=".8";
    });
  });

  const challengeBtn=$("#challenge-join"), challengeStatus=$("#challenge-status");
  const challengeFill=$("#challenge-progress-fill"), challengeCount=$("#challenge-count");
  if(challengeBtn&&challengeStatus&&challengeFill&&challengeCount){
    challengeBtn.addEventListener("click",()=>{
      challengeBtn.textContent="Challenge joined ✓";
      challengeBtn.disabled=true;
      challengeFill.style.width="83.33%";
      challengeCount.textContent="25 / 30 days";
      challengeStatus.textContent="You're in · 25 / 30 community days completed";
      toast("Challenge joined. Keep your streak going!");
    });
  }

  const goals={
    fitness:["Community path · Fitness","Conditioning sessions and Muay Thai are a great way to build energy, stamina and movement while meeting regular training partners.","classes.html"],
    martial:["Community path · Martial arts","Start with a regular martial-arts class, then use open mats to practise skills and connect with people at your level.","martial-arts.html"],
    people:["Community path · Community","Try an open mat or community event first. It’s an easy way to meet training partners without needing to be an expert.","community.html"],
    confidence:["Community path · Confidence","Choose a consistent class schedule and celebrate small wins. The community gives you a place to keep showing up.","membership.html"]
  };
  const goalCards=$$(".community-goal-card"), result=$("#community-goal-result");
  const label=$("#community-goal-label"), title=$("#community-goal-title"), copy=$("#community-goal-copy"), link=$("#community-goal-link");
  if(goalCards.length&&result){
    goalCards.forEach(card=>card.addEventListener("click",()=>{
      const d=goals[card.dataset.communityGoal];
      if(!d)return;
      goalCards.forEach(c=>c.classList.toggle("active",c===card));
      label.textContent=d[0];
      title.textContent=d[0].replace("Community path · ","");
      copy.textContent=d[1];
      link.href=d[2];
      link.innerHTML=`Explore your direction <span>→</span>`;
      result.classList.add("show");
      setTimeout(()=>result.scrollIntoView({behavior:"smooth",block:"nearest"}),30);
    }));
  }
}
document.addEventListener("DOMContentLoaded",initCommunityPage);


/* Community event buttons + user community post */
function initCommunityPage(){
  const eventButtons = $$(".event-action");
  const activeLabels = {
    "Community Open Mat":"SPOT RESERVED",
    "Self-Defence Workshop":"WORKSHOP JOINED",
    "Training & Social Night":"PLACE SAVED"
  };
  const defaultLabels = {
    "Community Open Mat":"RESERVE SPOT",
    "Self-Defence Workshop":"JOIN WORKSHOP",
    "Training & Social Night":"SAVE MY PLACE"
  };

  eventButtons.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const active = btn.classList.toggle("active");
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      const eventName = btn.dataset.event || "Event";
      const label = active ? (activeLabels[eventName] || "SAVED") : (defaultLabels[eventName] || "SAVE");
      if(btn.childNodes[0]) btn.childNodes[0].textContent = label + " ";
      const arrow = btn.querySelector("span");
      if(arrow) arrow.textContent = active ? "✓" : "→";
      toast(active ? `${label}: ${eventName}.` : `Selection removed: ${eventName}.`);
    });
  });

  const form = $("#community-post-form");
  const input = $("#community-post-input");
  const counter = $("#community-post-counter");
  const msg = $("#community-post-msg");
  const quote = $("#community-spotlight-quote");
  const meta = $("#community-spotlight-meta");
  if(!form || !input || !quote) return;

  function showPost(text){
    quote.textContent = `“${text}”`;
    quote.classList.add("user-post");
    if(meta){
      meta.innerHTML = "<strong>Your community post</strong><span>Shared from this browser</span>";
      meta.classList.add("user-post-meta");
    }
  }

  const stored = localStorage.getItem("dobuCommunityPost");
  if(stored){
    showPost(stored);
    input.value = stored;
    if(counter) counter.textContent = `${stored.length} / 180`;
  }

  input.addEventListener("input",()=>{
    if(counter) counter.textContent = `${input.value.length} / 180`;
  });

  form.addEventListener("submit",e=>{
    e.preventDefault();
    const text = input.value.trim();
    if(!text){
      if(msg){msg.textContent="Write a message first.";msg.className="community-post-msg error";}
      input.focus();
      return;
    }
    localStorage.setItem("dobuCommunityPost", text);
    showPost(text);
    if(msg){
      msg.textContent="Posted — your message is now shown in “Progress is the point.”";
      msg.className="community-post-msg success";
    }
    toast("Your community message has been posted.");
  });
}
document.addEventListener("DOMContentLoaded",initCommunityPage);
