// Create floating shapes
function createFloatingShapes() {
  const shapes = document.querySelector('.floating-shapes');
  if (!shapes) return;
  
  const numberOfShapes = 15;

  for (let i = 0; i < numberOfShapes; i++) {
    const shape = document.createElement('div');
    shape.classList.add('shape');
    
    // Random size between 20px and 100px
    const size = Math.random() * 80 + 20;
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    
    // Random position
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.top = `${Math.random() * 100}%`;
    
    // Random animation duration
    shape.style.animationDuration = `${Math.random() * 20 + 10}s`;
    
    shapes.appendChild(shape);
  }
}

// Parallax effect for hero section
function handleParallax(e) {
  const shapes = document.querySelectorAll('.shape');
  const mouseX = e.clientX / window.innerWidth - 0.5;
  const mouseY = e.clientY / window.innerHeight - 0.5;

  shapes.forEach((shape, index) => {
    const speed = index * 0.1;
    const x = mouseX * speed * 100;
    const y = mouseY * speed * 100;
    shape.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// Smooth scroll for navigation
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      
      // Close mobile menu after clicking a link
      if (window.innerWidth <= 768) {
        document.querySelector(".nav-links").classList.remove("active");
      }
    });
  });
}

// Mobile Navigation Toggle
function initMobileNav() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });

  // Close menu when clicking on a navigation link
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });
  });

  // Close menu when pressing ESC key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      navLinks.classList.remove("active");
    }
  });
}

// Initialize functions
document.addEventListener('DOMContentLoaded', () => {
  createFloatingShapes();
  initSmoothScroll();
  initMobileNav();
  document.addEventListener('mousemove', handleParallax);
});
