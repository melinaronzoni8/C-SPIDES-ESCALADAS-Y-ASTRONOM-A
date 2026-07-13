/**
 * CÚSPIDES UI LIBRARY - INTERACTION LOGIC
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. CONTROLADOR DE ANIMACIONES DE ENTRADA (SCROLL REVEAL)
  const revealElements = document.querySelectorAll(".ui-reveal");

  const revealOnScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.15 // Se activa cuando se visualiza el 15% del elemento
  });

  revealElements.forEach(element => {
    revealOnScrollObserver.observe(element);
  });

  // 2. BOTÓN DISPARADOR DE PRUEBA (Para forzar re-animación en el Showcase)
  const triggerBtn = document.querySelector(".btn-trigger-reveal");
  if (triggerBtn) {
    triggerBtn.addEventListener("click", () => {
      const demoBox = document.querySelector(".ui-reveal-demo-box");
      if (demoBox) {
        demoBox.classList.remove("active");
        // Forzar reflow para reiniciar la animación CSS nativa
        void demoBox.offsetWidth; 
        demoBox.classList.add("active");
      }
    });
  }

  // 3. EFECTO MAGNÉTICO EN BOTONES SECUNDARIOS (Feedback Sutil al usuario)
  const secondaryButtons = document.querySelectorAll(".btn-secondary");
  
  secondaryButtons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Mueve el botón levemente hacia el cursor para dar sensación orgánica
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
    });

    btn.addEventListener("mouseleave", () => {
      // Restaura la posición original de forma elástica por CSS
      btn.style.transform = '';
    });
  });

});