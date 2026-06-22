/* ============================================================
   Kusai Aljuhmani · Portfolio interactions
   ============================================================ */

/* ---------- 1. Typing effect in hero ---------- */
(function typeRoles() {
  const el = document.getElementById('typed');
  if (!el) return;
  const roles = [
    'AI/ML Engineer',
    'LLM & RAG Engineer',
    'NLP Researcher',
    'Reinforcement Learning',
  ];
  let r = 0, c = 0, deleting = false;

  function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, c);
    if (!deleting && c < word.length) { c++; }
    else if (deleting && c > 0) { c--; }
    else if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1600); }
    else { deleting = false; r = (r + 1) % roles.length; }
    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();
})();

/* ---------- 2. Nav: scrolled state + mobile burger + active link ---------- */
(function nav() {
  const navEl = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 40);
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      links.classList.remove('open');
    })
  );

  // active link highlighting
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...links.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
})();

/* ---------- 3. Scroll reveal ---------- */
(function reveal() {
  const targets = document.querySelectorAll(
    '.section__title, .about > *, .skills__group, .tl, .card, .edu__item, .contact__lead'
  );
  targets.forEach(t => t.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => io.observe(t));
})();

/* ---------- 4. Cute hand-drawn sunset sky: sparkles + little planets ---------- */
(function bg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w, h, items, raf;
  const rand = (a, b) => a + Math.random() * (b - a);
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  function init() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    items = [];

    const nSpark = Math.min(46, Math.floor(window.innerWidth / 26));
    for (let i = 0; i < nSpark; i++) items.push({
      type: 'spark',
      x: rand(0, w), y: rand(0, h), r: rand(3, 8),
      vx: rand(-0.14, 0.14), vy: rand(-0.14, 0.14),
      tw: rand(0, Math.PI * 2), ts: rand(0.01, 0.035),
      alt: Math.random() < 0.5,
    });

    const nPlanet = Math.min(7, Math.floor(window.innerWidth / 230));
    for (let i = 0; i < nPlanet; i++) items.push({
      type: 'planet',
      x: rand(0, w), y: rand(0, h), r: rand(13, 28),
      vx: rand(-0.18, 0.18), vy: rand(-0.18, 0.18),
      bob: rand(0, Math.PI * 2), tilt: rand(0, Math.PI * 2),
      alt: Math.random() < 0.5,
    });
  }

  // a soft 4-point sparkle
  function drawSpark(r) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      const b = a + Math.PI / 4;
      ctx.lineTo(Math.cos(b) * r * 0.34, Math.sin(b) * r * 0.34);
    }
    ctx.closePath();
    ctx.fill();
  }

  // a little planet with a ring
  function drawPlanet(r, c1, c2) {
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.15, 0, 0, r);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = c1;
    ctx.globalAlpha *= 0.5;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.7, r * 0.55, 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const a1 = css('--accent') || '#f97316';
    const a2 = css('--accent-2') || '#ec4899';

    for (const it of items) {
      it.x += it.vx; it.y += it.vy;
      if (it.x < -60) it.x = w + 60;
      if (it.x > w + 60) it.x = -60;
      if (it.y < -60) it.y = h + 60;
      if (it.y > h + 60) it.y = -60;

      ctx.save();
      if (it.type === 'spark') {
        it.tw += it.ts;
        ctx.translate(it.x, it.y);
        ctx.globalAlpha = 0.25 + 0.6 * Math.abs(Math.sin(it.tw));
        ctx.fillStyle = it.alt ? a2 : a1;
        ctx.shadowColor = it.alt ? a2 : a1;
        ctx.shadowBlur = 8;
        drawSpark(it.r);
      } else {
        it.bob += 0.015; it.tilt += 0.004;
        ctx.translate(it.x, it.y + Math.sin(it.bob) * 6);
        ctx.rotate(Math.sin(it.tilt) * 0.22);
        ctx.globalAlpha = 0.8;
        ctx.shadowColor = it.alt ? a1 : a2;
        ctx.shadowBlur = 16;
        drawPlanet(it.r, it.alt ? a1 : a2, it.alt ? a2 : a1);
      }
      ctx.restore();
    }
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { cancelAnimationFrame(raf); init(); draw(); });
  init();
  draw();
})();

/* ---------- 6. Celebrations + easter eggs 🥚 ---------- */
(function eggs() {
  // shared toast
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2200);
  }

  // shared screen-wide confetti rain
  function confetti() {
    const colors = ['#ea580c', '#f59e0b', '#fb923c', '#fde68a', '#fbbf24'];
    for (let i = 0; i < 70; i++) {
      const dot = document.createElement('span');
      dot.className = 'confetti';
      dot.style.left = Math.random() * 100 + 'vw';
      dot.style.top = '-14px';
      dot.style.background = colors[i % colors.length];
      dot.style.setProperty('--dx', (Math.random() * 140 - 70) + 'px');
      dot.style.setProperty('--dy', (window.innerHeight + 40) + 'px');
      dot.style.animationDelay = (Math.random() * 0.35).toFixed(2) + 's';
      dot.style.animationDuration = (1.3 + Math.random() * 0.9).toFixed(2) + 's';
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 2600);
    }
  }

  const celebrate = msg => { confetti(); toast(msg); };

  // (a) spam-click the logo
  const logo = document.querySelector('.nav__logo');
  if (logo) {
    const lines = ['oh you found me 👀', 'keep going...', 'okay okay, you win 🎉', "check the rest of the page, there's another easter egg👀"];
    let clicks = 0;
    logo.addEventListener('click', e => {
      e.preventDefault();
      celebrate(lines[Math.min(clicks, lines.length - 1)]);
      clicks++;
    });
  }

  // (b) guess my favorite color
  const input = document.getElementById('guess-input');
  const reply = document.getElementById('guess-reply');
  if (input && reply) {
    const right = ['orange', 'amber', 'sunset', 'gold', '#ea580c', '#f59e0b'];
    const hints = [
      'it is a warm color 🔥',
      'look at basically everything on this page 👀',
      'the warmest color ☀️',
      'the page is screaming it...😭',
    ];
    let tries = 0;
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      if (right.includes(val)) {
        reply.style.color = 'var(--accent)';
        reply.textContent = 'orange! nailed it 🧡';
        confetti();
        input.value = '';
        tries = 0;
      } else {
        reply.style.color = 'var(--text-dim)';
        reply.textContent = hints[Math.min(tries, hints.length - 1)];
        tries++;
      }
    });
  }
})();

/* ---------- 7. Hello to the curious devs in the console ---------- */
console.log('%c👋 hey, fellow dev! thanks for digging around.', 'color:#ea580c;font-size:14px;font-weight:bold');
console.log("%cif you're reading this, we'd probably get along. → qusaijh482@gmail.com", 'color:#f59e0b');
