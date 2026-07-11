/**
 * CÚSPIDES — Motor Frontend Sincronizado
 * Rediseño con Secciones de Navegación, Efecto Scroll, Micro-Parallax e Ícono de Usuario Ajustado.
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initCuspidesEquipmentInteractivity();
  initStarCanvasBackground();
  initIntersectionObserverReveal();
  initNumericalCounterEngine();
  initEditorialSlider();
  initHeaderScrollAndNavigation();
  //initHeroParallaxInteraction();
  initAccordionTimeline(); 
  initCuspidesExpeditionsSlider();
  initCourseCardFlipEngine();
  initScrollytellingAnimation(); 
});

function initReadingProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowScrollTop = window.scrollY;
    const totalDocScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (totalDocScrollableHeight > 0) {
      // Calcula el progreso y mueve la barra horizontal del encabezado
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
    let animationFrameId = null;
    let isAnimating = false;
    let activeConstellation = null;
    let constellationCooldown = 100 + Math.random() * 150;

    function setCanvasDimensions() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      populateStarArray();
    }

    function populateStarArray() {
      starArray = [];
      for (let i = 0; i < maxStars; i++) {
        starArray.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 0.4 + Math.random() * 1.4,
          opacity: Math.random(),
          twinkleFactor: 0.006 + Math.random() * 0.01,
          isConstellationNode: false,
          originalSize: 0,
          targetSize: 0
        });
      }
      activeConstellation = null;
    }

    function triggerConstellation() {
      if (starArray.length < 15) return;

      let seedIndex = Math.floor(Math.random() * starArray.length);
      let seed = starArray[seedIndex];
      let attempts = 0;
      while ((seed.x < 50 || seed.x > canvas.width - 50 || seed.y < 50 || seed.y > canvas.height - 50) && attempts < 10) {
        seedIndex = Math.floor(Math.random() * starArray.length);
        seed = starArray[seedIndex];
        attempts++;
      }

      const neighbors = starArray.map((star, idx) => ({ 
        star, 
        idx, 
        dist: Math.hypot(star.x - seed.x, star.y - seed.y) 
      }))
      .filter(n => n.dist > 30 && n.dist < 220 && !n.star.isConstellationNode)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 4);

      if (neighbors.length < 2) {
        constellationCooldown = 100;
        return;
      }

      const constellationStars = [seed, ...neighbors.map(n => n.star)];
      constellationStars.sort((a, b) => a.x - b.x);

      const lines = [];
      for (let i = 0; i < constellationStars.length - 1; i++) {
        lines.push({
          from: constellationStars[i],
          to: constellationStars[i + 1],
          progress: 0
        });
      }

      constellationStars.forEach(star => {
        star.isConstellationNode = true;
        star.originalSize = star.size;
        star.targetSize = Math.max(star.size * 2.2, 2.5);
      });

      activeConstellation = {
        stars: constellationStars,
        lines: lines,
        phase: 'drawing',
        currentLineIndex: 0,
        visibleTimer: 180,
        opacity: 0.7
      };
    }

    function animationLoop() {
      if (!isAnimating) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      starArray.forEach(star => {
        if (star.isConstellationNode && activeConstellation) {
          if (activeConstellation.phase === 'drawing' || activeConstellation.phase === 'visible') {
            star.size += (star.targetSize - star.size) * 0.08;
          }
        }

        ctx.fillStyle = '#ECEDEB';
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.isConstellationNode && activeConstellation) {
          ctx.fillStyle = '#7CA5C1';
          ctx.globalAlpha = star.opacity * activeConstellation.opacity * 0.45;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        star.opacity += star.twinkleFactor;
        if (star.opacity > 1 || star.opacity < 0) {
          star.twinkleFactor = -star.twinkleFactor;
        }
      });

      if (activeConstellation) {
        ctx.strokeStyle = '#7CA5C1';
        ctx.lineWidth = 0.75;

        activeConstellation.lines.forEach((line, index) => {
          ctx.globalAlpha = activeConstellation.opacity;
          if (index < activeConstellation.currentLineIndex) {
            ctx.beginPath();
            ctx.moveTo(line.from.x, line.from.y);
            ctx.lineTo(line.to.x, line.to.y);
            ctx.stroke();
          } else if (index === activeConstellation.currentLineIndex) {
            ctx.beginPath();
            ctx.moveTo(line.from.x, line.from.y);
            const targetX = line.from.x + (line.to.x - line.from.x) * line.progress;
            const targetY = line.from.y + (line.to.y - line.from.y) * line.progress;
            ctx.lineTo(targetX, targetY);
            ctx.stroke();

            line.progress += 0.045;
            if (line.progress >= 1) {
              line.progress = 1;
              activeConstellation.currentLineIndex++;
            }
          }
        });

        if (activeConstellation.phase === 'drawing') {
          if (activeConstellation.currentLineIndex >= activeConstellation.lines.length) {
            activeConstellation.phase = 'visible';
          }
        } else if (activeConstellation.phase === 'visible') {
          activeConstellation.visibleTimer--;
          if (activeConstellation.visibleTimer <= 0) {
            activeConstellation.phase = 'fading';
          }
        } else if (activeConstellation.phase === 'fading') {
          activeConstellation.opacity -= 0.015;
          
          activeConstellation.stars.forEach(star => {
            if (star.size > star.originalSize) {
              star.size -= (star.size - star.originalSize) * 0.08;
            }
          });

          if (activeConstellation.opacity <= 0) {
            activeConstellation.stars.forEach(star => {
              star.isConstellationNode = false;
              star.size = star.originalSize;
            });
            activeConstellation = null;
            constellationCooldown = 400 + Math.random() * 400;
          }
        }
      } else {
        if (constellationCooldown > 0) {
          constellationCooldown--;
        } else {
          triggerConstellation();
        }
      }

      animationFrameId = requestAnimationFrame(animationLoop);
    }

    function startAnimation() {
      if (isAnimating) return;
      isAnimating = true;
      animationLoop();
    }

    function stopAnimation() {
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }

    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      });
    }, { threshold: 0.02 });

    observer.observe(canvas);
  });
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

// ==========================================================================
// MOTOR DEL ACORDEÓN: DETERMINACIÓN DE ALTURA TOTAL REAL (EVITA RECORTES)
// ==========================================================================
function initAccordionTimeline() {
  const items = document.querySelectorAll('.timeline-item-stack');
  if (items.length === 0) return;
  
  items.forEach(item => {
    const header = item.querySelector('.stack-header');
    const content = item.querySelector('.stack-content');
    
    if (!header || !content) return;
    
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.stack-content');
        if (otherContent) {
          otherContent.style.maxHeight = null;
        }
      });
      
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

function initCuspidesExpeditionsSlider() {
  const track = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  
  // Si los elementos no existen en el HTML actual, salimos para evitar errores en consola
  if (!track || !prevBtn || !nextBtn) return;

  const items = Array.from(track.children);
  if (items.length === 0) return;
  
  let currentIndex = 0;

  // Evalúa de forma dinámica cuántas tarjetas se ven en pantalla según el ancho del navegador
  function getVisibleItemsCount() {
    const width = window.innerWidth;
    if (width <= 768) return 1;  // Mobile: 1 imagen visible
    if (width <= 1100) return 2; // Tablet: 2 imágenes visibles
    return 4;                    // Desktop: 4 columnas según tu regla CSS (.gallery-grid)
  }

  // Realiza el desplazamiento exacto recalculando dimensiones fluidas
  function updateSliderPosition() {
    const visibleItems = getVisibleItemsCount();
    const maxIndex = items.length - visibleItems;
    
    // Forzar límites seguros
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    // Medimos el ancho real de una sola tarjeta en este instante
    const itemWidth = items[0].getBoundingClientRect().width;
    
    // Leemos el valor real de 'gap' puesto por CSS (si no lee nada, usa 24px de respaldo)
    const computedStyles = window.getComputedStyle(track);
    const gap = parseFloat(computedStyles.gap) || 24; 
    
    // Fórmula matemática: posición actual * (ancho del elemento + separación)
    const totalMove = currentIndex * (itemWidth + gap);
    track.style.transform = `translateX(-${totalMove}px)`;
  }

  // Escuchador del botón Siguiente
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Evita cualquier salto de página no deseado
    const visibleItems = getVisibleItemsCount();
    const maxIndex = items.length - visibleItems;
    
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Al llegar al final, vuelve al inicio de manera cíclica
    }
    updateSliderPosition();
  });

  // Escuchador del botón Anterior
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const visibleItems = getVisibleItemsCount();
    const maxIndex = items.length - visibleItems;

    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex; // Si retrocede en el inicio, salta al final del carrusel
    }
    updateSliderPosition();
  });

  // Ajusta la posición de forma fluida si el usuario cambia el tamaño o rota la pantalla
  window.addEventListener('resize', updateSliderPosition);
}
/**
 * MOTOR INTERACTIVO DE ELEMENTOS PROVISTOS - CÚSPIDES
 * Previene bugs y asegura compatibilidad táctil en tablets o dispositivos híbridos.
 */
