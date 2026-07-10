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
        if (lang === 'hi') {
            body.classList.remove('lang-en');
            body.classList.add('lang-hi');
            localStorage.setItem('prefLanguage', 'hi');
            if (langToggle) langToggle.innerHTML = '<span class="hi-label">English</span>';
        } else {
            body.classList.remove('lang-hi');
            body.classList.add('lang-en');
            localStorage.setItem('prefLanguage', 'en');
            if (langToggle) langToggle.innerHTML = '<span class="en-label">हिन्दी</span>';
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
            const reason = document.getElementById('reason').value;
            const date = document.getElementById('pref-date').value;

            // Set phone numbers in modal
            if (confirmPhone) confirmPhone.textContent = phoneNumber;
            if (confirmPhoneHi) confirmPhoneHi.textContent = phoneNumber;

            // Open Modal
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
});
