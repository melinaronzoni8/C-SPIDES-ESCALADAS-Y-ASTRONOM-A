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
  initAccordionTimeline(); 
  initDynamicCourseButtons(); 
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
    let animationFrameId = null;
    let isAnimating = false;
    let activeConstellation = null;
    let constellationCooldown = 100 + Math.random() * 150; // frames before first constellation (~2-4 seconds)

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
          size: 0.4 + Math.random() * 1.4, // Slightly larger and more visible (was Math.random() * 1.3)
          opacity: Math.random(),
          twinkleFactor: 0.006 + Math.random() * 0.01,
          isConstellationNode: false,
          originalSize: 0,
          targetSize: 0
        });
      }
      activeConstellation = null; // reset active constellation on resize
    }

    function triggerConstellation() {
      if (starArray.length < 15) return;

      // Pick a random seed star that is not too close to the borders
      let seedIndex = Math.floor(Math.random() * starArray.length);
      let seed = starArray[seedIndex];
      let attempts = 0;
      while ((seed.x < 50 || seed.x > canvas.width - 50 || seed.y < 50 || seed.y > canvas.height - 50) && attempts < 10) {
        seedIndex = Math.floor(Math.random() * starArray.length);
        seed = starArray[seedIndex];
        attempts++;
      }

      // Find stars near the seed (distance between 40px and 220px)
      const neighbors = starArray.map((star, idx) => ({ 
        star, 
        idx, 
        dist: Math.hypot(star.x - seed.x, star.y - seed.y) 
      }))
      .filter(n => n.dist > 30 && n.dist < 220 && !n.star.isConstellationNode)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 4); // Take up to 4 nearest neighbors

      if (neighbors.length < 2) {
        // Not enough neighbors, wait a bit and try again
        constellationCooldown = 100;
        return;
      }

      const constellationStars = [seed, ...neighbors.map(n => n.star)];

      // Sort stars by X coordinate so the lines flow nicely from left to right
      constellationStars.sort((a, b) => a.x - b.x);

      // Create sequential lines connecting the sorted stars
      const lines = [];
      for (let i = 0; i < constellationStars.length - 1; i++) {
        lines.push({
          from: constellationStars[i],
          to: constellationStars[i + 1],
          progress: 0
        });
      }

      // Configure stars to grow and glow
      constellationStars.forEach(star => {
        star.isConstellationNode = true;
        star.originalSize = star.size;
        star.targetSize = Math.max(star.size * 2.2, 2.5); // Ensure a good size for the main nodes
      });

      activeConstellation = {
        stars: constellationStars,
        lines: lines,
        phase: 'drawing', // 'drawing' | 'visible' | 'fading'
        currentLineIndex: 0,
        visibleTimer: 180, // frames to remain visible (~3 seconds)
        opacity: 0.7 // target opacity of lines
      };
    }

    function animationLoop() {
      if (!isAnimating) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw regular stars (and glow for constellation nodes)
      starArray.forEach(star => {
        // Interpolate size if it is a constellation node
        if (star.isConstellationNode && activeConstellation) {
          if (activeConstellation.phase === 'drawing' || activeConstellation.phase === 'visible') {
            star.size += (star.targetSize - star.size) * 0.08; // smooth grow
          }
        }

        ctx.fillStyle = '#ECEDEB';
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw a soft outer glow for constellation nodes
        if (star.isConstellationNode && activeConstellation) {
          ctx.fillStyle = '#7CA5C1'; // Beautiful light blue glow matching site accent
          ctx.globalAlpha = star.opacity * activeConstellation.opacity * 0.45;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star twinkle animation
        star.opacity += star.twinkleFactor;
        if (star.opacity > 1 || star.opacity < 0) {
          star.twinkleFactor = -star.twinkleFactor;
        }
      });

      // 2. Animate and draw constellation lines
      if (activeConstellation) {
        ctx.strokeStyle = '#7CA5C1'; // Light blue line matching design accent
        ctx.lineWidth = 0.75; // thin line

        activeConstellation.lines.forEach((line, index) => {
          ctx.globalAlpha = activeConstellation.opacity;
          if (index < activeConstellation.currentLineIndex) {
            // Fully drawn line
            ctx.beginPath();
            ctx.moveTo(line.from.x, line.from.y);
            ctx.lineTo(line.to.x, line.to.y);
            ctx.stroke();
          } else if (index === activeConstellation.currentLineIndex) {
            // Currently drawing line
            ctx.beginPath();
            ctx.moveTo(line.from.x, line.from.y);
            const targetX = line.from.x + (line.to.x - line.from.x) * line.progress;
            const targetY = line.from.y + (line.to.y - line.from.y) * line.progress;
            ctx.lineTo(targetX, targetY);
            ctx.stroke();

            // Advance drawing progress
            line.progress += 0.045; // drawing speed
            if (line.progress >= 1) {
              line.progress = 1;
              activeConstellation.currentLineIndex++;
            }
          }
        });

        // 3. Constellation lifecycle phases
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
          
          // Smoothly return stars back to original size
          activeConstellation.stars.forEach(star => {
            if (star.size > star.originalSize) {
              star.size -= (star.size - star.originalSize) * 0.08;
            }
          });

          if (activeConstellation.opacity <= 0) {
            // Clean up node states
            activeConstellation.stars.forEach(star => {
              star.isConstellationNode = false;
              star.size = star.originalSize;
            });
            activeConstellation = null;
            constellationCooldown = 400 + Math.random() * 400; // frames before next one (~10-15s)
          }
        }
      } else {
        // Cooldown timer
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
  // Cambia .timeline-item-stack por .timeline-item
  const timelineItems = document.querySelectorAll('.timeline-item'); 
  
  timelineItems.forEach(item => {
    // Si tienes un título o cabecera que hace de disparador (trigger) dentro del item
    const trigger = item.querySelector('.timeline-content'); 
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const content = item.querySelector('.stack-content');
      if (!content) return;

      const isOpen = item.classList.contains('active');
      
      // Cerrar los demás si es necesario
      timelineItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.stack-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });
      
      // Abrir el actual
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}
  const items = document.querySelectorAll('.timeline-item-stack');
  
  items.forEach(item => {
    const header = item.querySelector('.stack-header');
    const content = item.querySelector('.stack-content');
    
    if (!header || !content) return;
    
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // 1. Cerramos todas las demás fases abiertas para mantener el orden
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.stack-content');
        if (otherContent) {
          otherContent.style.maxHeight = null;
        }
      });
      
      // 2. Si estaba cerrada, le añadimos la clase activa y calculamos su scrollHeight
      if (!isOpen) {
        item.classList.add('active');
        
        // scrollHeight le pregunta al navegador la altura total del bloque,
        // incluyendo la imagen adaptada orgánicamente al 100% de su aspecto.
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

// Ejecutamos la inicialización del acordeón al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initAccordionTimeline();
});
function openWhatsApp() {
  const targetPhone = "5492944000000";
  const customMessage = encodeURIComponent("Hola Cúspides, leí el programa formativo y quiero solicitar una entrevista de postulación.");
  const apiLink = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${customMessage}`;
  window.open(apiLink, '_blank');
}

function initDynamicCourseButtons() {
  const courses = document.querySelectorAll('.timeline-item');
  
  courses.forEach(course => {
    const btn = document.createElement('button');
    btn.className = 'btn-more-info-dynamic';
    btn.innerText = 'Más Info';
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openWhatsApp();
    });
    
    course.appendChild(btn);
  });
}

function initDynamicCourseButtons() {
  // Borrá todo lo que esté dentro de esta función y la función misma
}
function initCuspidesGallerySlider() {
  const carousel = document.getElementById('galleryCarousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('#carouselIndicators .dot');
  const prevBtn = document.getElementById('prevGalleryBtn');
  const nextBtn = document.getElementById('nextGalleryBtn');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  function changeSlide(nextIndex) {
    // Apagar slide actual
    slides[currentSlide].style.opacity = '0';
    setTimeout(() => {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');

      // Calcular nuevo indice circular
      currentSlide = (nextIndex + totalSlides) % totalSlides;

      // Encender nuevo slide
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      // Forzar reflow para animación fluida de opacidad
      void slides[currentSlide].offsetWidth;
      slides[currentSlide].style.opacity = '1';
    }, 200); // Pequeño delay de desvanecimiento cruzado
  }

  function handleNext() {
    changeSlide(currentSlide + 1);
  }

  function handlePrev() {
    changeSlide(currentSlide - 1);
  }

  // Enlazar eventos de botones
  if (nextBtn) nextBtn.addEventListener('click', () => {
    handleNext();
    resetAutoplay();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    handlePrev();
    resetAutoplay();
  });

  // Enlazar indicadores (puntos)
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const clickedIndex = parseInt(e.target.getAttribute('data-index'));
      if (clickedIndex === currentSlide) return;
      changeSlide(clickedIndex);
      resetAutoplay();
    });
  });

  // Temporizador de Autoplay Inteligente (Copia el ritmo de tu Editorial Slider - 6 segundos)
  function startAutoplay() {
    autoplayTimer = setInterval(handleNext, 6000);
  }

  function resetAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      startAutoplay();
    }
  }

  // Inicializar opacidad nativa del primer elemento activo y encender temporizador
  if (slides[currentSlide]) {
    slides[currentSlide].style.opacity = '1';
  }
  startAutoplay();

  // Integrar dinámicamente con tu motor de Canvas de Estrellas si existe
  // Esto asegura que la nueva sección también renderice estrellas parpadeantes en el fondo
  if (typeof initStarCanvasBackground === 'function') {
    // Volvemos a ejecutar la inicialización para que tome el nuevo canvas de la galería
    setTimeout(initStarCanvasBackground, 100);
  }
}
/**
 * MOTOR DE LA GALERÍA DESLIZANTE V2 (8 FOTOS) — CÚSPIDES
 * Basado exactamente en la lógica estructural de animación por track horizontal.
 */

function initCuspidesExpeditionsSlider() {
  const track = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  
  if (!track) return;

  const slides = Array.from(track.children);
  let currentIndex = 0;
  const totalSlides = slides.length;

  function moveToSlide(index) {
    // Control circular seguro
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    
    // Desplazamiento horizontal por porcentaje idéntico a tu track de simuladores
    const amountToMove = currentIndex * -100;
    track.style.transform = `translateX(${amountToMove}%)`;
  }

  // Eventos de las flechitas chiquitas laterales
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      moveToSlide(currentIndex + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      moveToSlide(currentIndex - 1);
    });
  }

  // Soporte para gestos táctiles (Swipe) en móviles para mejorar la experiencia
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    if (touchStartX - touchEndX > 50) {
      moveToSlide(currentIndex + 1); // Swipe izquierdo -> siguiente
    }
    if (touchEndX - touchStartX > 50) {
      moveToSlide(currentIndex - 1); // Swipe derecho -> anterior
    }
  }
}

// Inyección automática en la carga del DOM
document.addEventListener('DOMContentLoaded', () => {
  initCuspidesExpeditionsSlider();
});