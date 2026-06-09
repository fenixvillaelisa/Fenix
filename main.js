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

// ─── Lightbox ───
let lbItems = [];
let lbIndex = 0;

function openLightbox(el) {
  lbItems = Array.from(document.querySelectorAll('.galeria-item img'));
  lbIndex = lbItems.indexOf(el.querySelector('img'));
  showLightboxImg();
  const lb = document.getElementById('lightbox');
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function showLightboxImg() {
  const img = lbItems[lbIndex];
  document.getElementById('lb-img').src = img.src;
  document.getElementById('lb-img').alt = img.alt;
  // Solo muestra el contador, sin nombre de archivo
  document.getElementById('lb-counter').textContent = (lbIndex + 1) + ' / ' + lbItems.length;
}
function navLightbox(dir) {
  lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
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

// ─── Scroll fade-in ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
