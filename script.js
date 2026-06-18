/* ═══════════════════════════════════════════
   UTKARSH YADAV — AI/ML PORTFOLIO
   Theme Toggle + Particles + Interactions + Premium Enhancements
   ═══════════════════════════════════════════ */
(function(){
'use strict';

/* ── Loader ── */
window.addEventListener('load',()=>{
    setTimeout(()=>{
        document.getElementById('loader').classList.add('done');
        document.body.style.overflow='';
        init();
    },1400);
});
document.body.style.overflow='hidden';

function init(){
    themeToggle();
    particles();
    scrollReveal();
    navScroll();
    mobileMenu();
    smoothScroll();
    countUp();
    projGlow();
    customCursor();
    scrollProgress();
    magneticElements();
    tiltCards();
    parallaxInit();
    dropDowns();
}

/* ── Theme Toggle ── */
function themeToggle(){
    const btn=document.getElementById('themeBtn');
    const html=document.documentElement;
    const saved=localStorage.getItem('uy-theme');
    if(saved) html.setAttribute('data-theme',saved);

    btn.addEventListener('click',()=>{
        const next=html.getAttribute('data-theme')==='dark'?'light':'dark';
        html.setAttribute('data-theme',next);
        localStorage.setItem('uy-theme',next);
        updateParticleColors(next);
    });
}

/* ── Particles ── */
let pColor='129,140,248', pColor2='192,132,252';

function updateParticleColors(theme){
    if(theme==='light'){
        pColor='99,102,241'; pColor2='168,85,247';
    } else {
        pColor='129,140,248'; pColor2='192,132,252';
    }
}

function particles(){
    const canvas=document.getElementById('particles');
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const hero=canvas.parentElement;
    let W,H,pts=[],raf;
    const N=innerWidth<768?30:55;
    const DIST=innerWidth<768?100:145;
    let mx,my;

    updateParticleColors(document.documentElement.getAttribute('data-theme')||'dark');

    function resize(){
        const rect=hero.getBoundingClientRect();
        W=rect.width; H=rect.height;
        const dpr=Math.min(devicePixelRatio,2);
        canvas.width=W*dpr;
        canvas.height=H*dpr;
        ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    addEventListener('resize',debounce(resize,200));

    hero.addEventListener('mousemove',e=>{
        const r=hero.getBoundingClientRect();
        mx=e.clientX-r.left; my=e.clientY-r.top;
    });
    hero.addEventListener('mouseleave',()=>{mx=my=undefined});

    class P{
        constructor(){
            this.x=Math.random()*W;
            this.y=Math.random()*H;
            this.vx=(Math.random()-.5)*.3;
            this.vy=(Math.random()-.5)*.3;
            this.r=Math.random()*1.6+.5;
            this.o=Math.random()*.35+.12;
        }
        update(){
            this.x+=this.vx; this.y+=this.vy;
            if(this.x<0||this.x>W) this.vx*=-1;
            if(this.y<0||this.y>H) this.vy*=-1;
            if(mx!==undefined){
                const dx=mx-this.x,dy=my-this.y,d=Math.sqrt(dx*dx+dy*dy);
                if(d<180){const f=(180-d)/180*.007;this.vx+=dx*f;this.vy+=dy*f}
            }
            this.vx*=.996; this.vy*=.996;
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,6.283);
            ctx.fillStyle=`rgba(${pColor},${this.o})`;
            ctx.fill();
        }
    }

    for(let i=0;i<N;i++) pts.push(new P());

    function loop(){
        ctx.clearRect(0,0,W,H);
        for(let i=0;i<pts.length;i++){
            pts[i].update(); pts[i].draw();
            for(let j=i+1;j<pts.length;j++){
                const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d2=dx*dx+dy*dy;
                if(d2<DIST*DIST){
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x,pts[i].y);
                    ctx.lineTo(pts[j].x,pts[j].y);
                    ctx.strokeStyle=`rgba(${pColor},${(1-Math.sqrt(d2)/DIST)*.1})`;
                    ctx.lineWidth=.5;
                    ctx.stroke();
                }
            }
        }
        if(mx!==undefined){
            for(let i=0;i<pts.length;i++){
                const dx=mx-pts[i].x,dy=my-pts[i].y,d=Math.sqrt(dx*dx+dy*dy);
                if(d<160){
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x,pts[i].y);
                    ctx.lineTo(mx,my);
                    ctx.strokeStyle=`rgba(${pColor2},${(1-d/160)*.18})`;
                    ctx.lineWidth=.6;
                    ctx.stroke();
                }
            }
        }
        raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);

    document.addEventListener('visibilitychange',()=>{
        document.hidden?cancelAnimationFrame(raf):(raf=requestAnimationFrame(loop));
    });
}

/* ── Scroll Reveal ── */
function scrollReveal(){
    const els=document.querySelectorAll('.sr');
    if(!els.length) return;
    const io=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}
        });
    },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    els.forEach(el=>io.observe(el));
}

