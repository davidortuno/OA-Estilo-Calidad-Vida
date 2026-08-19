const scrollLine = document.querySelector(".scroll-line");

function updateScrollProgress() {
  const windowHeight = window.innerHeight;
  const fullHeight = document.body.clientHeight;
  const scrolled = window.scrollY;
  const percentScrolled = (scrolled / (fullHeight - windowHeight)) * 100;
  scrollLine.style.width = `${percentScrolled}%`;
}

updateScrollProgress();

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      ticking = false;
    });
    ticking = true;
  }
});

window.addEventListener("resize", updateScrollProgress);
