/**
 * CÚSPIDES — Motor Frontend Sincronizado
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de submotores interactivos
  initReadingProgressBar();
  initStarCanvasBackground();
  initIntersectionObserverReveal();
  initNumericalCounterEngine();
  initEditorialSlider(); // Slider automático integrado
});

function initReadingProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowScrollTop = window.scrollY;
    const totalDocScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (totalDocScrollableHeight > 0) {
      const scrollPercentage = (windowScrollTop / totalDocScrollableHeight) * 100;
      progressBar.style.width = `${scrollPercentage}%`;
    }
  });
}

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
    ctx.fillStyle = '#ECEDEB';
    
    starArray.forEach(star => {
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
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

function initIntersectionObserverReveal() {
  const revealTargets = document.querySelectorAll('[data-reveal]');
  
  const observerConfig = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerConfig);

  revealTargets.forEach(target => revealObserver.observe(target));
}

function initNumericalCounterEngine() {
  const activeCounters = document.querySelectorAll('[data-count]');
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counterElement = entry.target;
        const targetValue = parseInt(counterElement.getAttribute('data-count'), 10);
        let currentValue = 0;
        const speedStep = targetValue / 50;

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
 * MOTOR DE ANIMACIÓN: Slider cíclico cada 5 segundos hacia la izquierda
 */
function initEditorialSlider() {
  const slides = document.querySelectorAll('.slide-img');
  if (slides.length === 0) return;

  let currentIndex = 0;

  setInterval(() => {
    const currentSlide = slides[currentIndex];
    currentSlide.classList.remove('active');
    currentSlide.classList.add('exit');

    currentIndex = (currentIndex + 1) % slides.length;

    const nextSlide = slides[currentIndex];
    nextSlide.classList.remove('exit');
    nextSlide.classList.add('active');

    setTimeout(() => {
      currentSlide.classList.remove('exit');
    }, 800);
    
  }, 5000);
}

function openWhatsApp() {
  const targetPhone = "5492944000000";
  const customMessage = encodeURIComponent("Hola Cúspides, leí el programa formativo y quiero solicitar una entrevista de postulación.");
  const apiLink = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${customMessage}`;
  window.open(apiLink, '_blank');
}