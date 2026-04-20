/* ===========================
   PARTICLE CANVAS
   =========================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let raf;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawnParticles() {
  particles = [];
  const count = Math.min(Math.floor(window.innerWidth / 14), 120);
  for (let i = 0; i < count; i++) {
    particles.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.3 + 0.3,
      dx:    (Math.random() - 0.5) * 0.28,
      dy:    (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.45 + 0.08,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 151, 58, ${p.alpha})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < -2 || p.x > canvas.width  + 2) p.dx *= -1;
    if (p.y < -2 || p.y > canvas.height + 2) p.dy *= -1;
  });
  raf = requestAnimationFrame(drawParticles);
}

resizeCanvas();
spawnParticles();
drawParticles();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { resizeCanvas(); spawnParticles(); }, 200);
});

/* ===========================
   NAVBAR — scroll state
   =========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ===========================
   MOBILE NAV TOGGLE
   =========================== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===========================
   TIMELINE FILTER
   =========================== */
document.querySelectorAll('.timeline-filters .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.timeline-filters .filter-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.timeline-item').forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
      if (match) {
        // re-trigger reveal if already visible
        item.classList.remove('visible');
        setTimeout(() => item.classList.add('visible'), 20);
      }
    });
  });
});

/* ===========================
   CREATIVE FILTER
   =========================== */
document.querySelectorAll('.creative-filters .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.creative-filters .filter-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.creative-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ===========================
   COUNTER ANIMATION
   =========================== */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const fps      = 60;
  const steps    = Math.round(duration / (1000 / fps));
  const inc      = target / steps;
  let current    = 0;
  let step       = 0;

  const tick = () => {
    step++;
    current += inc;
    if (step >= steps) {
      el.textContent = target.toLocaleString();
    } else {
      el.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.35 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);

/* ===========================
   SCROLL REVEAL
   =========================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards within the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx * 80, 400));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===========================
   ACTIVE NAV LINK — scroll spy
   =========================== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--primary)';
        }
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => spyObserver.observe(s));

/* ===========================
   SMOOTH CURSOR GLOW (desktop)
   =========================== */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 320px; height: 320px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,151,58,0.055) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.4s;
  `;
  document.body.appendChild(glow);

  let mx = -500, my = -500;
  let cx = -500, cy = -500;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  window.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });

  function animGlow() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animGlow);
  }
  animGlow();
}
