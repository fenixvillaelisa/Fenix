// ─── Nav: transparente → azul opaco progresivo al hacer scroll ───
const mainNav = document.getElementById('main-nav');
const NAV_START = 20;   // px desde donde empieza a opacarse
const NAV_END   = 160;  // px donde llega a 100% opacidad (rápido)

function updateNav() {
  const y = window.scrollY;
  let alpha;

  if (y <= NAV_START) {
    alpha = 0;
  } else if (y >= NAV_END) {
    alpha = 1;
  } else {
    alpha = (y - NAV_START) / (NAV_END - NAV_START);
  }

  // Fondo: de transparente a azul oscuro
  mainNav.style.background = alpha === 0
    ? 'transparent'
    : `rgba(10,42,94,${alpha.toFixed(2)})`;

  // Sombra aparece gradualmente
  mainNav.style.boxShadow = alpha > 0.2
    ? `0 2px 20px rgba(0,0,0,${(alpha * 0.35).toFixed(2)})`
    : 'none';

  // Links y logo: SIEMPRE blancos, sin importar el estado
  // (se fuerza via CSS con !important, no se toca desde JS)
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ─── Hamburger menu ───
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ─── Lámpara colgante: modo nocturno ───
const lampToggle = document.getElementById('lamp-toggle');

function applyTheme(night) {
  document.body.classList.toggle('night', night);
  lampToggle.setAttribute('aria-pressed', night);
  lampToggle.setAttribute('aria-label', night ? 'Prender la luz (modo día)' : 'Apagar la luz (modo nocturno)');
  lampToggle.title = night ? '¡Prendé la luz!' : '¡Probá apagar la luz!';
}

lampToggle.addEventListener('click', () => {
  const night = !document.body.classList.contains('night');
  applyTheme(night);
  try { localStorage.setItem('fenix-theme', night ? 'night' : 'day'); } catch (e) {}
});

try {
  if (localStorage.getItem('fenix-theme') === 'night') applyTheme(true);
} catch (e) {}

// ─── Lightbox ───
// La galería muestra 5 fotos, pero el lightbox recorre el catálogo completo
const GALLERY_IMAGES = Array.from({ length: 25 }, (_, i) => 'images/producto' + (i + 1) + '.jpg');
let lbIndex = 0;

function openLightbox(el) {
  const src = el.querySelector('img').getAttribute('src');
  lbIndex = Math.max(0, GALLERY_IMAGES.indexOf(src));
  showLightboxImg();
  const lb = document.getElementById('lightbox');
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function showLightboxImg() {
  document.getElementById('lb-img').src = GALLERY_IMAGES[lbIndex];
  document.getElementById('lb-img').alt = 'Producto Fenix Iluminación';
  // Solo muestra el contador, sin nombre de archivo
  document.getElementById('lb-counter').textContent = (lbIndex + 1) + ' / ' + GALLERY_IMAGES.length;
}
function navLightbox(dir) {
  lbIndex = (lbIndex + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  showLightboxImg();
}
function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (lb.style.display === 'none') return;
  if (e.key === 'ArrowRight') navLightbox(1);
  if (e.key === 'ArrowLeft')  navLightbox(-1);
  if (e.key === 'Escape')     closeLightbox();
});

// Deslizar con el dedo para pasar de foto (mobile)
(function () {
  const lb = document.getElementById('lightbox');
  let startX = null;
  lb.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) navLightbox(dx < 0 ? 1 : -1);
    startX = null;
  }, { passive: true });
})();

// ─── Carrusel de reseñas ───
let resenaIndex = 0;
const resenasTrack = document.getElementById('resenas-track');
const resenaDots = document.querySelectorAll('.resena-dot');
const RESENAS_TOTAL = resenaDots.length;
let resenaTimer = null;

function goResena(i, manual = true) {
  resenaIndex = (i + RESENAS_TOTAL) % RESENAS_TOTAL;
  resenasTrack.style.transform = 'translateX(-' + (resenaIndex * 100) + '%)';
  resenaDots.forEach((d, j) => d.classList.toggle('active', j === resenaIndex));
  if (manual) startResenaTimer();
}
function startResenaTimer() {
  clearInterval(resenaTimer);
  resenaTimer = setInterval(() => goResena(resenaIndex + 1, false), 6000);
}
if (resenasTrack) {
  startResenaTimer();
  const viewport = document.getElementById('resenas-viewport');
  viewport.addEventListener('mouseenter', () => clearInterval(resenaTimer));
  viewport.addEventListener('mouseleave', startResenaTimer);
  let swipeX = null;
  viewport.addEventListener('touchstart', (e) => { swipeX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (swipeX === null) return;
    const dx = e.changedTouches[0].clientX - swipeX;
    if (Math.abs(dx) > 40) goResena(resenaIndex + (dx < 0 ? 1 : -1));
    swipeX = null;
  }, { passive: true });
}

// ─── Scroll fade-in ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