function initCuspidesEquipmentInteractivity() {
  const nodes = document.querySelectorAll('.interactive-node');
  if(nodes.length === 0) return;
  
  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      if(window.innerWidth > 850) {
        e.stopPropagation();
      }
    });
  });
}
// CONTROL DE ROTACIÓN FIJA DE TARJETAS AL HACER CLIC
document.querySelectorAll('.curso-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Si el usuario hace clic específicamente en el botón "Saber más", dejamos que actúe su enlace
    if (e.target.closest('.btn-saber-mas') || e.target.closest('.card-btn')) {
      return; 
    }
    
    // Conmutamos la clase 'is-flipped' en la tarjeta para mantenerla volteada
    this.classList.toggle('is-flipped');
  });
});
/**
 * MOTOR DE INTERACTIVIDAD DE TARJETAS (CURSOS)
 * Permite el giro automático con hover, y congela la posición dada vuelta al hacer clic.
 */
function initCourseCardFlipEngine() {
  // Selecciona el contenedor interactivo exterior de la tarjeta
  const cards = document.querySelectorAll('.course-card-container');
  
  if (cards.length === 0) return;

  cards.forEach(card => {
    // Busca la pieza interna que posee el efecto de rotación 3D
    const innerCard = card.querySelector('.course-card-inner');
    
    if (!innerCard) return;

    card.addEventListener('click', (e) => {
      // Si el clic fue en un botón, enlace o elemento interactivo del reverso, no altera el giro
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('form')) {
        return; 
      }

      // Alterna la clase que congela el reverso de la tarjeta expuesto
      innerCard.classList.toggle('is-locked');
    });
  });
}
function initScrollytellingAnimation() {
    const geSection = document.getElementById('granexperiencia');
    if (!geSection) return;

    // Elementos internos de la sección
    const geBgContainer = geSection.querySelector('.ge-sticky-visual-box');
    const geBgTarget = document.getElementById('ge-bg-target');
    const geClimber = document.getElementById('ge-climber');
    const geCards = geSection.querySelectorAll('.ge-glass-card');

    const handleGeScroll = () => {
        const rect = geSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // 1. MOTOR DE ESTADOS (Fijación Dinámica)
        if (rect.top > 0) {
            // Usuario arriba de la sección -> El fondo se queda arriba (Absolute)
            geBgContainer.classList.remove('is-fixed', 'is-bottom');
        } else if (rect.top <= 0 && rect.bottom >= windowHeight) {
            // Usuario scroleando adentro -> Fondo anclado a pantalla (Fixed)
            geBgContainer.classList.add('is-fixed');
            geBgContainer.classList.remove('is-bottom');
        } else if (rect.bottom < windowHeight) {
            // Usuario pasó la sección -> Fondo retenido al final (Absolute Bottom)
            geBgContainer.classList.remove('is-fixed');
            geBgContainer.classList.add('is-bottom');
        }

        // 2. CÁLCULO DE PROGRESO DE LA SECCIÓN (Valor lineal suave de 0 a 1)
        const totalScrollableHeight = rect.height - windowHeight;
        const currentScroll = Math.abs(rect.top);
        const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableHeight));

        // 3. ANIMACIÓN DE CAPAS (Transición de Opacidad de Día a Noche)
        if (geBgTarget) {
            // Cambia el fondo del 0% al 80% del recorrido para un efecto inmersivo lento
            let backgroundProgress = progress / 0.8;
            backgroundProgress = Math.max(0, Math.min(1, backgroundProgress));
            geBgTarget.style.opacity = backgroundProgress;
        }

        // 4. MOVIMIENTO SÍNCRONO DEL ESCALADOR
        if (geClimber) {
            // Comienza arriba en 10% y baja hasta el 75% del alto de la ventana según progresas
            const startTop = 10; 
            const endTop = 75;
            const currentTop = startTop + (progress * (endTop - startTop));
            geClimber.style.top = `${currentTop}vh`; // Usamos vh para mantener consistencia con la pantalla
        }

        // 5. CONTROL DE ENTRADA / SALIDA DE LAS TARJETAS GLASSMORPHISM
        geCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            // Se activa cuando la tarjeta está al 75% de la pantalla y se oculta si ya pasó de largo hacia arriba
            if (cardTop < windowHeight * 0.75 && cardTop > -100) {
                card.classList.add('card-visible');
            } else {
                card.classList.remove('card-visible');
            }
        });
    };

    // Escuchamos el scroll usando requestAnimationFrame para máxima fluidez a 60fps
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(handleGeScroll);
    }, { passive: true });

    // Ejecución inicial por si la página carga a mitad de camino
    handleGeScroll();
}