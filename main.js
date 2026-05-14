const btn = document.getElementById('themeBtn');
const saved = localStorage.getItem('theme') || 'light';
if (saved === 'dark') { document.documentElement.setAttribute('data-theme','dark'); btn.textContent='●'; }
btn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme','light'); btn.textContent='○'; }
  else { document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('theme','dark'); btn.textContent='●'; }
});
 
const phrases = ['Building production-grade systems.','Thinking in clean architecture.','Automating the boring stuff.','Exploring autonomous systems.','Open to what comes next.'];
let phraseIdx=0,charIdx=0,deleting=false;
const typedEl = document.getElementById('typed');
function type() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0,++charIdx);
    if (charIdx===phrase.length) { deleting=true; setTimeout(type,2000); return; }
    setTimeout(type,55);
  } else {
    typedEl.textContent = phrase.slice(0,--charIdx);
    if (charIdx===0) { deleting=false; phraseIdx=(phraseIdx+1)%phrases.length; setTimeout(type,400); return; }
    setTimeout(type,28);
  }
}
type();
 
const observer = new IntersectionObserver((entries) => {
  entries.forEach((el,i) => { if (el.isIntersecting) setTimeout(()=>el.target.classList.add('visible'),i*80); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el=>observer.observe(el));
