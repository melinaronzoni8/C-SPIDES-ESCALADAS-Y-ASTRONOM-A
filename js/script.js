/**
 * CÚSPIDES — Motor Frontend Sincronizado
 * Rediseño con Secciones de Navegación, Efecto Scroll, Micro-Parallax e Ícono de Usuario Ajustado.
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initStarCanvasBackground();
  initIntersectionObserverReveal();
  initNumericalCounterEngine();
  initEditorialSlider();
  initHeaderScrollAndNavigation();
  initHeroParallaxInteraction();
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

function initHeaderScrollAndNavigation() {
  const mainNav = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      const expanded = menuToggle.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', expanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function initHeroParallaxInteraction() {
  const heroSection = document.getElementById('hero');
  const heroImg = document.getElementById('heroZoomImg');
  
  if (!heroSection || !heroImg) return;

  heroSection.addEventListener('mousemove', (e) => {
    const { width, height } = heroSection.getBoundingClientRect();
    const mouseX = e.clientX - (heroSection.offsetLeft + width / 2);
    const mouseY = e.clientY - (heroSection.offsetTop + height / 2);

    const moveX = (mouseX / (width / 2)) * 12;
    const moveY = (mouseY / (height / 2)) * 12;

    heroImg.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px)`;
    heroImg.classList.remove('standard-zoom');
  });

  heroSection.addEventListener('mouseleave', () => {
    heroImg.style.transform = '';
    heroImg.classList.add('standard-zoom');
  });
}

function openWhatsApp() {
  const targetPhone = "5492944000000";
  const customMessage = encodeURIComponent("Hola Cúspides, leí el programa formativo y quiero solicitar una entrevista de postulación.");
  const apiLink = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${customMessage}`;
  window.open(apiLink, '_blank');
}