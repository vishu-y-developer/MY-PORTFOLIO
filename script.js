/* ═══════════════════════════════════════════
   UTKARSH YADAV — AI/ML PORTFOLIO
   Theme Toggle + Particles + Interactions + Premium Enhancements
   ═══════════════════════════════════════════ */
(function(){
'use strict';

/* ── Loader ── */
document.body.style.overflow='hidden';
let ldProgress = 0;
const ldInterval = setInterval(() => {
    ldProgress += Math.floor(Math.random() * 15) + 3;
    if(ldProgress >= 100) {
        ldProgress = 100;
        clearInterval(ldInterval);
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if(loader) loader.classList.add('done');
            document.body.style.overflow='';
            init();
        }, 400);
    }
    const ldNum = document.getElementById('ldNum');
    const ldFill = document.getElementById('ldFill');
    if(ldNum) ldNum.textContent = ldProgress;
    if(ldFill) ldFill.style.width = ldProgress + '%';
}, 60);

function init(){
    particles();
    scrollReveal();
    mobileMenu();
    countUp();
    projGlow();
    customCursor();
    magneticElements();
    tiltCards();
    dropDowns();
    initRoadmapAccordions();
    generateStars();
    initLenisAndScroll();
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

/* ── Scroll Reveal & Intersection Glow ── */
function scrollReveal(){
    const els=document.querySelectorAll('.sr');
    if(!els.length) return;
    const io=new IntersectionObserver((entries,obs)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                e.target.classList.add('vis');
                // Temporary glow reveal
                e.target.classList.add('glow-reveal');
                setTimeout(() => e.target.classList.remove('glow-reveal'), 800);
                obs.unobserve(e.target);
            }
        });
    },{threshold:.15, rootMargin: '0px 0px -50px 0px'});
    els.forEach(el=>io.observe(el));
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

/* 4. Premium 3D Tilt Effect for Cards */
function tiltCards() {
    const cards = document.querySelectorAll('.card, .srv-card, .proj, .gh-card, .li-card, .stat, .cc');
    
    cards.forEach(card => {
        let isHovered = false;
        let x = 0, y = 0;
        
        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mousemove', (e) => {
            if(!isHovered) return;
            const rect = card.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle 3D rotation (max 4 degrees)
            const rotateX = ((y - centerY) / centerY) * -4; 
            const rotateY = ((x - centerX) / centerX) * 4;  
            
            // Dynamic glare using the before pseudo-element or CSS variables
            if(card.classList.contains('proj') || card.classList.contains('card')) {
                card.style.setProperty('--mx', (x / rect.width * 100) + '%');
                card.style.setProperty('--my', (y / rect.height * 100) + '%');
            }
            
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = `perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            if(card.classList.contains('proj') || card.classList.contains('card')) {
                card.style.setProperty('--mx', '50%');
                card.style.setProperty('--my', '50%');
            }
        });
    });
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

/* ── Night Sky Stars ── */
function generateStars() {
    const s1 = document.querySelector('.stars-1'), s2 = document.querySelector('.stars-2'), s3 = document.querySelector('.stars-3');
    if(!s1 || !s2 || !s3) return;
    const make = (n) => Array.from({length:n}).map(()=>`${Math.random()*100}vw ${Math.random()*100}vh #fff`).join(',');
    s1.style.boxShadow = make(250);
    s2.style.boxShadow = make(100);
    s3.style.boxShadow = make(40);
}

/* ── Util ── */
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
/* ── Centralized High-Performance Scroll Architecture ── */
function initLenisAndScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis = null;

    // Cache elements to avoid querying DOM during scroll
    const nav = document.getElementById('nav');
    const stream = document.getElementById('neuralStream');
    const spark = document.getElementById('neuralSpark');
    const s1 = document.querySelector('.stars-1'), s2 = document.querySelector('.stars-2'), s3 = document.querySelector('.stars-3'), nebula = document.querySelector('.nebula');
    const titles = document.querySelectorAll('.sec-title');

    function updateScroll(scrollY) {
        // Nav Background
        if(nav) nav.classList.toggle('scrolled', scrollY > 40);
        
        // Neural Stream Tracking
        if(stream && spark) {
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrolled = Math.max(0, Math.min(1, scrollY / docHeight));
            const maxScroll = stream.offsetHeight - spark.offsetHeight;
            spark.style.transform = `translateX(-50%) translateY(${scrolled * maxScroll}px)`;
        }

        if (prefersReducedMotion) return;

        // Cinematic Deep Space Parallax
        if(s1) s1.style.transform = `translateY(${scrollY * -0.05}px)`;
        if(s2) s2.style.transform = `translateY(${scrollY * -0.1}px)`;
        if(s3) s3.style.transform = `translateY(${scrollY * -0.15}px)`;
        if(nebula) nebula.style.transform = `translateY(${scrollY * -0.03}px) scale(1.1)`;
        
        titles.forEach(title => {
            const rect = title.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const distance = window.innerHeight - rect.top;
                title.style.transform = `translateY(${distance * -0.04}px)`;
            }
        });
    }

    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        lenis.on('scroll', (e) => {
            updateScroll(e.scroll);
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } else {
        // Fallback to Native Scroll (still optimized)
        let tick = false;
        window.addEventListener('scroll', () => {
            if(!tick) {
                requestAnimationFrame(() => {
                    updateScroll(window.scrollY);
                    tick = false;
                });
                tick = true;
            }
        }, {passive: true});
    }

    // Anchor Links setup (with Lenis if available, else native)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if(target) {
                e.preventDefault();
                if(lenis) {
                    lenis.scrollTo(target, { offset: -60, duration: 1.2 });
                } else {
                    target.scrollIntoView({behavior:'smooth',block:'start'});
                }
            }
        });
    });

    // Run once on load
    updateScroll(window.scrollY);
    window.addEventListener('resize', () => updateScroll(window.scrollY));
}

})();