/* ── Nav Scroll ── */
function navScroll(){
    const nav=document.getElementById('nav');
    if(!nav) return;
    let tick=false;
    addEventListener('scroll',()=>{
        if(!tick){requestAnimationFrame(()=>{nav.classList.toggle('scrolled',scrollY>40);tick=false});tick=true}
    },{passive:true});
}

/* ── Mobile Menu ── */
function mobileMenu(){
    const btn=document.getElementById('burger'),menu=document.getElementById('mobMenu');
    if(!btn||!menu) return;
    btn.addEventListener('click',()=>{
        btn.classList.toggle('on');
        menu.classList.toggle('open');
        document.body.style.overflow=menu.classList.contains('open')?'hidden':'';
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
        btn.classList.remove('on');menu.classList.remove('open');document.body.style.overflow='';
    }));
}

/* ── Smooth Scroll ── */
function smoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click',e=>{
            const t=document.querySelector(a.getAttribute('href'));
            if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
        });
    });
}

/* ── Count Up ── */
function countUp(){
    const nums=document.querySelectorAll('[data-count]');
    if(!nums.length) return;
    const io=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                const el=e.target,target=+el.dataset.count,start=performance.now();
                (function step(now){
                    const p=Math.min((now-start)/1200,1);
                    el.textContent=Math.round(target*(1-Math.pow(1-p,3)));
                    if(p<1) requestAnimationFrame(step);
                })(start);
                io.unobserve(el);
            }
        });
    },{threshold:.5});
    nums.forEach(n=>io.observe(n));
}

/* ── Project Card Glow ── */
function projGlow(){
    document.querySelectorAll('.proj').forEach(c=>{
        c.addEventListener('mousemove',e=>{
            const r=c.getBoundingClientRect();
            c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
            c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
        });
    });
}

/* ── Premium Enhancements ── */

/* 1. Custom Cursor */
function customCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if(!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function render() {
        ringX += (mouseX - ringX) * 0.2;
        ringY += (mouseY - ringY) * 0.2;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // Hover state for interactive elements
    const interactives = document.querySelectorAll('a, button, .cc, .card, .proj, .srv-card, .stat, .gh-card, .li-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

/* 2. Scroll Progress Bar */
function scrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if(!bar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        bar.style.width = scrolled + '%';
    }, {passive: true});
}

/* 3. Magnetic Buttons */
function magneticElements() {
    // Buttons to apply magnetic effect
    const magnetics = document.querySelectorAll('.btn-fill, .btn-glass, .btn-li, .theme-btn');
    
    magnetics.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Limit the movement
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        el.addEventListener('mouseleave', function() {
            el.style.transform = `translate(0px, 0px)`;
        });
    });
}

/* 4. 3D Tilt Effect for Cards */
function tiltCards() {
    const cards = document.querySelectorAll('.card, .srv-card, .proj, .gh-card, .li-card, .stat');
    
    cards.forEach(card => {
        // Prevent default CSS hover translate clashing with our 3D transform by using perspective
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg
            const rotateY = ((x - centerX) / centerX) * 5;  // Max 5 deg
            
            // For .proj, keep the glow variables active
            if(card.classList.contains('proj')) {
                card.style.setProperty('--mx', (x / rect.width * 100) + '%');
                card.style.setProperty('--my', (y / rect.height * 100) + '%');
            }
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            // Ensure shadow reacts dynamically if possible
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });
}

/* 5. Subtle Parallax for Background Elements */
function parallaxInit() {
    const glows = document.querySelectorAll('.hero-glow');
    const titles = document.querySelectorAll('.sec-title');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Hero glows move slightly
        glows.forEach((glow, index) => {
            const speed = (index + 1) * 0.15;
            // Retain original animation by overriding translateY selectively? 
            // It's better to just translate them slightly in a wrapper, or we can just apply top offset
            // Instead, we'll parallax the section titles slightly
        });
        
        // Section titles move at a different rate
        titles.forEach(title => {
            const rect = title.getBoundingClientRect();
            // Only parallax if visible
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const distance = window.innerHeight - rect.top;
                title.style.transform = `translateY(${distance * -0.05}px)`;
            }
        });
    }, {passive: true});
}

/* 6. Timeline Dropdowns */
function dropDowns() {
    const drops = document.querySelectorAll('.has-drop');
    drops.forEach(drop => {
        const head = drop.querySelector('.tl-item');
        const content = drop.querySelector('.tl-drop');
        
        head.addEventListener('click', () => {
            const isOpen = drop.classList.contains('open');
            
            // Close all others
            drops.forEach(d => {
                d.classList.remove('open');
                const c = d.querySelector('.tl-drop');
                if(c) {
                    c.style.maxHeight = null;
                    c.style.paddingBottom = null;
                }
            });
            
            if(!isOpen) {
                drop.classList.add('open');
                content.style.maxHeight = content.scrollHeight + 20 + 'px';
                content.style.paddingBottom = '12px';
            }
        });
    });
}

/* ── Util ── */
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
})();
