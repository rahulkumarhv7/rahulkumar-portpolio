const make=(tag,className,text)=>{const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;};
const safeURL=value=>{try{const url=new URL(value,location.origin);return["http:","https:"].includes(url.protocol)?url.href:null;}catch{return null;}};
const externalLink=(label,url,className="")=>{const target=safeURL(url);if(!target)return null;const link=make("a",className,label);link.href=target;link.target="_blank";link.rel="noopener noreferrer";return link;};
function addFilters(host,categories,onSelect){host.replaceChildren();["All",...new Set(categories)].forEach((name,index)=>{const button=make("button","filter-button",name);button.type="button";button.setAttribute("aria-pressed",String(index===0));button.addEventListener("click",()=>{host.querySelectorAll("button").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));onSelect(name);});host.append(button);});}
function tags(items){const host=make("div","tags");(items||[]).forEach(item=>host.append(make("span","",item)));return host;}
function renderSkills(groups,ratings={}){
  const host=document.getElementById("skill-list");
  const frontend=new Set(["HTML5","CSS3","JavaScript","TypeScript","React.js","React / Node.js"]);
  const icons={
    "HTML5":["🧱","peach"],"CSS3":["🎨","blue"],"JavaScript":["✨","yellow"],
    "React.js":["⚛️","cyan"],"TypeScript":["🔷","blue"],"Java":["☕","peach"],
    "Python":["🐍","yellow"],"Spring Boot":["🌱","green"],"Hibernate":["🛠️","purple"],
    "JDBC":["🔌","purple"],"JSP":["📄","pink"],"Node.js":["💚","green"],
    "REST APIs":["🔗","blue"],"SQL":["🗃️","purple"],"PostgreSQL":["🐘","blue"],
    "Redis":["⚡","pink"],"Apache Kafka":["🔀","purple"],"RabbitMQ":["🐇","yellow"],
    "Redis Streams":["🌊","cyan"],"Git":["🌿","green"],"GitHub":["🐙","pink"],
    "Docker":["🐳","cyan"],"Docker Compose":["📦","blue"],"Docker / Docker Compose":["🐳","cyan"],
    "React / Node.js":["⚛️","cyan"],"MySQL / PostgreSQL":["🗃️","purple"],
    "Git / GitHub":["🐙","pink"]
  };
  const categories=["Frontend","Backend","Tools & Platforms"];
  const frontendOrder=["HTML5","CSS3","JavaScript","React.js","React / Node.js","TypeScript"];
  const skills=groups.flatMap(group=>group.items.map(name=>({
    name,group:group.name,
    category:frontend.has(name)?"Frontend":group.name==="Tools & Platforms"?"Tools & Platforms":"Backend"
  }))).sort((a,b)=>categories.indexOf(a.category)-categories.indexOf(b.category)||(a.category==="Frontend"?frontendOrder.indexOf(a.name)-frontendOrder.indexOf(b.name):0));
  const ratingFor=name=>{
    const rating=ratings[name];
    const percent=typeof rating==="number"?rating:rating?.percent;
    return typeof percent==="number"&&Number.isFinite(percent)&&percent>=0&&percent<=100
      ?{percent,level:typeof rating?.level==="string"?rating.level:""}:null;
  };
  document.getElementById("skill-rating-note").hidden=!skills.some(skill=>ratingFor(skill.name));
  const orderedSkills=[...skills].sort((a,b)=>Number(Boolean(ratingFor(b.name)))-Number(Boolean(ratingFor(a.name))));
  const show=category=>{
    host.replaceChildren();
    orderedSkills.filter(skill=>category==="All"||skill.category===category||(skill.name==="React / Node.js"&&category==="Backend")).forEach(skill=>{
      const card=make("article","skill-card");
      const [symbol,tone]=icons[skill.name]||["✦","purple"];
      const icon=make("span","skill-symbol tone-"+tone,symbol);
      icon.setAttribute("aria-hidden","true");
      const title=make("h3","",skill.name==="Java"?"Core & Advanced Java":skill.name);
      const rating=ratingFor(skill.name);
      card.append(icon,title);
      if(rating){
        const meter=make("div","skill-meter"),fill=make("span","skill-meter-fill");
        meter.setAttribute("role","progressbar");
        meter.setAttribute("aria-label",skill.name+" self-assessed proficiency");
        meter.setAttribute("aria-valuemin","0");meter.setAttribute("aria-valuemax","100");
        meter.setAttribute("aria-valuenow",String(rating.percent));
        fill.style.width=rating.percent+"%";meter.append(fill);
        const meta=make("div","skill-meta");
        meta.append(make("span","skill-level",rating.level||skill.group),make("b","skill-percent",rating.percent+"%"));
        card.append(meter,meta);
      }else{
        card.append(make("p","skill-context",skill.group));
      }
      host.append(card);
    });
  };
  addFilters(document.getElementById("skill-filters"),categories,show);show("All");
}

