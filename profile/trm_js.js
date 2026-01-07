// ==================== SMOOTH SCROLLING & NAVIGATION ====================
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Add shadow to nav on scroll
        const nav = document.querySelector('.main-nav');
        if (scrollY > 50) {
            nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
    
    // ==================== MOBILE MENU ====================
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // ==================== ANIMATED COUNTERS ====================
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;
    
    function animateCounters() {
        if (counted) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + '+';
                }
            };
            
            updateCounter();
        });
        
        counted = true;
    }
    
    // Trigger counter animation when hero section is visible
    const heroSection = document.querySelector('.hero-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    if (heroSection) {
        observer.observe(heroSection);
    }
    
    // ==================== PARTICLE ANIMATION ====================
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random animation duration
            const duration = Math.random() * 10 + 10;
            particle.style.animation = `particleFloat ${duration}s linear infinite`;
            
            // Random delay
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            // Random color
            const colors = ['#00d4ff', '#7b2cbf', '#ff006e'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.position = 'absolute';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particle.style.pointerEvents = 'none';
            
            particlesContainer.appendChild(particle);
        }
    }
    
    createParticles();
    
    // ==================== CARD ANIMATIONS ====================
    const cards = document.querySelectorAll('.expertise-card, .project-card, .research-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });
    
    // ==================== ORBIT NODE TOOLTIPS ====================
    const orbitNodes = document.querySelectorAll('.orbit-node');
    
    orbitNodes.forEach(node => {
        const tech = node.getAttribute('data-tech');
        
        node.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'orbit-tooltip';
            tooltip.textContent = tech;
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0, 212, 255, 0.9)';
            tooltip.style.color = '#0a0e27';
            tooltip.style.padding = '8px 16px';
            tooltip.style.borderRadius = '8px';
            tooltip.style.fontSize = '14px';
            tooltip.style.fontWeight = '600';
            tooltip.style.top = '-40px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '1000';
            
            this.appendChild(tooltip);
        });
        
        node.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.orbit-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // ==================== TYPEWRITER EFFECT ====================
    const typewriterTexts = [
        'IoT Engineer',
        'AI Specialist',
        'Embedded Systems Developer',
        'Full-Stack Developer',
        'Automation Expert',
        'Edge Computing Enthusiast'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typewriterElement = document.querySelector('.hero-description strong');
    
    if (!typewriterElement) {
        // Create a new element if it doesn't exist
        const heroDesc = document.querySelector('.hero-description');
        if (heroDesc) {
            typewriterElement = document.createElement('strong');
            typewriterElement.style.color = '#00d4ff';
            heroDesc.insertBefore(typewriterElement, heroDesc.firstChild);
        }
    }
    
    function typeWriter() {
        if (!typewriterElement) return;
        
        const currentText = typewriterTexts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typewriterTexts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
    
    // ==================== GLITCH EFFECT ON HOVER ====================
    const logoGlitch = document.querySelector('.logo-glitch');
    
    if (logoGlitch) {
        logoGlitch.addEventListener('mouseenter', function() {
            this.style.animation = 'glowPulse 0.5s ease-in-out';
        });
        
        logoGlitch.addEventListener('animationend', function() {
            this.style.animation = 'glowPulse 2s ease-in-out infinite';
        });
    }
    
    // ==================== PARALLAX EFFECT ====================
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual, .orbit-ring');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ==================== CURSOR TRAIL EFFECT ====================
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 20;
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.life = 1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.02;
            if (this.size > 0.2) this.size -= 0.05;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 212, 255, ${this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(mouseX, mouseY));
        }
    });
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0 || particles[i].size <= 0.2) {
                particles.splice(i, 1);
                i--;
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // ==================== RESIZE HANDLER ====================
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // ==================== LAZY LOADING IMAGES ====================
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ==================== ACCESSIBILITY ====================
    // Keyboard navigation for cards
    const focusableCards = document.querySelectorAll('.expertise-card, .project-card');
    
    focusableCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('a');
                if (link) link.click();
            }
        });
    });
    
    // ==================== PREFERS REDUCED MOTION ====================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
    
    console.log('TRM Portfolio Loaded Successfully! 🚀');
});

// ==================== CSS ANIMATION KEYFRAMES ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .nav-links.active {
        display: flex !important;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            right: 0;
            background: rgba(10, 14, 39, 0.98);
            backdrop-filter: blur(20px);
            width: 250px;
            height: calc(100vh - 70px);
            flex-direction: column;
            padding: 2rem;
            display: none;
            border-left: 1px solid rgba(0, 212, 255, 0.2);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
        }
        
        .mobile-menu-toggle {
            display: flex;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);
