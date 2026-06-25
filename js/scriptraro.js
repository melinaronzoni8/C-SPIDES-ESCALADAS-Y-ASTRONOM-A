/**
 * CÚSPIDES — Motor Frontend Sincronizado
 * Rediseño con Estructuras Apiladas y Animaciones Fluidas.
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initStarCanvasBackground();
  initIntersectionObserverReveal();
  initNumericalCounterEngine();
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
  const canvases = document.querySelectorAll('.star-canvas');
  if (canvases.length === 0) return;

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    let starArray = [];
    const maxStars = 60;

    function setCanvasDimensions() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function createStars() {
      starArray = [];
      for (let i = 0; i < maxStars; i++) {
        starArray.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          alpha: Math.random(),
          speed: 0.02 + Math.random() * 0.03
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      starArray.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }
        ctx.fillStyle = `rgba(236, 237, 235, ${Math.abs(star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      setCanvasDimensions();
      createStars();
    });

    setCanvasDimensions();
    createStars();
    animate();
  });
}

function initIntersectionObserverReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => observer.observe(el));
}

function initNumericalCounterEngine() {
  const counterElements = document.querySelectorAll('.data-value[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseInt(target.getAttribute('data-count'), 10);
        let currentValue = 0;
        const duration = 1500;
        const increment = endValue / (duration / 16);

        const updateCounter = () => {
          currentValue += increment;
          if (currentValue >= endValue) {
            target.textContent = endValue;
          } else {
            target.textContent = Math.floor(currentValue);
            requestAnimationFrame(updateCounter);
          }
        };
        
        requestAnimationFrame(updateCounter);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

function initHeaderScrollAndNavigation() {
  const nav = document.getElementById('main-nav');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('header, section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
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
  });

  heroSection.addEventListener('mouseleave', () => {
    heroImg.style.transform = '';
  });
}

function openWhatsApp() {
  const targetPhone = "5492944000000";
  const customMessage = encodeURIComponent("Hola Cúspides, leí el programa formativo y quiero solicitar una entrevista de postulación.");
  const apiLink = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${customMessage}`;
  window.open(apiLink, '_blank');
}