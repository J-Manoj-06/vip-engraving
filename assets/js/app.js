/*
  Vip Arts — app.js
  - All interactive behaviors for the site
  - WhatsApp business number: edit below
*/

// ======= CONFIG =======
// Edit this number to your WhatsApp Business number (international format, no + or spaces)
const WHATSAPP_NUMBER = "919363477735";

// ======= UTILITIES =======
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function showToast(message, timeout = 2200) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove('show'), timeout);
}

function formatINR(amount) {
  try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount); }
  catch { return `₹${amount}`; }
}

function encodeWaMessage(text) { return encodeURIComponent(text); }
function nowYear() { return new Date().getFullYear(); }

// ======= THEME =======
function applySavedTheme() {
  const saved = localStorage.getItem('viparts-theme');
  if (saved) document.body.setAttribute('data-theme', saved);
}
function toggleTheme() {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'light' ? '' : 'light';
  if (next) document.body.setAttribute('data-theme', next); else document.body.removeAttribute('data-theme');
  localStorage.setItem('viparts-theme', next);
}

// ======= NAV =======
function initNav() {
  const btn = $('.nav-toggle');
  const list = $('#nav-list');
  if (!btn || !list) return;

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    list.classList.add('open');
  }
  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    list.classList.remove('open');
  }
  function isOpen() { return list.classList.contains('open'); }

  btn.addEventListener('click', () => {
    if (isOpen()) closeMenu(); else openMenu();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    const nav = btn.closest('.main-nav');
    if (!nav) return;
    if (!nav.contains(e.target) && isOpen()) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // Reset state when switching to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) closeMenu();
  });

  const links = $$('.nav-link');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const id = '#' + e.target.id;
      if (e.isIntersecting) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 1] });
  sections.forEach(s => s && obs.observe(s));
}

// ======= HERO PARALLAX (optional) =======
function initHeroParallax() {
  if (!window.gsap) return;
  const bg = $('.hero-bg img');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.12;
    gsap.to(bg, { y: y, duration: 0.4, overwrite: true });
  }, { passive: true });
}

// ======= FLOATING DECOR =======
function initFloatingLayer() {
  const floats = $$('.float');
  floats.forEach((el, i) => {
    const dur = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 16;
    el.animate([
      { transform: 'translateY(10px) rotate(0deg)', opacity: .0 },
      { transform: 'translateY(-30px) rotate(6deg)', opacity: .5, offset: .3 },
      { transform: 'translateY(-60px) rotate(-6deg)', opacity: .8, offset: .6 },
      { transform: 'translateY(-100px) rotate(0deg)', opacity: .0 }
    ], { duration: dur * 1000, iterations: Infinity, easing: 'ease-in-out', delay: i * 800 });
  });
}

// ======= LAZY MEDIA =======
function initLazyMedia() {
  // images
  const imgs = $$('img[data-src]');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const img = e.target;
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
      obs.unobserve(img);
    });
  }, { rootMargin: '150px' });
  imgs.forEach(img => io.observe(img));

  // videos (pause until visible)
  const vids = $$('video[autoplay]');
  const vo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
    });
  }, { rootMargin: '150px' });
  vids.forEach(v => vo.observe(v));
}

