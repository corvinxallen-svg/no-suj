/* lastbtn.js */
document.addEventListener("DOMContentLoaded", () => {

    // =============================================
    // 1. BUTTON STAR GENERATION (original, sparse)
    // =============================================
    function generateStars(count, spread) {
        let stars = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * spread) - spread / 2;
            const y = Math.floor(Math.random() * spread) - spread / 2;
            const opacity = Math.random() * 0.6 + 0.4;
            stars.push(`${x}px ${y}px rgba(255, 255, 255, ${opacity})`);
        }
        return stars.join(', ');
    }
    document.getElementById('stars1').style.boxShadow = generateStars(100, 4000);
    document.getElementById('stars2').style.boxShadow = generateStars(50, 4000);
    document.getElementById('stars3').style.boxShadow = generateStars(20, 4000);

    // =============================================
    // 2. FULL‑PAGE STARFIELD (many more stars)
    // =============================================
    function generateFullpageStars(count) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let stars = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * (vw + 300)) - 150;
            const y = Math.floor(Math.random() * (vh + 300)) - 150;
            const opacity = Math.random() * 0.55 + 0.35;
            const r = 255;
            const g = Math.floor(Math.random() * 40) + 215;
            const b = Math.floor(Math.random() * 30) + 225;
            stars.push(`${x}px ${y}px rgba(${r}, ${g}, ${b}, ${opacity})`);
        }
        return stars.join(', ');
    }

    function populateFullpageStars() {
        document.getElementById('fp-stars1').style.boxShadow = generateFullpageStars(500);
        document.getElementById('fp-stars2').style.boxShadow = generateFullpageStars(200);
        document.getElementById('fp-stars3').style.boxShadow = generateFullpageStars(80);
        document.getElementById('fp-stars4').style.boxShadow = generateFullpageStars(140);
        document.getElementById('fp-stars5').style.boxShadow = generateFullpageStars(100);
    }
    populateFullpageStars();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(populateFullpageStars, 400);
    });

    // =============================================
    // 3. BUTTON ZOOM LOGIC
    // =============================================
    const spaceButton = document.querySelector('.btn');
    const spaceBg = document.getElementById('space-bg');
    const confessionWrapper = document.getElementById('confession-wrapper');
    const flashlight = document.getElementById('flashlight');
    const body = document.body;

    spaceButton.addEventListener('click', () => {
        spaceButton.classList.add('expanding');
        setTimeout(() => {
            spaceButton.classList.add('hidden-btn');
            spaceBg.classList.add('visible');
            confessionWrapper.classList.add('visible');
            body.classList.add('scrollable');

            // Activate flashlight mode
            flashlight.style.display = 'block';
            body.style.cursor = 'none';            // hide native cursor

            // Start observing texts
            setTimeout(() => {
                observeConfessionTexts();
            }, 200);
        }, 3500);
    });

    // =============================================
    // 4. FLASHLIGHT MOVEMENT
    // =============================================
    document.addEventListener('mousemove', (e) => {
        if (flashlight.style.display === 'block') {
            flashlight.style.left = e.clientX + 'px';
            flashlight.style.top = e.clientY + 'px';
        }
    });

    // =============================================
    // 5. INTERSECTION OBSERVER – slow staggered reveal
    // =============================================
    const confessionTexts = document.querySelectorAll('.confession-text');
    let observer = null;

    function observeConfessionTexts() {
        if (observer) observer.disconnect();

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index')) || 0;
                    const delay = index * 300;           // much slower stagger
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.15
        });

        confessionTexts.forEach(text => observer.observe(text));
    }

    // If already visible (e.g. tall screen), reveal immediately
    if (confessionWrapper.classList.contains('visible')) {
        observeConfessionTexts();
    }

    // Re‑trigger on resize
    window.addEventListener('resize', () => {
        if (confessionWrapper.classList.contains('visible')) {
            confessionTexts.forEach(text => text.classList.remove('revealed'));
            observeConfessionTexts();
        }
    });
});