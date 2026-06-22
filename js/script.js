/**
 * CÚSPIDES — Motor Interactivo de Conversión 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollTracker();
  initAtmosphericStars();
  initConversionObserver();
  initDynamicCounters();
});

/**
 * 1. Control en vivo del progreso superior
 */
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
 * 2. Canvas de Estrellas de Fondo (Render sutil sobre Hex #020120)
 */
function initAtmosphericStars() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let stardust = [];
  const totalStars = 90;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setup();
  }

  function setup() {
    stardust = [];
    for (let i = 0; i < totalStars; i++) {
      stardust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.1,
        o: Math.random(),
        factor: 0.004 + Math.random() * 0.008
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    
    stardust.forEach(star => {
      ctx.globalAlpha = star.o;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      
      star.o += star.factor;
      if (star.o > 1 || star.o < 0) {
        star.factor = -star.factor;
      }
    });
    
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
}

/**
 * 3. Intersection Observer: Inyección de la clase .is-visible ante el Scroll
 */
function initConversionObserver() {
  const items = document.querySelectorAll('[data-reveal]');
  
  const options = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

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

/**
 * 4. Motor de Animación Numérica Lineal
 */
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

/**
 * Redirección Estratégica CRO
 */
function openWhatsApp() {
  const phone = "5492944000000"; 
  const msg = encodeURIComponent("Hola Cúspides, cumplo con el perfil de escalador/trekker experto. Quiero consultar la disponibilidad de cupos y las fechas de los próximos cursos.");
  window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, '_blank');
}