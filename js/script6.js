/**
 * CÚSPIDES — Motor Frontend Sincronizado
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initStarCanvasBackground();
  initIntersectionObserverReveal();
  initNumericalCounterEngine();
  initEditorialSlider();
  initHeaderScrollAndNavigation();
  initHeroParallaxInteraction();
  initCuspidesGallerySlider();
  initCuspidesExpeditionsSlider();
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
  const observerConfig = { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

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
    setTimeout(() => { currentSlide.classList.remove('exit'); }, 800);
  }, 5000);
}

function initHeaderScrollAndNavigation() {
  const mainNav = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) { mainNav.classList.add('scrolled'); } else { mainNav.classList.remove('scrolled'); }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) { currentSectionId = section.getAttribute('id'); }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) { link.classList.add('active'); }
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
  const customMessage = encodeURIComponent("Hola Cúspides, quiero solicitar más información.");
  const apiLink = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${customMessage}`;
  window.open(apiLink, '_blank');
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
    slides[currentSlide].style.opacity = '0';
    setTimeout(() => {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (nextIndex + totalSlides) % totalSlides;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      void slides[currentSlide].offsetWidth;
      slides[currentSlide].style.opacity = '1';
    }, 200); 
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { changeSlide(currentSlide + 1); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { changeSlide(currentSlide - 1); startAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const clickedIndex = parseInt(e.target.getAttribute('data-index'));
      if (clickedIndex === currentSlide) return;
      changeSlide(clickedIndex);
      startAutoplay();
    });
  });

  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => { changeSlide(currentSlide + 1); }, 6000);
  }
  if (slides[currentSlide]) slides[currentSlide].style.opacity = '1';
  startAutoplay();
}

function initCuspidesExpeditionsSlider() {
  const track = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (!track) return;

  const slides = Array.from(track.children);
  let currentIndex = 0;
  const totalSlides = slides.length;

  function moveToSlide(index) {
    if (index < 0) { currentIndex = totalSlides - 1; } else if (index >= totalSlides) { currentIndex = 0; } else { currentIndex = index; }
    const amountToMove = currentIndex * -100;
    track.style.transform = `translateX(${amountToMove}%)`;
  }

  if (nextBtn) nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
}