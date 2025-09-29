
        // Enhanced Typewriter Effect
        const typewriter = document.getElementById('typewriter');
        const texts = [
            'Hardware & Software Engineer',
            'IoT Solutions Architect',
            'Embedded Systems Developer',
            'AI & Machine Learning Engineer',
            'Full-Stack Developer',
            'Tech Innovation Catalyst'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeText() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typewriter.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriter.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeText, typeSpeed);
        }

        // Start typewriter effect
        typeText();

        // Enhanced Section Navigation
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Remove active class from all nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected section with animation
            const targetSection = document.getElementById(sectionId);
            targetSection.classList.add('active');

            // Add active class to clicked nav button
            event.target.classList.add('active');

            // Scroll content area to top smoothly
            document.querySelector('.content-area').scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Enhanced Card Animations
        function initializeCardAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe all cards
            document.querySelectorAll('.skill-category, .portfolio-item, .service-card, .contact-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                observer.observe(card);
            });
        }

        // Parallax Effect for Background
        function initializeParallax() {
            const bg = document.querySelector('.animated-bg');

            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;

                bg.style.background = `
                    radial-gradient(circle at ${x}% ${y}%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 40% 60%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)
                `;
            });
        }

        // Smooth Scrolling for Internal Links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1);
                if (target && document.getElementById(target)) {
                    showSection(target);
                }
            });
        });

        // Keyboard Navigation Enhancement
        document.addEventListener('keydown', function (e) {
            const sections = ['home', 'about', 'skills', 'portfolio', 'services', 'contact'];
            const activeSection = document.querySelector('.content-section.active').id;
            const currentIndex = sections.indexOf(activeSection);

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % sections.length;
                const nextButton = document.querySelector(`[onclick="showSection('${sections[nextIndex]}')"]`);
                nextButton.click();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
                const prevButton = document.querySelector(`[onclick="showSection('${sections[prevIndex]}')"]`);
                prevButton.click();
            }
        });

        // Loading Animation for Stats
        function animateStats() {
            const stats = document.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                const target = parseInt(stat.textContent);
                const suffix = stat.textContent.replace(/[0-9]/g, '');
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.ceil(current) + suffix;
                    }
                }, 30);
            });
        }

        // Dark Theme Toggle (Optional Enhancement)
        function initializeTheme() {
            // Add theme switcher if needed
            const root = document.documentElement;

            // Optional: Add theme toggle button
            // This could be expanded to switch between different dark themes
        }

        // Performance Optimization
        function optimizePerformance() {
            // Lazy load images when they come into view
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('loading');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // Enhanced Mobile Experience
        function initializeMobile() {
            // Touch gesture support for mobile navigation
            let startX = 0;
            let startY = 0;

            document.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            document.addEventListener('touchend', (e) => {
                if (!startX || !startY) return;

                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;

                const diffX = startX - endX;
                const diffY = startY - endY;

                // Swipe detection
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (Math.abs(diffX) > 50) {
                        const sections = ['home', 'about', 'skills', 'portfolio', 'services', 'contact'];
                        const activeSection = document.querySelector('.content-section.active').id;
                        const currentIndex = sections.indexOf(activeSection);

                        if (diffX > 0 && currentIndex < sections.length - 1) {
                            // Swipe left - next section
                            const nextButton = document.querySelector(`[onclick="showSection('${sections[currentIndex + 1]}')"]`);
                            nextButton.click();
                        } else if (diffX < 0 && currentIndex > 0) {
                            // Swipe right - previous section
                            const prevButton = document.querySelector(`[onclick="showSection('${sections[currentIndex - 1]}')"]`);
                            prevButton.click();
                        }
                    }
                }

                startX = 0;
                startY = 0;
            });
        }

        // Accessibility Enhancements
        function initializeAccessibility() {
            // Add focus indicators and keyboard navigation hints
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });

            // Add ARIA labels and descriptions
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-selected', btn.classList.contains('active'));
            });
        }

        // Initialize everything when DOM is loaded
        document.addEventListener('DOMContentLoaded', function () {
            // Initialize all enhancements
            initializeCardAnimations();
            initializeParallax();
            initializeMobile();
            initializeAccessibility();
            optimizePerformance();

            // Animate stats when home section is viewed
            const homeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.id === 'home') {
                        animateStats();
                        homeObserver.unobserve(entry.target);
                    }
                });
            });

            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeObserver.observe(homeSection);
            }

            // Add loading states and smooth transitions
            document.querySelectorAll('.skill-category, .portfolio-item, .service-card').forEach(el => {
                el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            console.log('🚀 TRM Portfolio initialized successfully!');
        });

        // Contact form enhancement (if form is added later)
        function initializeContactForm() {
            const form = document.getElementById('contactForm');
            if (form) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();

                    // Add loading state
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;

                    // Simulate form submission
                    setTimeout(() => {
                        submitBtn.textContent = 'Message Sent!';
                        submitBtn.style.background = 'var(--success-color)';

                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = '';
                            form.reset();
                        }, 2000);
                    }, 1500);
                });
            }
        }

        // Dynamic copyright year
        const currentYear = new Date().getFullYear();
        const copyrightElement = document.querySelector('.copyright');
        if (copyrightElement) {
            copyrightElement.textContent = `© ${currentYear} Tawanda Ronald Munyanyi. All rights reserved.`;
        }
    
