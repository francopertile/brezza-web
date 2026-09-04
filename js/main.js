/* =============================================
   BREZZA — Main JS
   Mantenelo simple. Sin frameworks.
   ============================================= */

(function() {
    'use strict';

    // ---------- Header scroll (auto-hide on scroll down, show on scroll up) ----------
    const header = document.getElementById('siteHeader');
    if (header) {
        let lastScrollY = window.scrollY;
        const scrollThreshold = 8;

        const onScroll = () => {
            const currentScrollY = window.scrollY;

            // Background fill toggle
            if (currentScrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide on scroll down, show on scroll up
            if (currentScrollY > 100 && currentScrollY > lastScrollY + scrollThreshold) {
                // Scrolling down -> hide navbar
                header.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY - scrollThreshold || currentScrollY <= 60) {
                // Scrolling up or at top -> show navbar
                header.classList.remove('header-hidden');
            }

            lastScrollY = Math.max(0, currentScrollY);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ---------- Mobile nav ----------
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const open = siteNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        // Close on link click
        siteNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                siteNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---------- Hero slideshow ----------
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('heroDots');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && dotsContainer) {
        // Helper to load slide background on demand
        function loadSlideBg(slideEl) {
            if (slideEl && slideEl.dataset.bg) {
                slideEl.style.backgroundImage = `url('${slideEl.dataset.bg}')`;
                delete slideEl.dataset.bg;
            }
        }

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
            dot.dataset.index = i;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            const nextIndex = (index + slides.length) % slides.length;
            
            // Ensure next slide image is loaded before activating
            loadSlideBg(slides[nextIndex]);

            // Also preload the one after next
            const upcomingIndex = (nextIndex + 1) % slides.length;
            loadSlideBg(slides[upcomingIndex]);

            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = nextIndex;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        // Preload rest of slides once page has fully loaded
        window.addEventListener('load', () => {
            // Wait 1.5s after load to not compete with critical rendering
            setTimeout(() => {
                slides.forEach(s => loadSlideBg(s));
            }, 1500);
        });

        // Auto rotate
        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 10000);
        }
        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        startSlideshow();

        // Pause on hover
        const hero = document.getElementById('hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopSlideshow);
            hero.addEventListener('mouseleave', startSlideshow);
        }
    }

    // ---------- Tipologías tabs ----------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById('tab-' + target);
            if (panel) panel.classList.add('active');
        });
    });

    // ---------- Gallery Lightbox ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryLinks = document.querySelectorAll('[data-lightbox]');

    if (lightbox && lightboxImg && lightboxClose) {
        galleryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const img = link.querySelector('img');
                if (img) {
                    lightboxImg.src = link.href;
                    lightboxImg.alt = img.alt || '';
                    lightbox.classList.add('open');
                    lightbox.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });
    }

    // ---------- Forms ----------
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = '#cf2e2e';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!valid) {
                alert('Por favor completá todos los campos requeridos.');
                return;
            }

            // Show success
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = '¡Gracias! Te contactaremos pronto';
            btn.disabled = true;
            btn.style.background = '#3A7A4F';
            btn.style.borderColor = '#3A7A4F';

            form.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 4000);
        });
    });

    // ---------- Reveal on scroll ----------
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));

        // Safety fallback: if for any reason observer doesn't fire (full-page screenshots, etc.),
        // reveal everything after 1.5s
        setTimeout(() => {
            revealElements.forEach(el => el.classList.add('in-view'));
        }, 1500);
    } else {
        // Fallback: show all
        revealElements.forEach(el => el.classList.add('in-view'));
    }

    // ---------- Smooth scroll for hash links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

})();
