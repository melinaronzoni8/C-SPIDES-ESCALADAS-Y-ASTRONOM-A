/**
 * CÚSPIDES — Motor de Interacciones y Animaciones Técnicas Premium 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initStarCanvas();
  initIntersectionObserver();
  initCounterAnimation();
});

/**
 * 1. Barra superior indicadora de lectura y scroll
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });
}

/**
 * 2. Canvas de Estrellas Dinámicas en Sección Hero
 */
function initStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let stars = [];
  const numStars = 120;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
  }

  function generateStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        speed: 0.005 + Math.random() * 0.01
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ECEDEB';
    
    stars.forEach(star => {
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Animación de titileo científico sutil
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0) {
        star.speed = -star.speed;
      }
    });
    
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  draw();
}

/**
 * 3. Animaciones Premium con Intersection Observer (Reveals & Fades)
 */
function initIntersectionObserver() {
  const elementsToReveal = document.querySelectorAll('[data-reveal], [data-reveal-text], [data-reveal-lateral]');
  
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Estilos en línea controlados para fluidez óptima (alternativa limpia a librerías pesadas)
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToReveal.forEach(el => {
    // Configuración inicial de estados invisibles controlados por JS
    el.style.opacity = '0';
    if (el.hasAttribute('data-reveal-lateral')) {
      el.style.transform = 'translateX(30px)';
    } else {
      el.style.transform = 'translateY(25px)';
    }
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/**
 * 4. Animación de Contadores de Datos Técnicos en el Hero
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseInt(target.getAttribute('data-count'), 10);
        let startValue = 0;
        const duration = 1500; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          if (elapsedTime < duration) {
            const progress = elapsedTime / duration;
            // Easing de salida OutQuad
            const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
            target.textContent = currentValue;
            requestAnimationFrame(updateCounter);
          } else {
            target.textContent = endValue;
          }
        }
        
        requestAnimationFrame(updateCounter);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => countObserver.observe(counter));
}

/**
 * 5. CRO Enrutamiento Estratégico Directo a WhatsApp
 */
function openWhatsApp() {
  const telefono = "5492944000000"; // Reemplazar por tu número real de Bariloche con código de área
  const mensaje = encodeURIComponent("Hola Cúspides, me interesa recibir más información sobre el Programa Integral de Exploración Científica y Astronomía.");
  const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${mensaje}`;
  window.open(url, '_blank');
}