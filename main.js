// ─── Nav: transparente → azul opaco progresivo al hacer scroll ───
const mainNav = document.getElementById('main-nav');
const NAV_START = 40;   // px desde donde empieza a opacarse
const NAV_END   = 220;  // px donde llega a 100% opacidad

function updateNav() {
  const y = window.scrollY;

  if (y <= NAV_START) {
    // Totalmente transparente
    mainNav.style.background = 'transparent';
    mainNav.style.boxShadow  = 'none';
    mainNav.classList.add('nav-transparent');
    mainNav.classList.remove('nav-solid');
  } else if (y >= NAV_END) {
    // Totalmente sólido
    mainNav.style.background = '';
    mainNav.style.boxShadow  = '';
    mainNav.classList.remove('nav-transparent');
    mainNav.classList.add('nav-solid');
  } else {
    // Zona de transición: interpolar opacidad 0 → 1
    const progress = (y - NAV_START) / (NAV_END - NAV_START);
    const alpha    = Math.round(progress * 97) / 100; // 0.00 → 0.97
    mainNav.style.background = `rgba(10,42,94,${alpha})`;
    mainNav.style.boxShadow  = progress > 0.3
      ? `0 2px 20px rgba(0,0,0,${progress * 0.35})`
      : 'none';
    mainNav.classList.remove('nav-transparent', 'nav-solid');
  }

  // Links y logo: blanco siempre (sobre fondo oscuro o transparente en hero azul)
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // estado inicial

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
