/**
 * CÚSPIDES — Motor Interactivo de Conversión 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollTracker();
  initInteractiveScrollSparks(); 
  initConversionObserver();
  initDynamicCounters();
});

function initScrollTracker() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const rawScroll = window.scrollY;
    const scrollableLimit = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollableLimit > 0) {
      const globalPercent = (rawScroll / scrollableLimit) * 100;
      bar.style.width = `${globalPercent}%`;
    }
  });
}

/**
 * Generador óptico de destellos sutiles basados en desplazamiento vertical
 */
function initInteractiveScrollSparks() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let sparks = [];
  let lastScrollY = window.scrollY;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
  }

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    
    if (delta > 1) {
      const sparkCount = Math.min(Math.floor(delta / 4), 4);
      for (let i = 0; i < sparkCount; i++) {
        sparks.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.35), 
          size: 0.6 + Math.random() * 1.6,
          alpha: 1,
          speedY: -0.3 - Math.random() * 0.7, 
          speedX: (Math.random() - 0.5) * 0.3,
          decay: 0.012 + Math.random() * 0.02
        });
      }
    }
    lastScrollY = currentScrollY;
  });

  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = '#E8D2F5'; 
      
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      s.x += s.speedX;
      s.y += s.speedY;
      s.alpha -= s.decay;
      
      if (s.alpha <= 0) {
        sparks.splice(i, 1);
      }
    }
    
    requestAnimationFrame(renderLoop);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  renderLoop();
}

function initConversionObserver() {
  const items = document.querySelectorAll('[data-reveal]');
  const options = { threshold: 0.1, rootMargin: '0px 0px -30px 0px' };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, options);

  items.forEach(item => observer.observe(item));
}

function initDynamicCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        let current = 0;
        const step = target / 40;

        function animate() {
          current += step;
          if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(animate);
          } else {
            el.textContent = target;
          }
        }
        animate();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));
}

function openWhatsApp() {
  const phone = "5492944000000"; 
  const msg = encodeURIComponent("Hola Cúspides, cumplo con el perfil de escalador/trekker experto. Quiero consultar la disponibilidad de cupos y las fechas de los próximos cursos.");
  window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, '_blank');
}