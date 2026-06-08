// ─── Lightbox ───
  let lbItems = [];
  let lbIndex = 0;

  function openLightbox(el) {
    const img = el.querySelector('img');
    // Recolectar todas las imágenes de galería
    lbItems = Array.from(document.querySelectorAll('.galeria-item img'));
    lbIndex = lbItems.indexOf(img);
    showLightboxImg();
    const lb = document.getElementById('lightbox');
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function showLightboxImg() {
    const img = lbItems[lbIndex];
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-img').alt = img.alt;
    document.getElementById('lb-caption').textContent = img.alt;
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

  // Navegar con teclado
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (lb.style.display === 'none') return;
    if (e.key === 'ArrowRight') navLightbox(1);
    if (e.key === 'ArrowLeft')  navLightbox(-1);
    if (e.key === 'Escape')     closeLightbox();
  });

  // ─── Hamburger menu ───
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
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

  // ─── Scroll fade-in ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
