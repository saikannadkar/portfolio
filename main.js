const typedTarget = document.getElementById("typedText");
const phrases = [
  "Building production-grade backend systems.",
  "Thinking in clean architecture.",
  "Automating the boring stuff.",
  "Exploring autonomous drone workflows.",
  "Open to internships and serious problems."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  typedTarget.textContent = phrase.slice(0, charIndex);

  if (!isDeleting && charIndex < phrase.length) {
    charIndex += 1;
    window.setTimeout(typeLoop, 46);
    return;
  }

  if (!isDeleting && charIndex === phrase.length) {
    isDeleting = true;
    window.setTimeout(typeLoop, 1300);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    window.setTimeout(typeLoop, 24);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  window.setTimeout(typeLoop, 280);
}

typeLoop();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  revealObserver.observe(element);
});

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-42% 0px -52% 0px" });

sections.forEach((section) => navObserver.observe(section));

const canvas = document.getElementById("field");
const context = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const points = [];
let width = 0;
let height = 0;
let animationFrame = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  seedPoints();
}

function seedPoints() {
  points.length = 0;
  const count = Math.max(18, Math.min(42, Math.floor(width / 34)));
  for (let index = 0; index < count; index += 1) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      radius: Math.random() * 0.8 + 0.4
    });
  }
}

function drawField() {
  context.clearRect(0, 0, width, height);
  context.strokeStyle = "rgba(25, 24, 20, 0.08)";
  context.fillStyle = "rgba(25, 24, 20, 0.18)";

  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;

    context.beginPath();
    context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    context.fill();

    for (let next = index + 1; next < points.length; next += 1) {
      const other = points[next];
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 110) {
        context.globalAlpha = (110 - distance) / 110;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }
    context.globalAlpha = 1;
  });

  animationFrame = window.requestAnimationFrame(drawField);
}

if (!prefersReducedMotion) {
  resizeCanvas();
  drawField();
  window.addEventListener("resize", resizeCanvas);
} else {
  canvas.hidden = true;
}

window.addEventListener("beforeunload", () => {
  window.cancelAnimationFrame(animationFrame);
});

// ── Analytics ────────────────────────────────────────────────────────────────
 
function gtrack(eventName, params) {
  if (typeof gtag === 'undefined') return;
  gtag('event', eventName, params);
}
 
// UTM parameters — capture on load and store for the session
(function captureUTM() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utm = {};
  utmKeys.forEach(k => { if (params.get(k)) utm[k] = params.get(k); });
  if (Object.keys(utm).length) {
    sessionStorage.setItem('utm', JSON.stringify(utm));
    gtrack('utm_visit', utm);
  }
})();
 
function getUTM() {
  try { return JSON.parse(sessionStorage.getItem('utm') || '{}'); } catch { return {}; }
}
 
// CTA click tracking
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent.trim();
 
    if (href.includes('Resume') || href.includes('.pdf')) {
      gtrack('resume_download', { ...getUTM() });
    } else if (href.startsWith('mailto:')) {
      gtrack('email_click', { email: href.replace('mailto:', ''), ...getUTM() });
    } else if (href.startsWith('tel:')) {
      gtrack('phone_click', { ...getUTM() });
    } else if (href.includes('linkedin.com')) {
      gtrack('linkedin_click', { ...getUTM() });
    } else if (href.includes('github.com')) {
      gtrack('github_click', { link_text: text, ...getUTM() });
    } else if (href.includes('n8n.saikannadkar')) {
      gtrack('n8n_click', { ...getUTM() });
    } else if (href.startsWith('#')) {
      gtrack('nav_click', { section: href.replace('#', ''), ...getUTM() });
    }
  });
});
 
// Section view tracking — fires once per section when 40% visible
const sectionNames = { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', contact: 'Contact' };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    if (sectionNames[id]) {
      gtrack('section_view', { section: sectionNames[id], ...getUTM() });
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
 
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
 
// Scroll depth tracking — 25%, 50%, 75%, 100%
const scrollDepths = new Set();
window.addEventListener('scroll', () => {
  const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  [25, 50, 75, 100].forEach(d => {
    if (pct >= d && !scrollDepths.has(d)) {
      scrollDepths.add(d);
      gtrack('scroll_depth', { depth: d, ...getUTM() });
    }
  });
}, { passive: true });
 
// Time on page — fire at 30s and 60s
[30000, 60000].forEach(ms => {
  setTimeout(() => gtrack('time_on_page', { seconds: ms / 1000, ...getUTM() }), ms);
});

// ── Scroll Progress Bar ───────────────────────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
 
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.transform = `scaleX(${pct})`;
}, { passive: true });
 