// ======= PRODUCTS GRID (direct WhatsApp) =======
function renderProducts() {
  const grid = $('#productGrid');
  grid.innerHTML = '';

  PRODUCTS.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card fade-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'listitem');

    const media = document.createElement('div');
    media.className = 'card-media hover-bounce';

    if (p.mediaType === 'video') {
      const v = document.createElement('video');
      v.src = p.mediaUrl; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.controls = false;
      v.setAttribute('aria-label', `${p.name} video`);
      media.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = p.mediaPreview || p.mediaUrl; // low-res first
      if (p.mediaPreview) img.setAttribute('data-src', p.mediaUrl);
      img.loading = 'lazy';
      img.alt = p.name;
      media.appendChild(img);
    }

    const titleOverlay = document.createElement('div');
    titleOverlay.className = 'title-overlay';
    titleOverlay.textContent = p.name;
    media.appendChild(titleOverlay);

    const info = document.createElement('div');
    info.className = 'card-info';

    const nameRow = document.createElement('div');
    nameRow.className = 'name-row';
    const nameEl = document.createElement('h3');
    nameEl.className = 'card-name';
    nameEl.textContent = p.name;
    const cat = document.createElement('span');
    cat.className = 'pill';
    cat.textContent = (p.category || 'craft').replace('-', ' ');
    nameRow.append(nameEl, cat);

    const metaRow = document.createElement('div');
    metaRow.className = 'meta-row';
    const priceEl = document.createElement('div');
    priceEl.className = 'price';
    priceEl.textContent = formatINR(p.price);
    const ratingEl = document.createElement('div');
    ratingEl.className = 'rating-stars';
    const rating = p.rating || 4.9;
    ratingEl.setAttribute('aria-label', `Rated ${rating} out of 5`);
    ratingEl.textContent = '★★★★★';

    const buyBtn = document.createElement('button');
    buyBtn.className = 'btn btn-buy';
    buyBtn.type = 'button';
    buyBtn.textContent = 'Buy Now';

    function goWhatsApp() {
      const msg = `Hello, I want to buy the ${p.name} for ${formatINR(p.price)}. \nSee image: ${p.mediaUrl}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeWaMessage(msg)}`;
      const opened = window.open(url, '_blank', 'noopener');
      if (!opened) { showToast('Open WhatsApp and paste your message.'); }
    }

    buyBtn.addEventListener('click', (e) => { e.stopPropagation(); goWhatsApp(); });

    metaRow.append(priceEl, ratingEl, buyBtn);
    info.append(nameRow, metaRow);

    card.addEventListener('click', goWhatsApp);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goWhatsApp(); } });

    card.appendChild(media);
    card.appendChild(info);
    grid.appendChild(card);
  });

  // Attach lazy loader
  initLazyMedia();
  // Reveal animation
  observeFadeCards();
}

function observeFadeCards() {
  const els = $$('.fade-card');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

// ======= TESTIMONIALS =======
const TESTIMONIALS = [
  { name: 'Neha', text: 'Beautiful craftsmanship! The name plate is perfect.', rating: 5 },
  { name: 'Arjun', text: 'They turned my sketch into stunning wall art.', rating: 5 },
  { name: 'Priya', text: 'Quick responses on WhatsApp and great quality.', rating: 4 },
  { name: 'Ravi', text: 'Loved the pet portrait — looks just like our lab!', rating: 5 },
];
let currentSlide = 0; let carouselTimer = 0;
function renderTestimonials() {
  const track = $('#testimonialTrack');
  track.innerHTML = '';
  TESTIMONIALS.forEach(t => {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    const stars = '★★★★★'.slice(0, t.rating) + '☆☆☆☆☆'.slice(0, 5 - t.rating);
    item.innerHTML = `
      <div class="rating" aria-label="${t.rating} out of 5 stars">${stars}</div>
      <blockquote>“${t.text}”</blockquote>
      <div>— ${t.name}</div>
    `;
    track.appendChild(item);
  });
  const trackCount = TESTIMONIALS.length;
  function goTo(i) {
    currentSlide = (i + trackCount) % trackCount;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  const prev = $('.carousel-btn.prev');
  const next = $('.carousel-btn.next');
  prev.addEventListener('click', () => { goTo(currentSlide - 1); restartAuto(); });
  next.addEventListener('click', () => { goTo(currentSlide + 1); restartAuto(); });

  const carousel = $('.carousel');
  function startAuto() { carouselTimer = window.setInterval(() => goTo(currentSlide + 1), 4500); }
  function stopAuto() { window.clearInterval(carouselTimer); }
  function restartAuto() { stopAuto(); startAuto(); }
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  startAuto();
}

// ======= INIT =======
window.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = nowYear();
  applySavedTheme();
  $('#themeToggle').addEventListener('click', toggleTheme);

  initNav();
  initHeroParallax();
  initFloatingLayer();
  renderProducts();
  renderTestimonials();
}); 
