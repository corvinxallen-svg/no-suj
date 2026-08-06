/* lastbtn.js */
document.addEventListener("DOMContentLoaded", () => {

    // ----- 1. BUTTON STARS -----
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

    // ----- 2. FULL‑PAGE STARS -----
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
    window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(populateFullpageStars, 400); });

    // ----- 3. BUTTON ZOOM -----
    const spaceButton = document.querySelector('.btn');
    const spaceBg = document.getElementById('space-bg');
    const confessionWrapper = document.getElementById('confession-wrapper');
    const flashlight = document.getElementById('flashlight');
    const zoomOverlay = document.getElementById('zoom-overlay');
    const body = document.body;
    const choiceButtons = document.querySelector('.choice-buttons');

    spaceButton.addEventListener('click', () => {
        zoomOverlay.classList.add('active');
        spaceButton.classList.add('expanding');
        setTimeout(() => {
            spaceButton.classList.add('hidden-btn');
            spaceBg.classList.add('visible');
            confessionWrapper.classList.add('visible');
            body.classList.add('scrollable');
            flashlight.style.display = 'block';
            body.style.cursor = 'none';
            zoomOverlay.classList.remove('active');
            initScrollAnimations();
            setTimeout(() => { observeConfessionTexts(); }, 200);
        }, 4000);
    });

    // ----- 4. FLASHLIGHT -----
    document.addEventListener('mousemove', (e) => {
        if (flashlight.style.display === 'block') {
            flashlight.style.left = e.clientX + 'px';
            flashlight.style.top = e.clientY + 'px';
        }
    });

    // ----- 5. SCROLL ANIMATIONS -----
    function initScrollAnimations() {
        const texts = document.querySelectorAll('.confession-text');
        let lastScrollY = window.scrollY;
        let scrollSpeed = 0;
        let animationFrameId;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            scrollSpeed = Math.abs(currentScrollY - lastScrollY);
            lastScrollY = currentScrollY;
        });
        function animateTexts() {
            texts.forEach((text) => {
                if (text.classList.contains('revealed')) {
                    const rect = text.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const scrollProgress = (window.scrollY - rect.top + windowHeight) / (rect.height + windowHeight);
                    const smoothProgress = Math.max(0, Math.min(1, scrollProgress));
                    const parallaxOffset = (smoothProgress - 0.5) * 15;
                    text.style.transform = `translateX(${parallaxOffset}px)`;
                }
            });
            scrollSpeed *= 0.9;
            animationFrameId = requestAnimationFrame(animateTexts);
        }
        animationFrameId = requestAnimationFrame(animateTexts);
    }

    // ----- 6. INTERSECTION OBSERVER -----
    const confessionTexts = document.querySelectorAll('.confession-text');
    let observer = null;
    function observeConfessionTexts() {
        if (observer) observer.disconnect();
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index')) || 0;
                    const delay = index * 250;
                    setTimeout(() => { entry.target.classList.add('revealed'); }, delay);
                    if (index === 7) {
                        setTimeout(() => { choiceButtons.classList.add('visible'); }, delay + 500);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.15 });
        confessionTexts.forEach(text => observer.observe(text));
    }
    if (confessionWrapper.classList.contains('visible')) { observeConfessionTexts(); initScrollAnimations(); }
    window.addEventListener('resize', () => {
        if (confessionWrapper.classList.contains('visible')) {
            confessionTexts.forEach(text => text.classList.remove('revealed'));
            observeConfessionTexts();
        }
    });

    // ----- 7. NO BUTTON DODGE (FIXED - CLOSE MOVEMENT) -----
    const noBtn = document.getElementById('no-dodge-btn');
    const noBtnWrapper = document.getElementById('no-btn-wrapper');
    const speechBubble = document.getElementById('speech-bubble');
    const speechText = speechBubble.querySelector('.speech-text');
    const yesBtn = document.querySelector('.yes-btn');
    
    let dodgeCount = 0;
    const maxDodges = 3;
    let isDodging = false;
    let dodgeTimeout;
    
    const speechMessages = [
        { text: "please dontt", color: "color-green" },
        { text: "fr?", color: "color-yellow" },
        { text: "oky, i give up", color: "color-red" }
    ];
    
    function updateSpeechBubble() {
        const noRect = noBtn.getBoundingClientRect();
        // Position directly above the button, 10px gap
        speechBubble.style.left = (noRect.left + noRect.width / 2) + 'px';
        speechBubble.style.top = (noRect.top - 12) + 'px';
    }
    
    function showSpeechBubble(messageObj) {
        speechBubble.classList.remove('color-green', 'color-yellow', 'color-red', 'active');
        speechText.textContent = messageObj.text;
        speechBubble.classList.add(messageObj.color);
        
        updateSpeechBubble();
        
        requestAnimationFrame(() => {
            speechBubble.classList.add('active');
        });
        
        // Keep updating position while visible
        const updateInterval = setInterval(updateSpeechBubble, 16);
        
        setTimeout(() => {
            speechBubble.classList.remove('active');
            clearInterval(updateInterval);
        }, 2000);
    }
    
    // Update bubble position on scroll
    window.addEventListener('scroll', () => {
        if (speechBubble.classList.contains('active')) {
            updateSpeechBubble();
        }
    });
    
    function getDodgePosition(mouseX, mouseY) {
        const yesRect = yesBtn.getBoundingClientRect();
        const noRect = noBtn.getBoundingClientRect();
        const containerRect = choiceButtons.getBoundingClientRect();
        
        const btnWidth = noRect.width;
        const btnHeight = noRect.height;
        
        // Tightly constrained area around the buttons
        const padding = 30;
        const minX = containerRect.left - padding;
        const maxX = containerRect.right - btnWidth + padding;
        const minY = containerRect.top - padding;
        const maxY = containerRect.bottom - btnHeight + padding;
        
        // Yes button safe zone (slightly larger than the button)
        const yesSafeLeft = yesRect.left - 20;
        const yesSafeRight = yesRect.right + 20;
        const yesSafeTop = yesRect.top - 15;
        const yesSafeBottom = yesRect.bottom + 15;
        
        let attempts = 0;
        let bestX = minX, bestY = minY, bestDist = -Infinity;
        
        // Predefined dodge spots for reliable positioning
        const dodgeSpots = [
            { x: minX, y: minY },                                    // top-left
            { x: maxX, y: minY },                                    // top-right
            { x: minX, y: maxY },                                    // bottom-left
            { x: maxX, y: maxY },                                    // bottom-right
            { x: containerRect.left - padding, y: containerRect.top + containerRect.height/2 - btnHeight/2 },  // left center
            { x: containerRect.right - btnWidth + padding, y: containerRect.top + containerRect.height/2 - btnHeight/2 }, // right center
            { x: containerRect.left + containerRect.width/2 - btnWidth/2, y: minY },  // top center
            { x: containerRect.left + containerRect.width/2 - btnWidth/2, y: maxY },  // bottom center
        ];
        
        for (const spot of dodgeSpots) {
            const sx = spot.x;
            const sy = spot.y;
            
            // Check if overlaps Yes button
            if (sx + btnWidth > yesSafeLeft && sx < yesSafeRight &&
                sy + btnHeight > yesSafeTop && sy < yesSafeBottom) {
                continue;
            }
            
            const distFromCursor = Math.hypot(sx + btnWidth/2 - mouseX, sy + btnHeight/2 - mouseY);
            
            if (distFromCursor > bestDist) {
                bestDist = distFromCursor;
                bestX = sx;
                bestY = sy;
            }
        }
        
        return { x: bestX, y: bestY };
    }
    
    function moveNoButton(x, y) {
        const containerRect = choiceButtons.getBoundingClientRect();
        const relX = x - containerRect.left;
        const relY = y - containerRect.top;
        
        noBtnWrapper.style.position = 'absolute';
        noBtnWrapper.style.left = relX + 'px';
        noBtnWrapper.style.top = relY + 'px';
        
        // Update speech bubble position
        if (speechBubble.classList.contains('active')) {
            updateSpeechBubble();
        }
    }
    
    function resetToSidePosition() {
        const yesRect = yesBtn.getBoundingClientRect();
        const containerRect = choiceButtons.getBoundingClientRect();
        const noRect = noBtn.getBoundingClientRect();
        
        // Position exactly to the right of Yes button with gap
        const gap = 48;
        const targetX = yesRect.right + gap - containerRect.left;
        const targetY = yesRect.top + (yesRect.height/2) - (noRect.height/2) - containerRect.top;
        
        noBtnWrapper.style.position = 'absolute';
        noBtnWrapper.style.left = targetX + 'px';
        noBtnWrapper.style.top = targetY + 'px';
        noBtn.style.transform = 'none';
    }
    
    function triggerDodge(e) {
        if (dodgeCount >= maxDodges || isDodging) return;
        isDodging = true;
        
        showSpeechBubble(speechMessages[dodgeCount]);
        noBtn.classList.add('dodging');
        
        const newPos = getDodgePosition(e.clientX, e.clientY);
        moveNoButton(newPos.x, newPos.y);
        
        dodgeCount++;
        
        setTimeout(() => { noBtn.classList.remove('dodging'); }, 400);
        
        clearTimeout(dodgeTimeout);
        dodgeTimeout = setTimeout(() => {
            if (dodgeCount >= maxDodges) {
                noBtn.classList.add('dodge-accepted');
                noBtn.style.cursor = 'pointer';
                resetToSidePosition();
            }
            isDodging = false;
        }, 700);
    }
    
    // Proximity detection
    document.addEventListener('mousemove', (e) => {
        if (dodgeCount < maxDodges && !isDodging && choiceButtons.classList.contains('visible')) {
            const btnRect = noBtn.getBoundingClientRect();
            const proximityThreshold = 150;
            const distX = Math.abs(e.clientX - (btnRect.left + btnRect.width/2));
            const distY = Math.abs(e.clientY - (btnRect.top + btnRect.height/2));
            const distance = Math.hypot(distX, distY);
            
            if (distance < proximityThreshold) {
                triggerDodge(e);
            }
        }
    });
    
    noBtn.addEventListener('mouseenter', (e) => {
        if (dodgeCount < maxDodges) triggerDodge(e);
    });
    
    noBtn.addEventListener('click', (e) => {
        if (dodgeCount >= maxDodges) {
            e.stopPropagation();
            openModal(cardNo);
        } else {
            e.preventDefault();
        }
    });

    // ----- 8. YES / NO + MODAL -----
    const modal = document.getElementById('card-modal');
    const closeModal = document.querySelector('.modal-close');
    const cardYes = document.getElementById('card-yes');
    const cardNo = document.getElementById('card-no');

    function openModal(cardToShow) {
        cardYes.classList.remove('active');
        cardNo.classList.remove('active');
        cardToShow.classList.add('active');
        modal.classList.add('active');
        flashlight.style.display = 'none';
        body.style.cursor = 'default';
    }
    function closeModalFunc() {
        modal.classList.remove('active');
        if (body.classList.contains('scrollable')) {
            flashlight.style.display = 'block';
            body.style.cursor = 'none';
        }
    }

    yesBtn.addEventListener('click', () => openModal(cardYes));
    closeModal.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFunc(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModalFunc();
    });
});