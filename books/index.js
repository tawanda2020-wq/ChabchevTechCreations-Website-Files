// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const themeIcon = themeToggle.querySelector("i");

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === "dark") {
    themeIcon.className = "fas fa-sun";
  } else {
    themeIcon.className = "fas fa-moon";
  }
}

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    if (body.getAttribute("data-theme") === "dark") {
      navbar.style.background = "rgba(17, 24, 39, 0.98)";
    }
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    if (body.getAttribute("data-theme") === "dark") {
      navbar.style.background = "rgba(17, 24, 39, 0.95)";
    }
  }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Scroll Animation Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, observerOptions);

// Observe all scroll-animate elements
document.querySelectorAll(".scroll-animate").forEach((el) => {
  observer.observe(el);
});

// Mobile Menu Toggle (for future enhancement)
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

//Handle Submission Form
// Google Sheet AppScript url
const scriptUrl =
  "https://script.google.com/macros/s/AKfycbzwsFhTcRBFXIf3hOFRGOmBBuBv9YIO-P_y6t7wRkwe_zqhI7GhqKVF-LOUITJ1RWEx/exec";

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = grecaptcha.getResponse(); // Get reCAPTCHA token
    if (!token) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    const formData = new FormData(form);
    const payload = {
      token,
      type: form.classList.contains("review-form") ? "review" : "contact",
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      book: formData.get("book"),
      rating: formData.get("rating"),
      review: formData.get("review"),
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });
      

      const result = await res.json();

      if (result.success) {
        form.reset();
        grecaptcha.reset();
        showPopup("✅ Submitted successfully!");
      } else {
        showPopup("❌ reCAPTCHA failed.");
      }
    } catch (err) {
      showPopup("❌ Something went wrong.");
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
});

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}

/*
document
  .getElementById("reviewForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    sendForm("reviewForm");
  });
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    sendForm("contactForm", scriptUrl);
  });

function sendForm(formId) {
  var a, b, c, d;

  if (formId === "reviewForm") {
    a = document.getElementById("reviewerName").value;
    b = document.getElementById("bookTitle").value;
    c = document.getElementById("rating").value;
    d = document.getElementById("review").value;
  } else {
    a = document.getElementById("name").value;
    b = document.getElementById("email").value;
    c = document.getElementById("subject").value;
    d = document.getElementById("message").value;
  }

  if (a && b && c && d) {
    // Form data to send
    var form_Data = {
      a: a,
      b: b,
      c: c,
      d: d,
      key: formId,
    };
    console.log("Form Data: ", form_Data);

    // Post Data to dB
    fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify(form_Data),
    })
      .then((response) => {
        console.log(response);
        // Show success message
        showPopup("✅ Submission successful!");
      })
      .then(() => {});

    // Clear the form
    document.getElementById(formId).reset();
  }
}

function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.background = "#10B981";
  popup.style.color = "white";
  popup.style.padding = "10px 20px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  popup.style.zIndex = 9999;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4000);
}
*/

// Add typing animation to hero tagline
const tagline = document.querySelector(".hero-tagline");
const taglineText = tagline.textContent;
tagline.textContent = "";

let i = 0;
function typeWriter() {
  if (i < taglineText.length) {
    tagline.textContent += taglineText.charAt(i);
    i++;
    setTimeout(typeWriter, 30);
  }
}

// Start typing animation after a delay
setTimeout(typeWriter, 1500);

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");
  const heroImage = document.querySelector(".hero-image");

  if (scrolled < hero.offsetHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
  }
});

// Add book card hover effects
document.querySelectorAll(".book-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-15px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(-10px) scale(1)";
  });
});

// Add stats counter animation
function animateStats() {
  const stats = document.querySelectorAll(".stat-number");
  const statsSection = document.querySelector(".stats");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        stats.forEach((stat) => {
          const target = parseInt(stat.textContent.replace(/[^\d]/g, ""));
          const suffix = stat.textContent.replace(/[\d]/g, "");
          let current = 0;
          const increment = target / 50;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current) + suffix;
            }
          }, 50);
        });
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(statsSection);
}

animateStats();

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Update navbar background on theme change
const updateNavbarTheme = () => {
  const navbar = document.getElementById("navbar");
  const currentTheme = body.getAttribute("data-theme");

  if (window.scrollY > 100) {
    navbar.style.background =
      currentTheme === "dark"
        ? "rgba(17, 24, 39, 0.98)"
        : "rgba(255, 255, 255, 0.98)";
  } else {
    navbar.style.background =
      currentTheme === "dark"
        ? "rgba(17, 24, 39, 0.95)"
        : "rgba(255, 255, 255, 0.95)";
  }
};

// Call updateNavbarTheme when theme changes
themeToggle.addEventListener("click", () => {
  setTimeout(updateNavbarTheme, 100);
});

//Style the reviews animation
const track = document.getElementById("testimonialTrack");
let position = 0;

function slideTestimonials() {
  const cardWidth = track.querySelector(".testimonial").offsetWidth + 24; // 24 = gap
  const totalCards = track.children.length;
  const totalWidth = cardWidth * totalCards;

  position -= cardWidth;
  if (Math.abs(position) >= totalWidth) {
    position = 0;
  }
  track.style.transform = `translateX(${position}px)`;
}
setInterval(slideTestimonials, 4000); // autoplay every 4 seconds

//Disable Right Click
document.addEventListener("contextmenu", (event) => event.preventDefault());
