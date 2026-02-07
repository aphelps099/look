/**
 * Look Serious — Salient Child Theme JavaScript
 * Scroll animations, grain texture, rotating words, and branded interactions.
 *
 * @version 1.0.0
 */

(function () {
    'use strict';

    /* ══════════════════════════════════════════
       1. INTERSECTION OBSERVER — Scroll Reveal
       ══════════════════════════════════════════ */

    function initScrollReveal() {
        var observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ls-visible');
                }
            });
        }, observerOptions);

        // Observe all Look Serious reveal elements
        var revealSelectors = [
            '.ls-reveal',
            '.ls-fade-in',
            '.ls-statement-text',
            '.ls-statement-caption',
            '.ls-pillar',
            '.ls-belief',
            '.ls-case-study',
            '.ls-method-component',
            '.ls-cta-tagline',
            '.ls-cta-headline',
            '.ls-cta-button',
            '.ls-cta-email',
            '.ls-cta-note'
        ];

        var elements = document.querySelectorAll(revealSelectors.join(', '));
        elements.forEach(function (el) {
            observer.observe(el);
        });

        // Also observe common Salient elements for the reveal effect
        var salientSelectors = [
            '.wpb_text_column',
            '.nectar-milestone',
            '.img-with-aniamtion',
            '.nectar-icon-list',
            '.nectar_team_member',
            '.testimonial_slider',
            '.portfolio-items .portfolio-item'
        ];

        var salientElements = document.querySelectorAll(salientSelectors.join(', '));
        salientElements.forEach(function (el) {
            // Only add reveal class if not already handled by Salient's own animations
            if (!el.classList.contains('animated-in') && !el.dataset.delay) {
                el.classList.add('ls-reveal');
                observer.observe(el);
            }
        });
    }

    /* ══════════════════════════════════════════
       2. ROTATING WORD ANIMATION
       ══════════════════════════════════════════ */

    function initRotatingWords() {
        var rotatingElements = document.querySelectorAll('[data-ls-words]');

        rotatingElements.forEach(function (el) {
            var words;
            try {
                words = JSON.parse(el.getAttribute('data-ls-words'));
            } catch (e) {
                return;
            }

            if (!words || words.length < 2) return;

            var currentIndex = 0;
            var isAnimating = false;
            var isInView = false;
            var lastScrollY = window.scrollY;
            var scrollAccumulator = 0;
            var scrollThreshold = 250;

            // IntersectionObserver to track visibility
            var visibilityObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    isInView = entry.isIntersecting;
                    if (isInView) {
                        lastScrollY = window.scrollY;
                        scrollAccumulator = 0;
                    }
                });
            }, { threshold: 0.3 });

            var parentSection = el.closest('section') || el.closest('.vc_row') || el.parentElement;
            if (parentSection) {
                visibilityObserver.observe(parentSection);
            }

            function swapWord(direction) {
                if (isAnimating) return;
                isAnimating = true;

                el.style.opacity = '0';
                el.style.transform = 'translateY(-10px)';

                setTimeout(function () {
                    if (direction === 'down') {
                        currentIndex = (currentIndex + 1) % words.length;
                    } else {
                        currentIndex = (currentIndex - 1 + words.length) % words.length;
                    }

                    el.textContent = words[currentIndex];
                    el.style.transform = 'translateY(10px)';

                    requestAnimationFrame(function () {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        isAnimating = false;
                    });
                }, 300);
            }

            // Auto-rotate (fallback if no scroll interaction)
            var autoInterval = setInterval(function () {
                if (isInView && !isAnimating) {
                    swapWord('down');
                }
            }, 3000);

            // Scroll-triggered rotation
            window.addEventListener('scroll', function () {
                if (!isInView) return;

                var currentScrollY = window.scrollY;
                var scrollDelta = currentScrollY - lastScrollY;
                scrollAccumulator += scrollDelta;

                if (Math.abs(scrollAccumulator) >= scrollThreshold) {
                    var direction = scrollAccumulator > 0 ? 'down' : 'up';
                    swapWord(direction);
                    scrollAccumulator = 0;
                    // Reset auto-rotate timer when scroll-triggered
                    clearInterval(autoInterval);
                    autoInterval = setInterval(function () {
                        if (isInView && !isAnimating) {
                            swapWord('down');
                        }
                    }, 3000);
                }

                lastScrollY = currentScrollY;
            }, { passive: true });

            // Set initial styles for transition
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.display = 'inline-block';
        });
    }

    /* ══════════════════════════════════════════
       3. STRIKETHROUGH ANIMATION
       ══════════════════════════════════════════ */

    function initStrikethroughAnimation() {
        var strikeElements = document.querySelectorAll('.ls-strikethrough-wrap');

        strikeElements.forEach(function (el) {
            // Set up the CSS for the ::after pseudo-element via a class
            el.style.position = 'relative';
            el.style.display = 'inline';

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        el.classList.add('ls-strike-animate');
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(el);
        });

        // Inject the strikethrough animation CSS if not already present
        if (!document.getElementById('ls-strike-styles')) {
            var style = document.createElement('style');
            style.id = 'ls-strike-styles';
            style.textContent = [
                '.ls-strikethrough-wrap::after {',
                '    content: "";',
                '    position: absolute;',
                '    left: 0;',
                '    top: 50%;',
                '    width: 0;',
                '    height: 0.12em;',
                '    background: var(--ls-accent, #e04a2f);',
                '    transform: translateY(-50%);',
                '    transition: none;',
                '}',
                '.ls-strikethrough-wrap.ls-strike-animate::after {',
                '    animation: ls-strikethrough 0.5s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;',
                '}'
            ].join('\n');
            document.head.appendChild(style);
        }
    }

    /* ══════════════════════════════════════════
       4. SMOOTH HEADER BACKGROUND ON SCROLL
       ══════════════════════════════════════════ */

    function initHeaderScroll() {
        var header = document.getElementById('header-outer');
        if (!header) return;

        var scrollThreshold = 80;

        window.addEventListener('scroll', function () {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('ls-header-scrolled');
            } else {
                header.classList.remove('ls-header-scrolled');
            }
        }, { passive: true });

        // Inject header scroll styles
        if (!document.getElementById('ls-header-scroll-styles')) {
            var style = document.createElement('style');
            style.id = 'ls-header-scroll-styles';
            style.textContent = [
                '#header-outer.ls-header-scrolled {',
                '    background-color: rgba(5, 5, 5, 0.9) !important;',
                '    backdrop-filter: blur(20px);',
                '    -webkit-backdrop-filter: blur(20px);',
                '    border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;',
                '}'
            ].join('\n');
            document.head.appendChild(style);
        }
    }

    /* ══════════════════════════════════════════
       5. BUTTON HOVER GLOW EFFECT
       ══════════════════════════════════════════ */

    function initButtonGlow() {
        // Inject glow effect styles for CTA buttons
        if (!document.getElementById('ls-glow-styles')) {
            var style = document.createElement('style');
            style.id = 'ls-glow-styles';
            style.textContent = [
                '.ls-glow-button {',
                '    position: relative;',
                '    overflow: visible;',
                '}',
                '.ls-glow-button::after {',
                '    content: "";',
                '    position: absolute;',
                '    top: 100%;',
                '    left: 50%;',
                '    transform: translateX(-50%);',
                '    width: 200%;',
                '    height: 200px;',
                '    background: radial-gradient(ellipse at top, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 30%, transparent 70%);',
                '    opacity: 0;',
                '    transition: opacity 0.5s ease;',
                '    pointer-events: none;',
                '    z-index: -1;',
                '}',
                '.ls-glow-button::before {',
                '    content: "";',
                '    position: absolute;',
                '    top: 100%;',
                '    left: 50%;',
                '    transform: translateX(-50%);',
                '    width: 250%;',
                '    height: 180px;',
                '    background-image: url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E");',
                '    mask-image: radial-gradient(ellipse at top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 70%);',
                '    -webkit-mask-image: radial-gradient(ellipse at top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 70%);',
                '    opacity: 0;',
                '    transition: opacity 0.5s ease;',
                '    pointer-events: none;',
                '    z-index: -1;',
                '}',
                '.ls-glow-button:hover::after {',
                '    opacity: 1;',
                '}',
                '.ls-glow-button:hover::before {',
                '    opacity: 0.06;',
                '}'
            ].join('\n');
            document.head.appendChild(style);
        }

        // Apply glow class to primary CTA buttons
        var ctaButtons = document.querySelectorAll(
            '.ls-cta-button, .ls-nav-cta, .ls-glow-button, ' +
            '#header-outer .menu-item.button_bordered > a, ' +
            '#header-outer .menu-item.button_solid_color > a'
        );

        ctaButtons.forEach(function (btn) {
            btn.classList.add('ls-glow-button');
        });
    }

    /* ══════════════════════════════════════════
       6. STAGGERED ENTRANCE ANIMATIONS
       ══════════════════════════════════════════ */

    function initStaggeredAnimations() {
        var staggerContainers = document.querySelectorAll('[data-ls-stagger]');

        staggerContainers.forEach(function (container) {
            var children = container.children;
            var delayStep = parseFloat(container.getAttribute('data-ls-stagger')) || 0.1;

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        Array.from(children).forEach(function (child, i) {
                            child.style.transitionDelay = (i * delayStep) + 's';
                            child.classList.add('ls-visible');
                        });
                        observer.unobserve(container);
                    }
                });
            }, { threshold: 0.2 });

            // Prepare children
            Array.from(children).forEach(function (child) {
                child.classList.add('ls-reveal');
            });

            observer.observe(container);
        });
    }

    /* ══════════════════════════════════════════
       7. SMOOTH SCROLL FOR ANCHOR LINKS
       ══════════════════════════════════════════ */

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '#top') return;

                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    var headerHeight = document.getElementById('header-outer')
                        ? document.getElementById('header-outer').offsetHeight
                        : 0;
                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ══════════════════════════════════════════
       8. CUSTOM CURSOR (optional — data attribute)
       ══════════════════════════════════════════ */

    function initCustomCursor() {
        if (!document.body.hasAttribute('data-ls-cursor')) return;
        if ('ontouchstart' in window) return; // Skip on touch devices

        var cursor = document.createElement('div');
        cursor.className = 'ls-cursor';
        var follower = document.createElement('div');
        follower.className = 'ls-cursor-follower';
        document.body.appendChild(cursor);
        document.body.appendChild(follower);

        var mouseX = 0, mouseY = 0;
        var followerX = 0, followerY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.transform = 'translate(' + followerX + 'px, ' + followerY + 'px)';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover state for links and buttons
        var hoverTargets = document.querySelectorAll('a, button, .nectar-button, input[type="submit"]');
        hoverTargets.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('ls-cursor-hover');
                follower.classList.add('ls-cursor-hover');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('ls-cursor-hover');
                follower.classList.remove('ls-cursor-hover');
            });
        });

        // Inject cursor styles
        var style = document.createElement('style');
        style.textContent = [
            'body[data-ls-cursor] { cursor: none; }',
            'body[data-ls-cursor] a, body[data-ls-cursor] button { cursor: none; }',
            '.ls-cursor {',
            '    position: fixed; top: -4px; left: -4px;',
            '    width: 8px; height: 8px;',
            '    background: var(--ls-white, #fff);',
            '    border-radius: 50%; pointer-events: none;',
            '    z-index: 99999; mix-blend-mode: difference;',
            '    transition: width 0.2s, height 0.2s, top 0.2s, left 0.2s;',
            '}',
            '.ls-cursor-follower {',
            '    position: fixed; top: -20px; left: -20px;',
            '    width: 40px; height: 40px;',
            '    border: 1px solid rgba(255,255,255,0.3);',
            '    border-radius: 50%; pointer-events: none;',
            '    z-index: 99998;',
            '    transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, border-color 0.3s;',
            '}',
            '.ls-cursor.ls-cursor-hover {',
            '    width: 12px; height: 12px; top: -6px; left: -6px;',
            '    background: var(--ls-accent, #e04a2f);',
            '}',
            '.ls-cursor-follower.ls-cursor-hover {',
            '    width: 60px; height: 60px; top: -30px; left: -30px;',
            '    border-color: var(--ls-accent, #e04a2f);',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    /* ══════════════════════════════════════════
       INITIALIZATION
       ══════════════════════════════════════════ */

    function init() {
        initScrollReveal();
        initRotatingWords();
        initStrikethroughAnimation();
        initHeaderScroll();
        initButtonGlow();
        initStaggeredAnimations();
        initSmoothScroll();
        initCustomCursor();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
