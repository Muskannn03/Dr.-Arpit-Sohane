document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Language Switching Logic
    // -------------------------------------------------------------
    const body = document.body;
    const langToggle = document.getElementById('lang-toggle');
    const modalTitleEn = document.getElementById('modal-title-en');
    const modalTitleHi = document.getElementById('modal-title-hi');
    const modalDescEn = document.getElementById('modal-desc-en');
    const modalDescHi = document.getElementById('modal-desc-hi');

    function setLanguage(lang) {
        const langLabel = langToggle ? langToggle.querySelector('.lang-label') : null;
        if (lang === 'hi') {
            body.classList.remove('lang-en');
            body.classList.add('lang-hi');
            localStorage.setItem('prefLanguage', 'hi');
            if (langLabel) langLabel.textContent = 'E';
        } else {
            body.classList.remove('lang-hi');
            body.classList.add('lang-en');
            localStorage.setItem('prefLanguage', 'en');
            if (langLabel) langLabel.textContent = 'H';
        }
        // Update modal texts visibility if needed
        updateModalLanguage();
    }

    function updateModalLanguage() {
        const isHi = body.classList.contains('lang-hi');
        if (modalTitleEn && modalTitleHi && modalDescEn && modalDescHi) {
            modalTitleEn.style.display = isHi ? 'none' : 'block';
            modalTitleHi.style.display = isHi ? 'block' : 'none';
            modalDescEn.style.display = isHi ? 'none' : 'block';
            modalDescHi.style.display = isHi ? 'block' : 'none';
        }
    }

    // Toggle click listener
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            if (body.classList.contains('lang-en')) {
                setLanguage('hi');
            } else {
                setLanguage('en');
            }
        });
    }

    // Initialize Language from localStorage
    const savedLang = localStorage.getItem('prefLanguage') || 'en';
    setLanguage(savedLang);


    // -------------------------------------------------------------
    // 2. Mobile Menu Toggle
    // -------------------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars-staggered');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars-staggered');
            }
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars-staggered');
            }
        });
    });


    // -------------------------------------------------------------
    // 3. Navbar Styling on Scroll & Active Links
    // -------------------------------------------------------------
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Section Link Observer
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // triggers when section occupies center of screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // -------------------------------------------------------------
    // 4. Scroll-triggered animations
    // -------------------------------------------------------------
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animateObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, animateObserverOptions);

    animateElements.forEach(el => {
        animateObserver.observe(el);
    });


    // -------------------------------------------------------------
    // 5. Publications Filtering and Search
    // -------------------------------------------------------------
    const pubSearch = document.getElementById('pub-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pubCards = document.querySelectorAll('.pub-card');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterPublications() {
        pubCards.forEach(card => {
            const categories = card.getAttribute('data-categories').split(' ');
            const title = card.querySelector('.pub-title').textContent.toLowerCase();
            const authors = card.querySelector('.pub-authors').textContent.toLowerCase();
            const journal = card.querySelector('.pub-journal').textContent.toLowerCase();
            
            const matchesCategory = activeFilter === 'all' || categories.includes(activeFilter);
            const matchesSearch = title.includes(searchQuery) || 
                                  authors.includes(searchQuery) || 
                                  journal.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                // Trigger animation display refresh
                card.classList.add('appear');
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Filter button clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            filterPublications();
        });
    });

    // Search input typing
    if (pubSearch) {
        pubSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterPublications();
        });
    }


    // -------------------------------------------------------------
    // 6. Interactive Appointment Simulator Form & Modal
    // -------------------------------------------------------------
    const appointmentForm = document.getElementById('appointment-form');
    const confirmModal = document.getElementById('confirm-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const confirmPhone = document.getElementById('confirm-phone');
    const confirmPhoneHi = document.getElementById('confirm-phone-hi');

    // Set default date to tomorrow
    const prefDateInput = document.getElementById('pref-date');
    if (prefDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        prefDateInput.value = `${yyyy}-${mm}-${dd}`;
        prefDateInput.min = `${yyyy}-${mm}-${dd}`; // Restrict past dates
    }

    if (appointmentForm && confirmModal) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract form details
            const parentName = document.getElementById('parent-name').value;
            const babyName = document.getElementById('baby-name').value;
            const phoneNumber = document.getElementById('phone-number').value;
            const reasonSelect = document.getElementById('reason');
            const reasonText = reasonSelect.options[reasonSelect.selectedIndex].text;
            const date = document.getElementById('pref-date').value;
            const messageText = document.getElementById('message').value;

            // Select submit button and show loading state
            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            const origContent = submitBtn.innerHTML;
            const isHi = document.body.classList.contains('lang-hi');
            submitBtn.disabled = true;
            submitBtn.innerHTML = isHi ? 'भेजा जा रहा है...' : 'Sending Request...';

            const emailBody = `
Reason for Visit: ${reasonText}
Baby's Name/Age: ${babyName || 'Not specified'}
Preferred Date: ${date}
Additional Info: ${messageText || 'None'}
            `;

            // POST to serverless api endpoint
            fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: parentName,
                    phone: phoneNumber,
                    message: emailBody
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Email sent status:', data);
            })
            .catch(err => {
                console.error('Email error:', err);
            })
            .finally(() => {
                // Restore submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = origContent;

                // Set phone numbers in modal and open confirmation
                if (confirmPhone) confirmPhone.textContent = phoneNumber;
                if (confirmPhoneHi) confirmPhoneHi.textContent = phoneNumber;
                confirmModal.classList.add('active');

                // Reset form
                appointmentForm.reset();
                if (prefDateInput) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const yyyy = tomorrow.getFullYear();
                    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
                    const dd = String(tomorrow.getDate()).padStart(2, '0');
                    prefDateInput.value = `${yyyy}-${mm}-${dd}`;
                }
            });
        });
    }

    function closeModal() {
        if (confirmModal) confirmModal.classList.remove('active');
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeModal();
        }
    });

    // -------------------------------------------------------------
    // 7. Floating Medical Particles Spawner
    // -------------------------------------------------------------
    const particleContainer = document.getElementById('hero-particles');
    if (particleContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const particleSymbols = ['+', '•', '◦', '✚'];
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'medical-particle';
            particle.textContent = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
            
            // Random attributes
            const leftVal = 65 + Math.random() * 30; // right side only
            const topVal = Math.random() * 100;
            const sizeVal = 10 + Math.random() * 16;
            const opacityVal = 0.03 + Math.random() * 0.1;
            const durationVal = 12 + Math.random() * 18;
            const delayVal = Math.random() * -20;
            
            particle.style.left = `${leftVal}%`;
            particle.style.top = `${topVal}%`;
            particle.style.fontSize = `${sizeVal}px`;
            particle.style.setProperty('--particle-opacity', opacityVal);
            particle.style.animationDuration = `${durationVal}s`;
            particle.style.animationDelay = `${delayVal}s`;
            
            particleContainer.appendChild(particle);
        }
    }

    // -------------------------------------------------------------
    // 8. Doctor Card Mouse Parallax 3D Tilt
    // -------------------------------------------------------------
    const imageContainer = document.querySelector('.hero-image-container');
    
    if (imageContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        imageContainer.addEventListener('mousemove', (e) => {
            const rect = imageContainer.getBoundingClientRect();
            // Get mouse position relative to container
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Convert to percentage offsets from center (-0.5 to 0.5)
            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;
            
            // Calculate tilt degrees (max 2.5 degrees)
            const tiltY = xPct * 5; // horizontal mouse offset tilts around Y axis
            const tiltX = -yPct * 5; // vertical mouse offset tilts around X axis
            
            // Apply transformation
            imageContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            imageContainer.style.transition = 'transform 0.1s ease-out';
        });
        
        // Reset tilt on mouseleave
        imageContainer.addEventListener('mouseleave', () => {
            imageContainer.style.transform = 'rotateX(0deg) rotateY(0deg)';
            imageContainer.style.transition = 'transform 0.5s ease-out';
        });
    }

    // -------------------------------------------------------------
    // 9. Statistics Card Smooth Count-Up Effect (1s duration)
    // -------------------------------------------------------------
    function animateCountUp(element, target, duration = 1000) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            const currentValue = Math.floor(easedProgress * target);
            element.textContent = `${currentValue}+`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Trigger count-up staggered with card entrance (approx 1s delay)
    setTimeout(() => {
        const statElements = document.querySelectorAll('.stat-card h3');
        statElements.forEach(el => {
            const text = el.textContent;
            const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(num)) {
                animateCountUp(el, num, 1000);
            }
        });
    }, 1000);

    // -------------------------------------------------------------
    // 10. Premium Page Transitions (Fade Transitions)
    // -------------------------------------------------------------
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    // Fade out overlay on load
    setTimeout(() => {
        overlay.classList.add('fade-out');
    }, 50);

    // Intercept internal page link clicks
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // Only transition for local HTML files (index.html, card.html)
        if (href && (href === 'card.html' || href === 'index.html') && (!target || target !== '_blank')) {
            e.preventDefault();
            overlay.classList.remove('fade-out');
            setTimeout(() => {
                window.location.href = href;
            }, 350);
        }
    });
});