function renderProjects(projects){
  const host=document.getElementById("project-list");
  const categoryLabel=category=>category==="Web Application"?"Web App":category;
  const show=category=>{
    host.replaceChildren();
    projects.filter(project=>category==="All"||categoryLabel(project.category)===category).forEach(project=>{
      const card=make("article","project-card");
      const template=document.getElementById(project.art+"-art");
      if(template)card.append(template.content.cloneNode(true));
      const body=make("div","project-body");
      body.append(tags(project.tags),make("h3","",project.title),make("p","project-description",project.description));
      card.append(body);host.append(card);
    });
  };
  addFilters(document.getElementById("project-filters"),projects.map(project=>categoryLabel(project.category)),show);
  show("All");
}
function renderExperience(entries){
  const host=document.getElementById("experience-list");
  const markers=["🚀","☕","💻"];
  host.replaceChildren();
  entries.forEach((entry,index)=>{
    const card=make("li","timeline-item"+(entry.current?" is-current":""));
    const marker=make("span","timeline-marker",markers[index]||"💼");
    const head=make("div","timeline-head");
    marker.setAttribute("aria-hidden","true");
    head.append(make("h3","",entry.title),make("span","timeline-date",entry.date));
    const company=make("p","timeline-company",entry.company+" · "+entry.location);
    if(entry.current)company.append(make("span","current-badge","Current"));
    const description=make("p","timeline-description",entry.bullets.join(" "));
    card.append(marker,head,company,description,tags(entry.tags));
    host.append(card);
  });
}
function renderProfile(profile){
  const name=profile.name?.trim()||"Developer Portfolio";
  document.querySelectorAll("[data-name]").forEach(element=>element.textContent=name);
  document.title=(profile.name?profile.name+" — ":"")+(profile.role||"Full-Stack Developer");
  document.getElementById("hero-summary").textContent=profile.summary;
  document.getElementById("about-summary").textContent=profile.about;
  document.getElementById("about-approach").textContent=profile.approach;
  document.getElementById("about-interests").textContent=profile.aboutInterests;
  if(profile.location)document.getElementById("about-location").textContent="Based in "+profile.location;
  const stats=document.getElementById("stats-list");stats.replaceChildren();profile.stats.forEach(stat=>{const item=make("div","stat");item.append(make("b","stat-value",stat.value),make("span","stat-label",stat.label));stats.append(item);});
  renderSkills(profile.skills,profile.skillRatings||{});renderProjects(profile.projects);renderExperience(profile.experience);
  const email=profile.email?.trim(),emailLink=document.getElementById("contact-email");
  const validEmail=email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(validEmail){
    emailLink.href="mailto:"+email;
    emailLink.querySelector(".contact-card-value").textContent=email;
    emailLink.hidden=false;
    document.getElementById("contact-form").dataset.recipient=email;
    document.getElementById("contact-form").action="mailto:"+email;
    document.getElementById("header-cta").href="#contact";
    document.getElementById("header-cta").textContent="HIRE ME";
  }else{emailLink.hidden=true;document.getElementById("contact-form").hidden=true;}
  const socialHost=document.getElementById("social-list");socialHost.replaceChildren();
  [...(profile.social||[])].sort((a,b)=>Number(/linkedin/i.test(b.label))-Number(/linkedin/i.test(a.label))).forEach(social=>{
    const link=externalLink("",social.url,"contact-card");
    if(!link)return;
    const icon=make("span","contact-card-icon",/linkedin/i.test(social.label)?"💼":/github/i.test(social.label)?"🐙":"↗");
    icon.setAttribute("aria-hidden","true");
    const copy=make("span","contact-card-copy");
    const url=new URL(link.href);
    copy.append(make("span","contact-card-label",social.label),make("strong","contact-card-value",url.hostname.replace(/^www\./,"")+url.pathname.replace(/\/$/,"")));
    const arrow=make("span","contact-card-arrow","→");arrow.setAttribute("aria-hidden","true");
    link.append(icon,copy,arrow);socialHost.append(link);
    if(/github/i.test(social.label)){
      const all=document.getElementById("all-projects-link");
      all.href=link.href;all.target="_blank";all.rel="noopener noreferrer";all.hidden=false;
    }
  });

  if(!validEmail&&!(profile.social||[]).length){document.getElementById("contact").hidden=true;document.querySelectorAll("[data-contact-link]").forEach(link=>link.hidden=true);}
  scheduleNavigationUpdate();
}
fetch("/profile.json",{cache:"no-store"}).then(response=>{if(!response.ok)throw new Error("Profile could not be loaded");return response.json();}).then(renderProfile).catch(error=>{console.error(error);document.querySelectorAll("[data-contact-link]").forEach(link=>link.hidden=true);document.getElementById("contact").hidden=true;});
const menu=document.querySelector(".menu-toggle"),nav=document.getElementById("primary-nav");
function closeMenu(){menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open navigation");nav.classList.remove("is-open");}
menu.addEventListener("click",()=>{const isOpen=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!isOpen));menu.setAttribute("aria-label",isOpen?"Open navigation":"Close navigation");nav.classList.toggle("is-open",!isOpen);});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&menu.getAttribute("aria-expanded")==="true"){closeMenu();menu.focus();}});
matchMedia("(min-width:761px)").addEventListener("change",event=>{if(event.matches)closeMenu();});

