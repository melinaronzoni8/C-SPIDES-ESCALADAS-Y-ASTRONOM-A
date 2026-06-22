/**
 * CÚSPIDES — Motor Frontend Sincronizado
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de submotores interactivos
  initReadingProgressBar();
  initStarCanvasBackground();
  initIntersectionObserverReveal();
  initNumericalCounterEngine();
  initEditorialSlider(); 
});});

/**
 * REGLA DE SCROLL: Modifica dinámicamente el ancho de la barra superior en base al scroll del HTML
 */
function initReadingProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowScrollTop = window.scrollY;
    const totalDocScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (totalDocScrollableHeight > 0) {
      const scrollPercentage = (windowScrollTop / totalDocScrollableHeight) * 100;
      // Modificación de propiedad CSS en vivo
      progressBar.style.width = `${scrollPercentage}%`;
    }
  });
}

/**
 * CANVAS 2D: Renderiza el cielo estrellado dinámico detrás del contenido del Hero
 */
function initStarCanvasBackground() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let starArray = [];
  const maxStars = 100;

  function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    populateStarArray();
  }

  function populateStarArray() {
    starArray = [];
    for (let i = 0; i < maxStars; i++) {
      starArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.3,
        opacity: Math.random(),
        twinkleFactor: 0.006 + Math.random() * 0.01
      });
    }
  }

  function animationLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ECEDEB'; // Código de color oficial blanco técnico
    
    starArray.forEach(star => {
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Simulación de oscilación lumínica atmosférica
      star.opacity += star.twinkleFactor;
      if (star.opacity > 1 || star.opacity < 0) {
        star.twinkleFactor = -star.twinkleFactor;
      }
    });
    
    requestAnimationFrame(animationLoop);
  }

  window.addEventListener('resize', setCanvasDimensions);
  setCanvasDimensions();
  animationLoop();
}

/**
 * REGLA EXPLICADA: El JS escanea el sitio buscando [data-reveal].
 * Cuando detecta mediante scroll que entró en pantalla, le inyecta la clase .is-visible de CSS.
 */
function initIntersectionObserverReveal() {
  const revealTargets = document.querySelectorAll('[data-reveal]');
  
  const observerConfig = {
    root: null, // Viewport del navegador
    threshold: 0.12, // Se activa cuando el 12% del bloque entra al campo visual
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // SE INYECTA LA CLASE AL ELEMENTO DEL HTML
        entry.target.classList.add('is-visible');
        // Deja de observarlo para ahorrar rendimiento
        observer.unobserve(entry.target);
      }
    });
  }, observerConfig);

  revealTargets.forEach(target => revealObserver.observe(target));
}

/**
 * REGLA EXPLICADA: El JS lee el atributo data-count e incrementa el número en pantalla
 */
function initNumericalCounterEngine() {
  const activeCounters = document.querySelectorAll('[data-count]');
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counterElement = entry.target;
        const targetValue = parseInt(counterElement.getAttribute('data-count'), 10);
        let currentValue = 0;
        const speedStep = targetValue / 50; // Divide el incremento de forma progresiva

        function runAnimation() {
          currentValue += speedStep;
          if (currentValue < targetValue) {
            counterElement.textContent = Math.floor(currentValue);
            requestAnimationFrame(runAnimation);
          } else {
            counterElement.textContent = targetValue;
          }
        }
        
        runAnimation();
        observer.unobserve(counterElement);
      }
    });
  }, { threshold: 0.6 });

  activeCounters.forEach(counter => counterObserver.observe(counter));
}

/**
 * ENRUTAMIENTO WHATSAPP (CRO)
 */
function openWhatsApp() {
  const targetPhone = "5492944000000"; // Código de Bariloche, Argentina
  const customMessage = encodeURIComponent("Hola Cúspides, leí el programa formativo y quiero solicitar una entrevista de postulación para los cupos de la expedición.");
  const apiLink = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${customMessage}`;
  
  window.open(apiLink, '_blank');
}
/**
 * MOTOR DE ANIMACIÓN: Slider cíclico cada 5 segundos hacia la izquierda
 */
function initEditorialSlider() {
  const slides = document.querySelectorAll('.slide-img');
  if (slides.length === 0) return;

  let currentIndex = 0;

  setInterval(() => {
    // 1. Imagen actual pasa a estado de salida (se desliza a la izquierda)
    const currentSlide = slides[currentIndex];
    currentSlide.classList.remove('active');
    currentSlide.classList.add('exit');

    // 2. Calculamos el índice del siguiente frame de forma cíclica
    currentIndex = (currentIndex + 1) % slides.length;

    // 3. La nueva imagen se prepara y pasa a estar activa
    const nextSlide = slides[currentIndex];
    nextSlide.classList.remove('exit');
    nextSlide.classList.add('active');

    // Limpieza: Tras terminar la animación, removemos la clase de salida
    setTimeout(() => {
      currentSlide.classList.remove('exit');
    }, 800); // Sincronizado con los 0.8s del CSS
    
  }, 5000); // Intervalo estricto de 5 segundos
}