// ── Custom Cursor (desktop only) ──────────────────────────────────────────────
if (window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
 
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
 
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}
 
// ── Hero Headline Word Reveal ─────────────────────────────────────────────────
(function initHeadline() {
  const headline = document.querySelector('.headline');
  if (!headline) return;
  headline.querySelectorAll('span').forEach((span, i) => {
    const word = span.textContent;
    span.innerHTML = `<span class="headline-word" style="transition-delay:${0.1 + i * 0.15}s">${word}</span>`;
  });
  setTimeout(() => {
    headline.querySelectorAll('.headline-word').forEach(w => w.classList.add('is-visible'));
  }, 200);
})();
 
// ── Kicker Text Reveal ────────────────────────────────────────────────────────
(function initKicker() {
  const kicker = document.querySelector('.kicker');
  if (!kicker) return;
  const text = kicker.textContent;
  kicker.innerHTML = `<span class="kicker-inner">${text}</span>`;
  setTimeout(() => {
    kicker.querySelector('.kicker-inner').classList.add('is-visible');
  }, 100);
})();
 
// ── Metric Counter Animation ──────────────────────────────────────────────────
function animateCounter(el, target, suffix, duration = 1200) {
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
 
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const strong = entry.target.querySelector('strong');
    if (!strong) return;
    const raw = strong.textContent.trim();
    const num = parseInt(raw.replace(/[^0-9]/g, ''));
    const suffix = raw.replace(/[0-9,]/g, '');
    if (!isNaN(num)) animateCounter(strong, num, suffix);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });
 
document.querySelectorAll('.metric-grid div').forEach(d => counterObserver.observe(d));
 
// ── Magnetic Buttons ──────────────────────────────────────────────────────────
document.querySelectorAll('.primary-btn, .ghost-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
 
// ── Staggered Timeline Cards ──────────────────────────────────────────────────
document.querySelectorAll('.timeline-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});
 
// ── Reveal Left/Right for Split Sections ─────────────────────────────────────
document.querySelectorAll('.section-label').forEach(el => {
  el.classList.add('reveal-left');
  revealObserver.observe(el);
});
 
document.querySelectorAll('.copy-block').forEach(el => {
  el.classList.add('reveal-right');
  revealObserver.observe(el);
});
 
// ── GA4 Analytics ─────────────────────────────────────────────────────────────
function gtrack(eventName, params) {
  if (typeof gtag === 'undefined') return;
  gtag('event', eventName, params);
}
 
(function captureUTM() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utm = {};
  utmKeys.forEach(k => { if (params.get(k)) utm[k] = params.get(k); });
  if (Object.keys(utm).length) {
    sessionStorage.setItem('utm', JSON.stringify(utm));
    gtrack('utm_visit', utm);
  }
})();
 
function getUTM() {
  try { return JSON.parse(sessionStorage.getItem('utm') || '{}'); } catch { return {}; }
}
 
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent.trim();
    if (href.includes('Resume') || href.includes('.pdf')) {
      gtrack('resume_download', { ...getUTM() });
    } else if (href.startsWith('mailto:')) {
      gtrack('email_click', { email: href.replace('mailto:', ''), ...getUTM() });
    } else if (href.startsWith('tel:')) {
      gtrack('phone_click', { ...getUTM() });
    } else if (href.includes('linkedin.com')) {
      gtrack('linkedin_click', { ...getUTM() });
    } else if (href.includes('github.com')) {
      gtrack('github_click', { link_text: text, ...getUTM() });
    } else if (href.includes('n8n.saikannadkar')) {
      gtrack('n8n_click', { ...getUTM() });
    } else if (href.startsWith('#')) {
      gtrack('nav_click', { section: href.replace('#', ''), ...getUTM() });
    }
  });
});
 
const sectionNames = { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', contact: 'Contact' };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    if (sectionNames[id]) {
      gtrack('section_view', { section: sectionNames[id], ...getUTM() });
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
 
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
 
const scrollDepths = new Set();
window.addEventListener('scroll', () => {
  const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  [25, 50, 75, 100].forEach(d => {
    if (pct >= d && !scrollDepths.has(d)) {
      scrollDepths.add(d);
      gtrack('scroll_depth', { depth: d, ...getUTM() });
    }
  });
}, { passive: true });
 
[30000, 60000].forEach(ms => {
  setTimeout(() => gtrack('time_on_page', { seconds: ms / 1000, ...getUTM() }), ms);
});
