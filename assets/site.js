(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var root=document.documentElement;

/* theme */
function getStored(){try{return localStorage.getItem('ls-theme')}catch(e){return null}}
function setStored(v){try{localStorage.setItem('ls-theme',v)}catch(e){}}
var st=getStored();if(st)root.setAttribute('data-theme',st);
var tBtn=document.getElementById('themeBtn');
function isDark(){var t=root.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function paintIcon(){if(!tBtn)return;tBtn.innerHTML=isDark()
  ?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
  :'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  tBtn.setAttribute('aria-label',isDark()?'Switch to light theme':'Switch to dark theme')}
if(tBtn){paintIcon();tBtn.onclick=function(){var n=isDark()?'light':'dark';root.setAttribute('data-theme',n);setStored(n);paintIcon()}}

/* header + burger */
var h=document.querySelector('.site-h');
addEventListener('scroll',function(){h&&h.classList.toggle('scrolled',scrollY>8)},{passive:true});
var b=document.getElementById('burger'),m=document.getElementById('menu');
if(b){b.onclick=function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)};
  m.addEventListener('click',function(e){if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded',false)}})}

/* image fallback */
document.querySelectorAll('.ph img').forEach(function(img){
  function bad(){img.parentElement.classList.add('noimg')}
  if(img.complete&&img.naturalWidth===0&&img.getAttribute('src'))bad();
  img.addEventListener('error',bad);img.addEventListener('load',function(){img.parentElement.classList.remove('noimg')});
});

/* counters */
function countUp(el){var to=+el.dataset.count,suf=el.dataset.suf||'',pre=el.dataset.pre||'';
  if(reduce){el.textContent=pre+to+suf;return}
  var t0=null;function s(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/1400);el.textContent=pre+Math.round(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(s)}requestAnimationFrame(s)}

/* reveal */
function done(el){el.classList.remove('pre');el.classList.add('in');el.querySelectorAll('[data-count]').forEach(countUp)}
if('IntersectionObserver' in window&&!reduce){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){done(e.target);io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el,i){
    if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)}else done(el)});
}else document.querySelectorAll('.rv').forEach(done);

/* faq */
document.querySelectorAll('.qa button').forEach(function(btn){btn.addEventListener('click',function(){
  var qa=btn.parentElement,open=!qa.classList.contains('open');
  qa.parentElement.querySelectorAll('.qa').forEach(function(x){x.classList.remove('open');x.querySelector('button').setAttribute('aria-expanded',false)});
  if(open){qa.classList.add('open');btn.setAttribute('aria-expanded',true)}
})});

/* copy buttons */
document.querySelectorAll('[data-copy]').forEach(function(btn){btn.addEventListener('click',function(){
  var txt=btn.getAttribute('data-copy'),old=btn.textContent;
  function ok(){btn.textContent='Copied';setTimeout(function(){btn.textContent=old},1400)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok,function(){sel(btn)})}else sel(btn);
  function sel(b){var c=b.parentElement.querySelector('code');if(!c)return;var r=document.createRange();r.selectNodeContents(c);var s=getSelection();s.removeAllRanges();s.addRange(r)}
})});

document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});
})();
