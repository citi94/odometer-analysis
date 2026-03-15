document.addEventListener('DOMContentLoaded', () => {

    // ─── Scroll-triggered fade-up animations ───
    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-up').forEach((el) => fadeObserver.observe(el));

    // ─── Animated bar chart ───
    const barObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.bar-fill');
                    bars.forEach((bar, i) => {
                        setTimeout(() => bar.classList.add('animated'), i * 80);
                    });
                    barObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );
    const barContainer = document.querySelector('.interactive-bars');
    if (barContainer) barObserver.observe(barContainer);

    // ─── Hero stat counter animation ───
    const heroObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateHeroStats();
                    heroObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);

    function animateHeroStats() {
        const stats = [
            { el: document.querySelectorAll('.hero-stat-value')[0], end: 4.7, suffix: '%', decimals: 1 },
            { el: document.querySelectorAll('.hero-stat-value')[1], end: 1.3, suffix: 'M', decimals: 1 },
            { el: document.querySelectorAll('.hero-stat-value')[2], end: 760, suffix: 'M', decimals: 0 },
        ];
        stats.forEach(({ el, end, suffix, decimals }) => {
            if (!el) return;
            const duration = 1400;
            const startTime = performance.now();
            function tick(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * end;
                el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    // ─── Smooth anchor scroll with header offset ───
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 64;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── Tax impact calculator ───
    const rateInput = document.getElementById('rateInput');
    const mileageInput = document.getElementById('mileageInput');
    if (rateInput && mileageInput) {
        function updateCalc() {
            const rate = parseFloat(rateInput.value);
            const mileage = parseInt(mileageInput.value);
            const annualTax = (rate / 100) * mileage;
            const fleetSize = 27500000;
            const issueRate = 0.0467;
            const affected = Math.round(fleetSize * issueRate);
            const appealRate = 0.10;
            const disputes = Math.round(affected * appealRate);

            document.getElementById('rateDisplay').textContent = rate + 'p/mile';
            document.getElementById('mileageDisplay').textContent = mileage.toLocaleString() + ' miles';
            document.getElementById('annualTax').innerHTML = '&pound;' + Math.round(annualTax).toLocaleString();
            document.getElementById('affectedDrivers').textContent = (affected / 1e6).toFixed(1) + 'M';
            document.getElementById('disputes').textContent = Math.round(disputes / 1000) + 'K';

            // Error cost scales with rate
            const lowErr = Math.round(rate * 100);
            const highErr = Math.round(rate * 750);
            document.getElementById('errorCost').innerHTML = '&pound;' + lowErr.toLocaleString() + '&ndash;' + highErr.toLocaleString() + '+';
        }

        rateInput.addEventListener('input', updateCalc);
        mileageInput.addEventListener('input', updateCalc);
        updateCalc();
    }

    // ─── Accordion ───
    document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.accordion-item.open').forEach((openItem) => {
                openItem.classList.remove('open');
                openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked
            if (!isOpen) {
                item.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ─── Active nav highlighting on scroll ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    let ticking = false;

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        let current = '';
        sections.forEach((section) => {
            if (section.offsetTop <= scrollY) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateActiveNav);
            ticking = true;
        }
    });
});
