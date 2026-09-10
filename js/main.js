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
    (function () {
        var slides = Array.from(document.querySelectorAll('.hero-slide'));
        if (slides.length < 2) return;   // nada que rotar

        // Precarga todas las imágenes de fondo ahora mismo
        slides.forEach(function (slide) {
            if (slide.dataset.bg) {
                slide.style.backgroundImage = "url('" + slide.dataset.bg + "')";
                slide.removeAttribute('data-bg');
            }
        });

        var currentSlide = 0;
        var slideTimer   = null;

        // --- Dots ---
        var dotsContainer = document.getElementById('heroDots');
        var dots = [];
        if (dotsContainer) {
            slides.forEach(function (_, i) {
                var dot = document.createElement('button');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
                dot.addEventListener('click', function () {
                    goToSlide(i);
                    resetTimer();
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            });
        }

        function goToSlide(index) {
            var next = ((index % slides.length) + slides.length) % slides.length;
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            currentSlide = next;
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function startTimer() {
            slideTimer = setInterval(function () {
                goToSlide(currentSlide + 1);
            }, 7000);
        }

        function stopTimer()  { clearInterval(slideTimer); }
        function resetTimer() { stopTimer(); startTimer(); }

        // Arranca
        startTimer();

        // Pausa cuando el mouse está sobre el hero
        var hero = document.getElementById('hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopTimer);
            hero.addEventListener('mouseleave', startTimer);
        }
    }());

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

    // ---------- Amenidades Carousel ----------
    (function () {
        var track = document.getElementById('carouselTrack');
        var slides = track ? track.children : [];
        if (!track || slides.length < 2) return;

        var current = 0;
        var total = slides.length;
        var timer = null;

        // Build dots
        var dotsWrap = document.getElementById('carouselDots');
        var dots = [];
        for (var i = 0; i < total; i++) {
            var d = document.createElement('button');
            d.className = 'c-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
            (function (idx) { d.addEventListener('click', function () { goTo(idx); resetAuto(); }); })(i);
            dotsWrap.appendChild(d);
            dots.push(d);
        }

        function goTo(idx) {
            current = ((idx % total) + total) % total;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dots.forEach(function (d, j) { d.classList.toggle('active', j === current); });
        }

        document.getElementById('carouselPrev').addEventListener('click', function () { goTo(current - 1); resetAuto(); });
        document.getElementById('carouselNext').addEventListener('click', function () { goTo(current + 1); resetAuto(); });

        function startAuto() { timer = setInterval(function () { goTo(current + 1); }, 6000); }
        function stopAuto() { clearInterval(timer); }
        function resetAuto() { stopAuto(); startAuto(); }

        startAuto();

        var carousel = document.getElementById('amenidadesCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAuto);
            carousel.addEventListener('mouseleave', startAuto);

            // Touch swipe support
            var touchStartX = 0;
            var touchEndX = 0;
            carousel.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
                stopAuto();
            }, { passive: true });
            carousel.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                var diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 45) {
                    if (diff > 0) goTo(current + 1);
                    else goTo(current - 1);
                }
                startAuto();
            }, { passive: true });
        }
    }());

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

    // ---------- Forms (mailto nativo) ----------
    // Los formularios usan action="mailto:..." nativo del navegador.
    // Solo resaltamos campos vacíos antes de enviar.
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
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
                e.preventDefault();
                alert('Por favor completá todos los campos requeridos.');
            }
            // Si es válido, el form envía normalmente vía mailto
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