const contactForm=document.getElementById("contact-form");
contactForm.addEventListener("submit",event=>{
  event.preventDefault();
  if(!contactForm.reportValidity())return;
  const data=new FormData(contactForm);
  const name=String(data.get("name")||"").trim();
  const email=String(data.get("email")||"").trim();
  const subject=String(data.get("subject")||"").trim();
  const message=String(data.get("message")||"").trim();
  if(!name||!subject||!message){
    const status=document.getElementById("contact-form-status");
    status.textContent="Please enter your name, subject, and message.";status.hidden=false;return;
  }
  const recipient=contactForm.dataset.recipient;
  if(!recipient||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient))return;
  const body="Name: "+name+"\nEmail: "+email+"\n\n"+message;
  const draft="mailto:"+recipient+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
  const status=document.getElementById("contact-form-status");
  status.textContent="Your email app should open with a draft. Send it there, or contact "+recipient+" directly.";
  status.hidden=false;
  window.location.href=draft;
});



// Keep the navigation aligned with the section currently being read.
const sectionNavigation=[...nav.querySelectorAll("[data-section-link]")].map(link=>({
  link,section:document.getElementById(link.hash.slice(1))
})).filter(item=>item.section);
let navigationFrame=null;
function markCurrentSection(sectionId){
  sectionNavigation.forEach(({link,section})=>{
    if(section.id===sectionId)link.setAttribute("aria-current","location");
    else link.removeAttribute("aria-current");
  });
}
function updateCurrentSection(){
  const headerHeight=document.querySelector(".site-header").getBoundingClientRect().height;
  const marker=headerHeight+Math.min(window.innerHeight*.22,160);
  let current=null;
  const visibleSections=sectionNavigation.filter(({section})=>!section.hidden);
  visibleSections.forEach(({section})=>{
    if(section.getBoundingClientRect().top<=marker)current=section.id;
  });
  if(window.scrollY>0&&window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-8){
    current=visibleSections.at(-1)?.section.id||current;
  }
  markCurrentSection(current);
}
function scheduleNavigationUpdate(){
  if(navigationFrame!==null)return;
  navigationFrame=requestAnimationFrame(()=>{navigationFrame=null;updateCurrentSection();});
}
sectionNavigation.forEach(({link,section})=>link.addEventListener("click",()=>markCurrentSection(section.id)));
window.addEventListener("scroll",scheduleNavigationUpdate,{passive:true});
window.addEventListener("resize",scheduleNavigationUpdate);
window.addEventListener("hashchange",scheduleNavigationUpdate);
window.addEventListener("load",scheduleNavigationUpdate);
document.addEventListener("click",event=>{
  if(menu.getAttribute("aria-expanded")==="true"&&!document.querySelector(".site-header").contains(event.target))closeMenu();
});
scheduleNavigationUpdate();
