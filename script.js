/**
 * CHABCHEV TECH CREATIONS - JAVASCRIPT
 * Modern, Production-Ready ES6+
 */

(function () {
  "use strict";

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const throttle = (func, delay) => {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // ========================================
  // NAVIGATION MANAGER
  // ========================================

  class NavigationManager {
    constructor() {
      this.nav = document.getElementById("nav");
      this.navToggle = document.getElementById("navToggle");
      this.navMenu = document.getElementById("navMenu");
      this.navLinks = document.querySelectorAll(".nav-link");

      this.init();
    }

    init() {
      this.bindEvents();
      this.handleActiveSection();
    }

    bindEvents() {
      // Mobile menu toggle
      this.navToggle?.addEventListener("click", () => this.toggleMobileMenu());

      // Navigation links
      this.navLinks.forEach((link) => {
        link.addEventListener("click", (e) => this.handleNavClick(e));
      });

      // Scroll effects
      window.addEventListener(
        "scroll",
        throttle(() => {
          this.handleScroll();
          this.handleActiveSection();
        }, 100)
      );

      // Close mobile menu on resize
      window.addEventListener(
        "resize",
        debounce(() => {
          if (window.innerWidth > 768) {
            this.closeMobileMenu();
          }
        }, 250)
      );

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          this.navMenu.classList.contains("active") &&
          !this.navMenu.contains(e.target) &&
          !this.navToggle.contains(e.target)
        ) {
          this.closeMobileMenu();
        }
      });
    }

    toggleMobileMenu() {
      this.navToggle.classList.toggle("active");
      this.navMenu.classList.toggle("active");
      document.body.style.overflow = this.navMenu.classList.contains("active")
        ? "hidden"
        : "";
    }

    closeMobileMenu() {
      this.navToggle.classList.remove("active");
      this.navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }

    handleNavClick(e) {
      e.preventDefault();
      const targetId = e.target.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        this.scrollToSection(targetSection);
        this.closeMobileMenu();
      }
    }

    scrollToSection(element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }

    handleScroll() {
      const scrollY = window.scrollY;

      // Navbar background on scroll
      if (scrollY > 50) {
        this.nav.classList.add("scrolled");
      } else {
        this.nav.classList.remove("scrolled");
      }
    }

    handleActiveSection() {
      const sections = document.querySelectorAll("section[id]");
      const scrollPos = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          this.navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(
            `[data-section="${sectionId}"]`
          );
          if (activeLink) {
            activeLink.classList.add("active");
          }
        }
      });
    }
  }

  // ========================================
  // ANIMATION MANAGER
  // ========================================

  class AnimationManager {
    constructor() {
      this.init();
    }

    init() {
      this.setupIntersectionObserver();
      this.setupParallaxEffect();
    }

    setupIntersectionObserver() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe elements for animation
      const elementsToAnimate = document.querySelectorAll(
        ".solution-card, .expertise-card, .contact-item, .section-header"
      );

      elementsToAnimate.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
      });
    }

    setupParallaxEffect() {
      const heroVideo = document.querySelector(".hero-video");

      if (heroVideo) {
        window.addEventListener(
          "scroll",
          throttle(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.5;
            heroVideo.style.transform = `translateY(${rate}px)`;
          }, 16)
        );
      }
    }
  }

  // ========================================
  // CONTACT FORM MANAGER
  // ========================================

  class ContactFormManager {
    constructor() {
      this.form = document.getElementById("contactForm");
      this.init();
    }

    init() {
      if (this.form) {
        this.bindEvents();
        this.setupFloatingLabels();
      }
    }

    bindEvents() {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));

      // Real-time validation
      const inputs = this.form.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        input.addEventListener("blur", () => this.validateField(input));
        input.addEventListener("input", () => this.clearError(input));
      });
    }

    setupFloatingLabels() {
      const formGroups = this.form.querySelectorAll(".form-group");

      formGroups.forEach((group) => {
        const input = group.querySelector("input, textarea, select");

        if (input) {
          // Check on load
          if (input.value) {
            group.classList.add("has-value");
          }

          // Check on change
          input.addEventListener("input", () => {
            if (input.value) {
              group.classList.add("has-value");
            } else {
              group.classList.remove("has-value");
            }
          });
        }
      });
    }

    validateField(field) {
      let isValid = true;
      const value = field.value.trim();

      // Check required
      if (field.hasAttribute("required") && !value) {
        this.showError(field, "This field is required");
        isValid = false;
      }

      // Check email
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.showError(field, "Please enter a valid email address");
          isValid = false;
        }
      }

      return isValid;
    }

    showError(field, message) {
      const formGroup = field.closest(".form-group");
      formGroup.classList.add("error");

      let errorElement = formGroup.querySelector(".error-message");
      if (!errorElement) {
        errorElement = document.createElement("span");
        errorElement.className = "error-message";
        errorElement.style.cssText =
          "color: #ff4444; font-size: 0.85rem; margin-top: 0.5rem; display: block;";
        formGroup.appendChild(errorElement);
      }
      errorElement.textContent = message;
    }

    clearError(field) {
      const formGroup = field.closest(".form-group");
      formGroup.classList.remove("error");
      const errorElement = formGroup.querySelector(".error-message");
      if (errorElement) {
        errorElement.remove();
      }
    }

    async handleSubmit(e) {
      e.preventDefault();

      // Validate all fields
      const inputs = this.form.querySelectorAll("input, textarea, select");
      let isValid = true;

      inputs.forEach((input) => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        return;
      }

      // Get form data
      const formData = new FormData(this.form);
      const name = formData.get("name");
      const email = formData.get("email");
      const service = formData.get("service");
      const message = formData.get("message");

      // Create WhatsApp message
      const phoneNumber = "263713422587";
      const whatsappMessage = `*New Contact Form Submission*\n\nName: ${name}\nEmail: ${email}\nService Interest: ${service}\n\nMessage:\n${message}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      // Show success message
      this.showNotification("Opening WhatsApp...", "success");

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Reset form
      this.form.reset();

      // Remove has-value class from form groups
      const formGroups = this.form.querySelectorAll(".form-group");
      formGroups.forEach((group) => group.classList.remove("has-value"));
    }

    showNotification(message, type) {
      const notification = document.createElement("div");
      notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === "success" ? "#7ebe4e" : "#ff4444"};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            `;
      notification.textContent = message;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  // ========================================
  // VIDEO MANAGER
  // ========================================

  class VideoManager {
    constructor() {
      this.video = document.querySelector(".hero-video");
      this.init();
    }

    init() {
      if (this.video) {
        // Optimize video loading
        this.video.addEventListener("loadedmetadata", () => {
          this.video.play().catch((err) => {
            console.log("Video autoplay prevented:", err);
          });
        });

        // Pause video when not in viewport
        this.setupVisibilityObserver();
      }
    }

    setupVisibilityObserver() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.video.play().catch(() => {});
            } else {
              this.video.pause();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(this.video);
    }
  }

  // ========================================
  // SMOOTH SCROLL MANAGER
  // ========================================

  class SmoothScrollManager {
    constructor() {
      this.init();
    }

    init() {
      // Handle all anchor links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const href = anchor.getAttribute("href");
          if (href !== "#" && href !== "") {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              const offsetTop = target.offsetTop - 80;
              window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
              });
            }
          }
        });
      });
    }
  }

  // ========================================
  // PERFORMANCE OPTIMIZATION
  // ========================================

  class PerformanceManager {
    constructor() {
      this.init();
    }

    init() {
      // Lazy load images
      this.setupLazyLoading();

      // Add CSS animation classes
      this.addAnimationStyles();
    }

    setupLazyLoading() {
      const images = document.querySelectorAll("img[data-src]");

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }

    addAnimationStyles() {
      const style = document.createElement("style");
      style.textContent = `
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }

                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
      document.head.appendChild(style);
    }
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  function initializeApp() {
    // Initialize all managers
    new NavigationManager();
    new AnimationManager();
    new ContactFormManager();
    new VideoManager();
    new SmoothScrollManager();
    new PerformanceManager();

    console.log(
      "🚀 Chabchev Tech Creations - Website initialized successfully!"
    );
  }

  // Start the application
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }

  // ========================================
  // DISABLE RIGHT CLICK
  // ========================================

  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
})();
