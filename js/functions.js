document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initShareTooltips();
  initSocialPopups();
});

/**
 * Indicador de progreso de lectura (Scroll Line)
 */
function initScrollProgress() {
  const scrollLine = document.querySelector(".scroll-line");
  if (!scrollLine) return;

  let ticking = false;

  const updateScrollProgress = () => {
    // Uso de documentElement.scrollHeight para mayor consistencia en navegadores
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (totalHeight <= 0) {
      scrollLine.style.width = "0%";
      return;
    }

    const percentScrolled = (window.scrollY / totalHeight) * 100;
    scrollLine.style.width = `${Math.min(100, Math.max(0, percentScrolled))}%`;
  };

  // Escuchadores de eventos optimizados con opciones pasivas para mejorar scroll
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateScrollProgress, { passive: true });

  // Ejecución inicial
  updateScrollProgress();
}

/**
 * Tooltips de Bootstrap y funcionalidad de copiar enlace
 */
function initShareTooltips() {
  // Guard clause por si Bootstrap no está cargado en la página
  if (typeof bootstrap === "undefined") return;

  // 1. Inicializar todos los tooltips activos
  const tooltipElements = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]',
  );
  if (!tooltipElements.length) return;

  tooltipElements.forEach((el) => new bootstrap.Tooltip(el));

  // 2. Enlaces a redes sociales: ocultar tooltip y remover :focus al hacer clic
  const socialLinks = document.querySelectorAll(".social-link");
  socialLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const tooltipInstance = bootstrap.Tooltip.getInstance(this);
      if (tooltipInstance) {
        tooltipInstance.hide();
      }
      this.blur();
    });
  });

  // 3. Botón "Copiar link"
  const btnCopiar = document.getElementById("btn-copiar-link");
  if (btnCopiar) {
    btnCopiar.addEventListener("click", function (e) {
      e.preventDefault();

      // Lee la URL de la subcarpeta desde data-url (o usa el dominio raíz como respaldo)
      const urlToCopy = this.dataset.url || window.location.origin;

      navigator.clipboard
        .writeText(urlToCopy)
        .then(() => {
          const tooltipInstance = bootstrap.Tooltip.getInstance(btnCopiar);
          if (!tooltipInstance) return;

          // Cambiar texto a "¡Copiado!"
          tooltipInstance.setContent({ ".tooltip-inner": "¡Copiado!" });

          // Ocultar y remover estado :focus tras 1s
          setTimeout(() => {
            tooltipInstance.hide();
            btnCopiar.blur();

            // Restaurar el texto original tras la animación de salida
            setTimeout(() => {
              tooltipInstance.setContent({ ".tooltip-inner": "Copiar link" });
            }, 300);
          }, 1000);
        })
        .catch((err) => {
          console.error("Error al copiar enlace:", err);
        });
    });
  }
}

/**
 * Ventanas emergentes (popups) para compartir en redes sociales
 */
function initSocialPopups() {
  // Seleccionamos solo los enlaces a los que les agregamos la clase 'js-share-popup' en el HTML
  const shareLinks = document.querySelectorAll('.js-share-popup');

  shareLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); 
      
      const url = this.href;
      const popupWidth = 600;
      const popupHeight = 500;
      
      // Cálculo para centrar el popup dinámicamente según la pantalla del usuario
      const left = (window.innerWidth / 2) - (popupWidth / 2) + window.screenX;
      const top = (window.innerHeight / 2) - (popupHeight / 2) + window.screenY;

      window.open(
        url,
        'shareWindow',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`
      );
    });
  });
}