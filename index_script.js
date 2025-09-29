(function () {
  "use strict";

  // Configuration
  const config = {
    animationDuration: 800,
    scrollOffset: 100,
    loadDelay: 1500,
    counterSpeed: 2000,
    notificationDelay: 3000,
    notificationAutoHide: 18000,
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
  // Enhanced Projects Manager with Modal Functionality
  class ProjectsManager {
    constructor() {
      this.projectsGrid = document.getElementById("projectsGrid");
      this.filterButtons = document.querySelectorAll(".filter-btn");

      // Enhanced project data with completed projects
      this.projectsData = {
        "energy-monitor": {
          title: "Real-Time Electrical Energy Monitoring System",
          status: "completed",
          description:
            "IoT-based system providing continuous monitoring and analysis of electrical energy consumption with web dashboard and WiFi connectivity.",
          technologies: [
            "ESP32",
            "ZMPT101B Sensor",
            "SCT-013-000 CT",
            "HTML5",
            "CSS3",
            "JavaScript",
            "JSON",
            "Arduino IDE",
            "Proteus 8",
          ],
          features: [
            "Real-time voltage and current monitoring",
            "Power factor calculation",
            "Web-based dashboard",
            "Historical data logging",
            "WiFi connectivity",
            "LCD display interface",
          ],
          applications: [
            "Residential Energy Management",
            "Commercial Buildings",
            "Industrial Monitoring",
          ],
          completionDate: "Q3 2025",
          images: 3,
        },
        "base-station": {
          title: "Base Station Monitoring System",
          status: "completed",
          description:
            "Comprehensive IoT solution for telecommunications infrastructure management with real-time parameter monitoring and remote surveillance.",
          technologies: [
            "ESP32",
            "Node.js",
            "Express.js",
            "Socket.io",
            "HTML/CSS",
            "JavaScript",
            "JSON Database",
            "GSM Module",
          ],
          features: [
            "Environmental monitoring (temperature, humidity)",
            "Power supply monitoring",
            "Security surveillance (motion, smoke)",
            "SMS alert system",
            "Multi-user authentication",
            "Real-time web dashboard",
          ],
          applications: [
            "Telecommunications",
            "Remote Infrastructure",
            "Critical Systems Monitoring",
          ],
          completionDate: "Q3 2025",
          images: 4,
        },
        "smart-water": {
          title: "Smart Water Metering System",
          status: "completed",
          description:
            "Revolutionary water consumption monitoring with automated billing, usage control, and email notifications for efficient water management.",
          technologies: [
            "ESP32",
            "YF-S201 Flow Sensor",
            "Node.js",
            "MongoDB",
            "Express.js",
            "Chart.js",
            "Socket.io",
            "Nodemailer",
          ],
          features: [
            "Real-time flow measurement",
            "Automated billing calculations",
            "User-defined consumption limits",
            "Email alert system",
            "Pump control automation",
            "Usage analytics dashboard",
          ],
          applications: [
            "Smart Cities",
            "Residential Buildings",
            "Water Management",
            "Billing Systems",
          ],
          completionDate: "Q3 2025",
          images: 3,
        },
        "smart-parking": {
          title: "Smart Parking Monitoring System",
          status: "completed",
          description:
            "IoT-based parking management with real-time slot monitoring, reservation system, and surveillance capabilities for modern parking solutions.",
          technologies: [
            "ESP32-CAM",
            "Ultrasonic Sensors",
            "MongoDB",
            "Node.js",
            "Express.js",
            "Bootstrap",
            "PlatformIO",
            "Proteus",
          ],
          features: [
            "Real-time slot detection",
            "Web-based reservation system",
            "Payment simulation",
            "Entry/exit surveillance",
            "Session monitoring",
            "Automated notifications",
          ],
          applications: [
            "Smart Cities",
            "Commercial Buildings",
            "Universities",
            "Shopping Centers",
          ],
          completionDate: "Q3 2025",
          images: 4,
        },
        "fire-detection": {
          title: "IoT Smoke Detector with Automated Fire Suppression",
          status: "completed",
          description:
            "Intelligent fire safety system with smoke detection, GPS tracking, automated suppression, and multi-channel emergency alerts.",
          technologies: [
            "ESP32",
            "Smoke Sensors",
            "GPS Module",
            "Node.js",
            "Socket.io",
            "HTML5",
            "CSS3",
            "JSON Database",
            "SMS API",
          ],
          features: [
            "Smart smoke detection",
            "GPS location tracking",
            "Automated fire suppression",
            "Multi-channel alerts (SMS, web, local)",
            "False alarm prevention",
            "Remote monitoring dashboard",
          ],
          applications: [
            "Building Safety",
            "Industrial Safety",
            "Smart Homes",
            "Emergency Response",
          ],
          completionDate: "Q3 2025",
          images: 3,
        },
        "smart-lighting": {
          title: "Smart Lighting Automation Using Node-RED",
          status: "completed",
          description:
            "Energy-efficient lighting automation system with web interface, scheduling, and customizable scenarios using Node-RED platform.",
          technologies: [
            "Node-RED",
            "ESP32",
            "HTML/CSS",
            "JavaScript",
            "JSON Database",
            "HTTP/REST API",
            "WebSocket",
          ],
          features: [
            "Remote web control interface",
            "Automated scheduling",
            "Custom lighting scenarios",
            "Energy usage analytics",
            "Real-time monitoring",
            "Mobile-responsive dashboard",
          ],
          applications: [
            "Smart Homes",
            "Office Buildings",
            "Energy Management",
            "IoT Automation",
          ],
          completionDate: "Q3 2025",
          images: 3,
        },
        "autonomous-rover": {
          title: "Autonomous Delivery Robot/Rover",
          status: "progress",
          description:
            "Advanced autonomous delivery system with AI integration, remote control capabilities, and green energy solutions for multiple industry applications.",
          technologies: [
            "AI/ML",
            "Computer Vision",
            "Robotics",
            "Green Energy",
            "IoT Sensors",
            "GPS Navigation",
            "Remote Control Systems",
          ],
          features: [
            "Autonomous navigation",
            "AI-assisted decision making",
            "Remote control capability",
            "Solar power integration",
            "Multi-terrain adaptability",
            "Real-time monitoring",
            "Collision avoidance",
          ],
          applications: [
            "Healthcare Delivery",
            "Wildlife Monitoring",
            "Urban Logistics",
            "Emergency Response",
          ],
          completionDate: "December 2025",
          images: 0,
          note: "Open for feature suggestions via WhatsApp!",
        },
      };

      this.init();
    }
    // image fallback 
    checkImageExists(imagePath) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
      });
    }

    init() {
      this.generateEnhancedProjectsGrid();
      this.bindEvents();
      this.setupNotification();
    }

    bindEvents() {
      // Modal event handlers
      const modal = document.getElementById("projectModal");
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            this.closeProjectModal();
          }
        });
      }

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeProjectModal();
          this.closeNotification();
        }
      });
    }

    setupNotification() {
      // Show notification on page load
      setTimeout(() => {
        const notification = document.getElementById("projectNotification");
        if (notification) {
          notification.classList.add("show");
        }
      }, config.notificationDelay);

      // Auto-hide after specified time
      setTimeout(() => {
        this.closeNotification();
      }, config.notificationAutoHide);
    }

    generateEnhancedProjectsGrid() {
      if (!this.projectsGrid) return;

      let projectsHTML = "";

      Object.keys(this.projectsData).forEach((projectId) => {
        const project = this.projectsData[projectId];
        projectsHTML += `
      <div class="enhanced-project-card" onclick="projectsManager.openProjectModal('${projectId}')">
        <div class="project-status status-${project.status}">
          ${project.status === "completed" ? "Completed" : "In Progress"}
        </div>
        <div class="project-preview">
        ${project.images > 0 ? `
        <img src="images/${projectId}-preview.jpg" alt="${project.title} preview" 
        style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; display: block;" 
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        onload="this.nextElementSibling.style.display='none';">
        <div style="display: flex; align-items: center; justify-content: center; height: 120px; background: var(--glass-bg); color: var(--text-muted); border-radius: 8px;">
        📸 ${project.images} Images Available
        </div>
        ` : `<div style="display: flex; align-items: center; justify-content: center; height: 120px; background: var(--glass-bg); color: var(--text-muted); border-radius: 8px;">🚧 Coming Soon</div>`}
        </div>
        <h3 style="color: var(--text-light); margin-bottom: 8px; font-size: 18px;">${
          project.title
        }</h3>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px; line-height: 1.4;">
          ${project.description.substring(0, 120)}...
        </p>
        <div class="tech-stack">
          ${project.technologies
            .slice(0, 3)
            .map((tech) => `<span class="tech-tag">${tech}</span>`)
            .join("")}
          ${
            project.technologies.length > 3
              ? `<span class="tech-tag">+${
                  project.technologies.length - 3
                } more</span>`
              : ""
          }
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
          <span style="color: var(--primary-green); font-size: 12px; font-weight: 600;">
            ${project.completionDate}
          </span>
          <span style="color: var(--primary-blue); font-size: 12px;">
            Click to explore →
          </span>
        </div>
      </div>
    `;
      });

      this.projectsGrid.innerHTML = projectsHTML;
    }

    openProjectModal(projectId) {
      const project = this.projectsData[projectId];
      if (!project) return;

      const modalTitle = document.getElementById("modalProjectTitle");
      const modalBody = document.getElementById("modalProjectBody");

      if (modalTitle) modalTitle.textContent = project.title;

      if (modalBody) {
        modalBody.innerHTML = `
        <div style="color: var(--text-light);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <span class="project-status status-${
              project.status
            }" style="position: static;">
              ${
                project.status === "completed"
                  ? "✅ Completed"
                  : "⏳ In Progress"
              }
            </span>
            <span style="color: var(--primary-green); font-weight: 600;">${
              project.completionDate
            }</span>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h4 style="color: var(--primary-blue); margin-bottom: 8px;">Project Overview</h4>
            <p style="line-height: 1.6; color: var(--text-secondary);">${
              project.description
            }</p>
            ${
              project.note
                ? `<div style="background: var(--glass-bg); padding: 12px; border-radius: 8px; margin-top: 12px; border-left: 3px solid var(--primary-green);"><strong>Note:</strong> ${project.note}</div>`
                : ""
            }
          </div>
          
          ${
            project.images > 0
              ? `
          <div style="margin-bottom: 24px;">
            <h4 style="color: var(--primary-blue); margin-bottom: 12px;">Project Gallery</h4>
            <div class="project-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${Array.from(
              { length: project.images },
              (_, i) => `
            <div class="project-image" style="position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 16/9;">
            <img src="images/${projectId}-${i + 1}.jpg" alt="${
                project.title
              } image ${i + 1}" 
            style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" 
            onclick="this.requestFullscreen()"
            onerror="this.parentElement.innerHTML='<div style=\\'display: flex; align-items: center; justify-content: center; height: 100%; background: var(--glass-bg); color: var(--text-muted);\\'>📸 Image ${
              i + 1
            }</div>'">
            </div>
            `
            ).join("")}
            </div>
          </div>
          `
              : ""
          }
          
          <div style="margin-bottom: 24px;">
            <h4 style="color: var(--primary-blue); margin-bottom: 12px;">Technologies Used</h4>
            <div class="tech-stack">
              ${project.technologies
                .map((tech) => `<span class="tech-tag">${tech}</span>`)
                .join("")}
            </div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h4 style="color: var(--primary-blue); margin-bottom: 12px;">Key Features</h4>
            <ul style="list-style: none; padding: 0;">
              ${project.features
                .map(
                  (feature) => `
                <li style="padding: 6px 0; color: var(--text-secondary); display: flex; align-items: center;">
                  <span style="color: var(--primary-green); margin-right: 8px;">✓</span>
                  ${feature}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h4 style="color: var(--primary-blue); margin-bottom: 12px;">Applications</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${project.applications
                .map(
                  (app) => `
                <span style="background: var(--glass-bg); padding: 6px 12px; border-radius: 12px; font-size: 14px; border: 1px solid var(--glass-border);">
                  ${app}
                </span>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid var(--glass-border);">
            <p style="color: var(--text-muted); margin-bottom: 16px;">Interested in this solution?</p>
            <button onclick="projectsManager.contactAboutProject('${
              project.title
            }')" style="background: var(--gradient-primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
              Contact Us About This Project
            </button>
          </div>
        </div>
      `;
      }

      const modal = document.getElementById("projectModal");
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    }

    closeProjectModal() {
      const modal = document.getElementById("projectModal");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    }

    closeNotification() {
      const notification = document.getElementById("projectNotification");
      if (notification) {
        notification.classList.remove("show");
      }
    }

    contactAboutProject(projectTitle) {
      const phoneNumber = "+263713422587";
      const message = `Hi! I'm interested in learning more about your "${projectTitle}" project. Can you provide more details about implementation and costs?`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
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
        formGroups.forEach((group) =>
          group.classList.remove("focus", "has-value")
        );
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

    // Store reference to projects manager globally for modal functions
    window.projectsManager = new ProjectsManager();

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




// Promotional Carousel - Duplicate items for seamless loop
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('promoCarousel');
    
    if (carousel) {
        const cards = Array.from(carousel.children);
        
        // Duplicate cards for seamless infinite scroll
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            carousel.appendChild(clone);
        });
        
        // Optional: Adjust animation speed based on number of items
        const totalWidth = carousel.scrollWidth / 2;
        const speed = totalWidth / 50; // Adjust divisor for speed (higher = slower)
        carousel.style.animationDuration = `${speed}s`;
    }
});


document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });
