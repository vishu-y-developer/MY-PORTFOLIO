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
    const IS_MOBILE = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    
    // Core logic that runs everywhere
    mobileMenu();
    dropDowns();
    initTouchEffects();
    particles();
    generateStars();
    
    if (!IS_MOBILE) {
        scrollReveal();
        countUp();
        projGlow();
        customCursor();
        magneticElements();
        tiltCards();
        initLenisAndScroll();
    } else {
        // Fallbacks for mobile
        scrollReveal(); // Let's enable scrollReveal on mobile too
        countUp(); // Enable countUp on mobile
        
        const nav = document.getElementById('nav');
        let tick = false;
        window.addEventListener('scroll', () => {
            if (!tick) {
                requestAnimationFrame(() => {
                    if(nav) nav.classList.toggle('scrolled', window.scrollY > 40);
                    tick = false;
                });
                tick = true;
            }
        }, {passive: true});
    }
}

/* ── Particles ── */
let pColor='129,140,248', pColor2='192,132,252';

function updateParticleColors(theme){
    pColor=theme==='light'?'99,102,241':'129,140,248';
    pColor2=theme==='light'?'168,85,247':'192,132,252';
}

// Make particle update global so we can call it from master loop
let particleUpdateFn = null;
let particlesVisible = true;

function particles(){
    const canvas=document.getElementById('particles');
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    let width,height,particles=[];
    
    // Reduce particle count significantly for performance
    const count=window.innerWidth < 768 ? 15 : 30;

    function resize(){
        width=canvas.width=window.innerWidth;
        height=canvas.height=window.innerHeight;
    }
    window.addEventListener('resize',resize);
    resize();

    class Particle{
        constructor(){
            this.x=Math.random()*width;
            this.y=Math.random()*height;
            this.vx=(Math.random()-.5)*0.2;
            this.vy=(Math.random()-.5)*0.2;
            this.size=Math.random()*1.5+.5;
            this.c=Math.random()>.5?pColor:pColor2;
        }
        update(){
            this.x+=this.vx;this.y+=this.vy;
            if(this.x<0||this.x>width)this.vx*=-1;
            if(this.y<0||this.y>height)this.vy*=-1;
            ctx.fillStyle=`rgba(${this.c}, ${Math.random()*0.3+0.1})`;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
            ctx.fill();
        }
    }
    for(let i=0;i<count;i++) particles.push(new Particle());

    particleUpdateFn = () => {
        if (!particlesVisible) return;
        ctx.clearRect(0,0,width,height);
        particles.forEach(p=>p.update());
    };

    // Pause particles when hero is out of view
    const hero = document.getElementById('hero');
    if (hero) {
        const io = new IntersectionObserver(entries => {
            particlesVisible = entries[0].isIntersecting;
        }, { threshold: 0 });
        io.observe(hero);
    }
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

/* ── Mobile Touch Ripple ── */
function initTouchEffects() {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.left = touch.clientX + 'px';
        ripple.style.top = touch.clientY + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }, {passive: true});
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
let cursorUpdateFn = null;

function customCursor() {
    // Disable entirely on mobile
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if(!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.body.style.setProperty('--cx', mouseX + 'px');
        document.body.style.setProperty('--cy', mouseY + 'px');
    });

    cursorUpdateFn = () => {
        ringX += (mouseX - ringX) * 0.25;
        ringY += (mouseY - ringY) * 0.25;
        document.body.style.setProperty('--rx', ringX + 'px');
        document.body.style.setProperty('--ry', ringY + 'px');
    };

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
    // Disable heavy 3D tilt on mobile devices
    if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.card, .srv-card, .proj, .gh-card, .li-card, .stat, .cc');
    
    cards.forEach(card => {
        let isHovered = false;
        let x = 0, y = 0;
        let ticking = false;
        
        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mousemove', (e) => {
            if(!isHovered) return;
            const rect = card.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
            
            if(!ticking) {
                requestAnimationFrame(() => {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    // Subtle 3D rotation (max 3 degrees for performance)
                    const rotateX = ((y - centerY) / centerY) * -3; 
                    const rotateY = ((x - centerX) / centerX) * 3;  
                    
                    if(card.classList.contains('proj') || card.classList.contains('card')) {
                        card.style.setProperty('--mx', (x / rect.width * 100) + '%');
                        card.style.setProperty('--my', (y / rect.height * 100) + '%');
                    }
                    
                    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease';
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

/* ── Dynamic Deep Space Background ── */
function generateStars() {
    // Drastically reduce star counts
    const counts = { s1: 40, s2: 15, s3: 5 };
    const spaceBg = document.querySelector('.space-bg');
    if(!spaceBg) return;
    
    function createBoxShadows(n) {
        let val = '';
        for(let i=0; i<n; i++) {
            val += `${Math.random()*100}vw ${Math.random()*100}vh #FFF${i<n-1?', ':''}`;
        }
        return val;
    }
    
    document.querySelector('.stars-1').style.boxShadow = createBoxShadows(counts.s1);
    document.querySelector('.stars-2').style.boxShadow = createBoxShadows(counts.s2);
    document.querySelector('.stars-3').style.boxShadow = createBoxShadows(counts.s3);
}

/* ── Util ── */
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
/* ── Centralized High-Performance Scroll Architecture ── */
function initLenisAndScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    let lenis = null;

    // Cache elements to avoid querying DOM during scroll
    const nav = document.getElementById('nav');
    const stream = document.getElementById('neuralStream');
    const spark = document.getElementById('neuralSpark');
    const s1 = document.querySelector('.stars-1'), s2 = document.querySelector('.stars-2'), s3 = document.querySelector('.stars-3'), nebula = document.querySelector('.nebula');
    
    // Convert NodeList to Array and filter out items outside the layout flow to save computation
    let titles = Array.from(document.querySelectorAll('.sec-title'));

    function updateScroll(scrollY) {
        // Nav Background
        if(nav) nav.classList.toggle('scrolled', scrollY > 40);
        
        // Neural Stream Tracking
        if(stream && spark && !isMobile) {
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrolled = Math.max(0, Math.min(1, scrollY / docHeight));
            const maxScroll = stream.offsetHeight - spark.offsetHeight;
            spark.style.transform = `translateX(-50%) translateY(${scrolled * maxScroll}px)`;
        }

        if (prefersReducedMotion) return;

        // Cinematic Deep Space Parallax (Disable on mobile)
        if(!isMobile) {
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
    }

    // Single Master RAF Loop
    function masterRaf(time) {
        if (lenis) lenis.raf(time);
        if (particleUpdateFn) particleUpdateFn();
        if (cursorUpdateFn) cursorUpdateFn();
        requestAnimationFrame(masterRaf);
    }

    if (!prefersReducedMotion && !isMobile && typeof Lenis !== 'undefined') {
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
    } else {
        // Fallback to Native Scroll 
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
    
    requestAnimationFrame(masterRaf);

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
