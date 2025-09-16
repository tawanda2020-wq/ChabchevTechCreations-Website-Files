(function () {
  "use strict";

  // Configuration
  const config = {
    animationDuration: 800,
    scrollOffset: 100,
    loadDelay: 1500,
    counterSpeed: 2000,
  };

  // Utility Functions
  const utils = {
    throttle: (func, delay) => {
      let timeoutId;
      let lastExecTime = 0;
      return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
          func.apply(this, args);
          lastExecTime = currentTime;
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
            lastExecTime = Date.now();
          }, delay - (currentTime - lastExecTime));
        }
      };
    },

    debounce: (func, delay) => {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },

    easeOutQuart: (t) => 1 - --t * t * t * t,

    isElementInViewport: (el, offset = 0) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= -offset &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) +
            offset &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    },
  };

  // Loading Manager
  class LoadingManager {
    constructor() {
      this.loader = document.getElementById("loader");
      this.init();
    }

    init() {
      // Preload critical images
      this.preloadImages(["ctc logo.png"]);

      // Hide loader after delay or when everything is loaded
      const hideLoader = () => {
        setTimeout(() => {
          this.hideLoader();
        }, config.loadDelay);
      };

      if (document.readyState === "complete") {
        hideLoader();
      } else {
        window.addEventListener("load", hideLoader);
      }
    }

    preloadImages(urls) {
      urls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }

    hideLoader() {
      if (this.loader) {
        this.loader.classList.add("hidden");
        setTimeout(() => {
          this.loader.style.display = "none";
        }, 500);
      }
    }
  }

  // Navigation Manager
  class NavigationManager {
    constructor() {
      this.navbar = document.getElementById("navbar");
      this.navToggle = document.getElementById("navToggle");
      this.navMenu = document.getElementById("navMenu");
      this.navLinks = document.querySelectorAll(".nav-link");
      this.themeToggle = document.getElementById("themeToggle");

      this.init();
    }

    init() {
      this.bindEvents();
      this.handleActiveSection();
    }

    bindEvents() {
      // Mobile menu toggle
      if (this.navToggle) {
        this.navToggle.addEventListener("click", () => this.toggleMobileMenu());
      }

      // Navigation links
      this.navLinks.forEach((link) => {
        link.addEventListener("click", (e) => this.handleNavClick(e));
      });

      // Theme toggle
      if (this.themeToggle) {
        this.themeToggle.addEventListener("click", () => this.toggleTheme());
      }

      // Scroll effects
      window.addEventListener(
        "scroll",
        utils.throttle(() => {
          this.handleScroll();
          this.handleActiveSection();
        }, 16)
      );

      // Close mobile menu on resize
      window.addEventListener(
        "resize",
        utils.debounce(() => {
          if (window.innerWidth > 768) {
            this.closeMobileMenu();
          }
        }, 250)
      );
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
      const offsetTop = element.offsetTop - config.scrollOffset;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }

    handleScroll() {
      const scrollY = window.scrollY;

      // Navbar background on scroll
      if (scrollY > 50) {
        this.navbar.classList.add("scrolled");
      } else {
        this.navbar.classList.remove("scrolled");
      }
    }

    handleActiveSection() {
      const sections = document.querySelectorAll("section[id]");
      const scrollPos = window.scrollY + config.scrollOffset;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          this.navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(
            `[data-section="${sectionId}"]`
          );
          if (activeLink) activeLink.classList.add("active");
        }
      });
    }

    toggleTheme() {
      document.documentElement.classList.toggle("light-theme");
      const isLight =
        document.documentElement.classList.contains("light-theme");

      // Update theme icon
      const themeIcon = this.themeToggle.querySelector(".theme-icon");
      if (themeIcon) {
        themeIcon.textContent = isLight ? "☀️" : "🌙";
      }

      // Store theme preference
      try {
        localStorage.setItem("theme", isLight ? "light" : "dark");
      } catch (e) {
        // Fallback if localStorage is not available
        console.log("Theme preference not stored");
      }
    }
  }

  // Animation Manager
  class AnimationManager {
    constructor() {
      this.animatedElements = [];
      this.init();
    }

    init() {
      this.setupIntersectionObserver();
      this.setupCounterAnimation();
      this.setupFloatingElements();
    }

    setupIntersectionObserver() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            this.observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe elements for animation
      const elementsToAnimate = document.querySelectorAll(
        ".section-header, .service-card, .feature-card, .tech-item, .contact-item"
      );

      elementsToAnimate.forEach((el) => {
        el.classList.add("animate-element");
        this.observer.observe(el);
      });
    }

    setupCounterAnimation() {
      const counters = document.querySelectorAll(".stat-number");
      let countersAnimated = false;

      const animateCounters = () => {
        if (countersAnimated) return;

        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target"));
          const duration = config.counterSpeed;
          const start = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(utils.easeOutQuart(progress) * target);

            counter.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };

          requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
      };

      // Trigger counter animation when hero section is in viewport
      const heroSection = document.getElementById("home");
      if (heroSection && counters.length > 0) {
        const counterObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animateCounters();
              }
            });
          },
          { threshold: 0.3 }
        );

        counterObserver.observe(heroSection);
      }
    }

    setupFloatingElements() {
      const floatingElements = document.querySelectorAll(".float-element");
      floatingElements.forEach((el, index) => {
        el.style.setProperty("--random-x", Math.random() * 100 + "%");
        el.style.setProperty("--random-y", Math.random() * 100 + "%");
      });
    }
  }

  // Services Manager
  class ServicesManager {
    constructor() {
      this.serviceCards = document.querySelectorAll(".service-card");
      this.init();
    }

    init() {
      this.bindEvents();
    }

    bindEvents() {
      this.serviceCards.forEach((card) => {
        card.addEventListener("mouseenter", () => this.handleCardHover(card));
        card.addEventListener("mouseleave", () => this.handleCardLeave(card));
      });
    }

    handleCardHover(card) {
      card.classList.add("hovered");
      // Add subtle parallax effect
      card.style.transform = "translateY(-10px) scale(1.02)";
    }

    handleCardLeave(card) {
      card.classList.remove("hovered");
      card.style.transform = "";
    }
  }

  // Projects Manager
  class ProjectsManager {
    constructor() {
      this.projectsGrid = document.getElementById("projectsGrid");
      this.filterButtons = document.querySelectorAll(".filter-btn");
      this.projects = [
        {
          id: 1,
          title: "Smart Home Automation",
          description:
            "IoT-based home automation system with AI-powered energy optimization",
          category: "iot",
          image:
            "smart home.png",
          technologies: ["IoT, ", "Machine Learning, ", "Vue.js"],
          year: "2024",
        },
        {
          id: 2,
          title: "Predictive Maintenance AI",
          description:
            "Machine learning system for industrial equipment maintenance prediction",
          category: "ai",
          image:
            "predictive maintainance AI.jpg",
          technologies: ["JS, ", "TensorFlow, ", "Edge AI"],
          year: "2024",
        },
        {
          id: 3,
          title: "Autonomous Delivery Robot",
          description:
            "Self-navigating delivery robot with computer vision and path planning",
          category: "robotics",
          image:
            "delivery robot.png",
          technologies: ["ROS, ", "Computer Vision, ", "Navigation"],
          year: "2023",
        },
        {
          id: 4,
          title: "Cloud-Based Analytics Platform",
          description:
            "Scalable data analytics platform for real-time business insights",
          category: "cloud",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
          technologies: ["Microsoft Azure, ", "Vue.js, ", "Node.js"],
          year: "2023",
        },
        {
          id: 5,
          title: "Industrial Quality Control",
          description:
            "Computer vision system for automated quality inspection in manufacturing",
          category: "ai",
          image:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
          technologies: ["OpenCV, ", "Deep Learning, ", "Edge Computing"],
          year: "2023",
        },
        {
          id: 6,
          title: "Smart Agriculture System",
          description:
            "IoT sensors and AI for precision farming and crop optimization",
          category: "iot",
          image:
            "smart agriculture.png",
          technologies: ["IoT Sensors, ", "Machine Learning, ", "Mobile App"],
          year: "2022",
        },
      ];

      this.init();
    }

    init() {
      this.renderProjects();
      this.bindEvents();
    }

    bindEvents() {
      this.filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => this.handleFilter(e));
      });
    }

    handleFilter(e) {
      const filter = e.target.getAttribute("data-filter");

      // Update active button
      this.filterButtons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      // Filter and render projects
      this.renderProjects(filter);
    }

    renderProjects(filter = "all") {
      const filteredProjects =
        filter === "all"
          ? this.projects
          : this.projects.filter((project) => project.category === filter);

      this.projectsGrid.innerHTML = filteredProjects
        .map(
          (project) => `
                <div class="project-card" data-category="${project.category}">
                    <div class="project-image">
                        <img src="${project.image}" alt="${
            project.title
          }" loading="lazy">
                        <div class="project-overlay">
                            <div class="project-actions">
                                <button class="btn btn-secondary btn-small">View Details</button>
                            </div>
                        </div>
                    </div>
                    <div class="project-content">
                        <div class="project-meta">
                            <span class="project-year">${project.year}</span>
                            <span class="project-category">${project.category.toUpperCase()}</span>
                        </div>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${
                          project.description
                        }</p>
                        <div class="project-tech">
                            ${project.technologies
                              .map(
                                (tech) =>
                                  `<span class="tech-tag">${tech}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            `
        )
        .join("");

      // Animate new projects
      this.animateProjects();
    }

    animateProjects() {
      const projectCards = this.projectsGrid.querySelectorAll(".project-card");
      projectCards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        setTimeout(() => {
          card.style.transition = "all 0.6s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100);
      });
    }
  }

  // Contact Form Manager
  class ContactManager {
    constructor() {
      this.contactForm = document.getElementById("contactForm");
      this.init();
    }

    init() {
      if (this.contactForm) {
        this.bindEvents();
        this.setupFormValidation();
      }
    }

    bindEvents() {
      this.contactForm.addEventListener("submit", (e) => this.handleSubmit(e));

      // Show/hide the "Custom Subject" field dynamically:
      const subjectSelect = this.contactForm.querySelector("#subject");
      const customSubjectGroup = document.getElementById("customSubjectGroup");

      subjectSelect.addEventListener("change", () => {
        if (subjectSelect.value === "Other") {
          customSubjectGroup.style.display = "block";
          customSubjectGroup.querySelector("input").required = true;
        } else {
          customSubjectGroup.style.display = "none";
          customSubjectGroup.querySelector("input").required = false;
        }
      });

      // Enhanced form interactions
      const formInputs = this.contactForm.querySelectorAll("input, textarea");
      formInputs.forEach((input) => {
        input.addEventListener("focus", () => this.handleInputFocus(input));
        input.addEventListener("blur", () => this.handleInputBlur(input));
        input.addEventListener("input", () => this.handleInputChange(input));
      });
    }

    handleInputFocus(input) {
      input.parentElement.classList.add("focus");
    }

    handleInputBlur(input) {
      if (!input.value) {
        input.parentElement.classList.remove("focus");
      }
    }

    handleInputChange(input) {
      if (input.value) {
        input.parentElement.classList.add("has-value");
      } else {
        input.parentElement.classList.remove("has-value");
      }
    }

    setupFormValidation() {
      const inputs = this.contactForm.querySelectorAll(
        "input[required], textarea[required]"
      );
      inputs.forEach((input) => {
        input.addEventListener("invalid", (e) => {
          e.preventDefault();
          this.showFieldError(input, this.getErrorMessage(input));
        });

        input.addEventListener("input", () => {
          this.clearFieldError(input);
        });
      });
    }

    getErrorMessage(input) {
      if (input.validity.valueMissing) {
        return `${
          input.name.charAt(0).toUpperCase() + input.name.slice(1)
        } is required`;
      }
      if (input.validity.typeMismatch && input.type === "email") {
        return "Please enter a valid email address";
      }
      return "Please check this field";
    }

    showFieldError(input, message) {
      input.parentElement.classList.add("error");
      let errorEl = input.parentElement.querySelector(".field-error");
      if (!errorEl) {
        errorEl = document.createElement("span");
        errorEl.className = "field-error";
        input.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }

    clearFieldError(input) {
      input.parentElement.classList.remove("error");
      const errorEl = input.parentElement.querySelector(".field-error");
      if (errorEl) {
        errorEl.remove();
      }
    }

    async handleSubmit(e) {
        e.preventDefault();
      
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(this.contactForm);
      
        // Show loading state
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
      
        try {
          // Extract form data, and send a whatsapp message
      
          // Optional: show UI success message
          this.showSuccessMessage();
          this.contactForm.reset();
      
          // Clear visual input states
          const formGroups = this.contactForm.querySelectorAll(".form-group");
          formGroups.forEach((group) => group.classList.remove("focus", "has-value"));
      
        } catch (error) {
          this.showErrorMessage("Failed to prepare message. Please try again.");
        } finally {
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;
        }
      }
      

    simulateFormSubmission(formData) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success (90% chance)
          if (Math.random() > 0.1) {
            resolve();
          } else {
            reject(new Error("Submission failed"));
          }
        }, 2000);
      });
    }

    showSuccessMessage() {
      this.showNotification(
        "Message sent successfully! We'll get back to you soon.",
        "success"
      );
    }

    showErrorMessage(message) {
      this.showNotification(message, "error");
    }

    showNotification(message, type) {
      // Create notification element
      const notification = document.createElement("div");
      notification.className = `notification ${type}`;
      notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            `;

      // Add to page
      document.body.appendChild(notification);

      // Show notification
      setTimeout(() => notification.classList.add("show"), 100);

      // Auto hide after 5 seconds
      setTimeout(() => this.hideNotification(notification), 5000);

      // Close button handler
      notification
        .querySelector(".notification-close")
        .addEventListener("click", () => {
          this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }

  // Back to Top Manager
  class BackToTopManager {
    constructor() {
      this.backToTopBtn = document.getElementById("backToTop");
      this.init();
    }

    init() {
      if (this.backToTopBtn) {
        this.bindEvents();
      }
    }

    bindEvents() {
      // Show/hide button based on scroll position
      window.addEventListener(
        "scroll",
        utils.throttle(() => {
          if (window.scrollY > 300) {
            this.backToTopBtn.classList.add("visible");
          } else {
            this.backToTopBtn.classList.remove("visible");
          }
        }, 100)
      );

      // Click handler
      this.backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }

  // Tech Showcase Manager
  class TechShowcaseManager {
    constructor() {
      this.techItems = document.querySelectorAll(".tech-item");
      this.currentIndex = 0;
      this.init();
    }

    init() {
      if (this.techItems.length > 0) {
        this.startAutoRotation();
        this.bindEvents();
      }
    }

    bindEvents() {
      this.techItems.forEach((item, index) => {
        item.addEventListener("click", () => this.setActive(index));
      });
    }

    setActive(index) {
      this.techItems.forEach((item) => item.classList.remove("active"));
      this.techItems[index].classList.add("active");
      this.currentIndex = index;
    }

    startAutoRotation() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.techItems.length;
        this.setActive(this.currentIndex);
      }, 3000);
    }
  }

  // Global Functions
  window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - config.scrollOffset;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Initialize everything when DOM is ready
  function initializeApp() {
    // Initialize all managers
    new LoadingManager();
    new NavigationManager();
    new AnimationManager();
    new ServicesManager();
    new ProjectsManager();
    new ContactManager();
    new BackToTopManager();
    new TechShowcaseManager();

    console.log("🚀 Chabchev Tech Creations website initialized successfully!");
  }

  // Start the application
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }
})();
