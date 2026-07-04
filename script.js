/**
 * Habiburrahman (Difzoon) - Multimedia Portfolio
 * Core JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const portfolioGrid = document.getElementById('portfolioGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    const mediaModal = document.getElementById('mediaModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    const modalMediaWrapper = document.getElementById('modalMediaWrapper');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDownloadBtn = document.getElementById('modalDownloadBtn');
    const contactForm = document.getElementById('contactForm');

    // State Variables
    let currentFilter = 'all';
    let visibleItemsCount = 9;
    const itemsPerLoad = 9;
    let filteredItems = [];
    let currentModalIndex = -1;

    /* ==========================================================================
       MOBILE NAVIGATION & HEADER SCROLL
       ========================================================================== */
    // Scroll event to shrink header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Dynamic navigation active state based on scroll section
        updateActiveNavLink();
    });

    // Mobile menu toggle
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Function to update active link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        let scrollPosition = window.scrollY + 180; // offset

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ==========================================================================
       PORTFOLIO GRID & FILTERING
       ========================================================================== */
    // Initialize portfolio items list from data
    function initPortfolio() {
        // Double check data presence
        if (typeof portfolioData === 'undefined') {
            console.error('Portfolio data not found!');
            portfolioGrid.innerHTML = '<p class="error-msg">Gagal memuat data portofolio.</p>';
            return;
        }

        filterItems();
    }

    // Filter portfolio items based on category
    function filterItems() {
        if (currentFilter === 'all') {
            filteredItems = portfolioData;
        } else {
            filteredItems = portfolioData.filter(item => item.category === currentFilter);
        }

        // Reset load count
        visibleItemsCount = itemsPerLoad;
        renderPortfolioGrid();
    }

    // Render cards to grid
    function renderPortfolioGrid() {
        portfolioGrid.innerHTML = '';

        if (filteredItems.length === 0) {
            portfolioGrid.innerHTML = '<p class="error-msg">Tidak ada karya yang sesuai dengan filter ini.</p>';
            loadMoreBtn.style.display = 'none';
            return;
        }

        const itemsToShow = filteredItems.slice(0, visibleItemsCount);

        itemsToShow.forEach((item, index) => {
            const card = createPortfolioCard(item, index);
            portfolioGrid.appendChild(card);
        });

        // Toggle load more button
        if (visibleItemsCount < filteredItems.length) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }

        // Trigger animations for newly rendered cards
        setTimeout(() => {
            const cards = portfolioGrid.querySelectorAll('.portfolio-card');
            cards.forEach(card => card.classList.add('fade-in'));
        }, 50);
    }

    // Create card DOM element
    function createPortfolioCard(item, index) {
        const card = document.createElement('div');
        card.className = 'portfolio-card';
        card.setAttribute('data-category', item.category);
        card.setAttribute('data-index', index);

        // Format category text
        const categoryMap = {
            'drone': 'Rekaman Drone',
            'video': 'Penyuntingan Video',
            'foto': 'Fotografi',
            'design': 'Desain Grafis'
        };
        const categoryText = categoryMap[item.category] || item.category;

        // Overlay Icon
        let overlayIcon = 'fa-plus';
        if (item.category === 'drone' || item.category === 'video') {
            overlayIcon = 'fa-play';
        } else {
            overlayIcon = 'fa-magnifying-glass';
        }

        card.innerHTML = `
            <div class="portfolio-media-container">
                <span class="portfolio-card-category">${categoryText}</span>
                <img src="${item.thumbnail}" alt="${item.title}" class="portfolio-img" loading="lazy">
                <div class="portfolio-overlay">
                    <div class="portfolio-icon">
                        <i class="fa-solid ${overlayIcon}"></i>
                    </div>
                </div>
            </div>
            <div class="portfolio-card-info">
                <h4 class="portfolio-card-title">${item.title}</h4>
                <p class="portfolio-card-desc">${item.description}</p>
            </div>
        `;

        // Click handler to open Lightbox Modal
        card.addEventListener('click', () => {
            openModal(index);
        });

        return card;
    }

    // Filter Buttons Event Listener
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to current
            e.target.classList.add('active');

            // Set current filter
            currentFilter = e.target.getAttribute('data-filter');

            // Grid fadeout animation then filter
            portfolioGrid.style.opacity = 0;
            portfolioGrid.style.transform = 'translateY(15px)';

            setTimeout(() => {
                filterItems();
                portfolioGrid.style.opacity = 1;
                portfolioGrid.style.transform = 'translateY(0)';
            }, 300);
        });
    });

    // Load More Button Event Listener
    loadMoreBtn.addEventListener('click', () => {
        visibleItemsCount += itemsPerLoad;
        renderPortfolioGrid();
    });

    /* ==========================================================================
       MODAL LIGHTBOX PLAYER
       ========================================================================== */
    function openModal(index) {
        currentModalIndex = index;
        const item = filteredItems[index];
        if (!item) return;

        // Reset wrapper content
        modalMediaWrapper.innerHTML = '<div class="modal-spinner" style="display:block;"></div>';

        // Show modal backdrop
        mediaModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll

        // Set metadata
        const categoryMap = {
            'drone': 'Videografi Udara / Drone',
            'video': 'Penyuntingan & Pascaproduksi Video',
            'foto': 'Karya Fotografi',
            'design': 'Desain Grafis & Tata Letak'
        };
        modalCategory.textContent = categoryMap[item.category] || item.category;
        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;
        modalDownloadBtn.href = item.file;

        // Load media content asynchronously
        const isVideo = item.category === 'drone' || item.category === 'video';

        if (isVideo) {
            const isYouTube = item.file.includes('youtube.com') || item.file.includes('youtu.be');
            
            if (isYouTube) {
                let videoId = '';
                if (item.file.includes('youtu.be/')) {
                    videoId = item.file.split('youtu.be/')[1].split('?')[0].split('&')[0];
                } else if (item.file.includes('youtube.com/embed/')) {
                    videoId = item.file.split('youtube.com/embed/')[1].split('?')[0].split('&')[0];
                } else {
                    videoId = item.file.split('v=')[1].split('&')[0];
                }
                
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.className = 'modal-video';
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', 'true');
                iframe.style.opacity = '0';
                iframe.style.transition = 'opacity 0.3s ease';
                iframe.style.border = 'none';

                iframe.addEventListener('load', () => {
                    const spinner = modalMediaWrapper.querySelector('.modal-spinner');
                    if (spinner) spinner.style.display = 'none';
                    iframe.style.opacity = '1';
                });

                modalMediaWrapper.appendChild(iframe);
            } else {
                const video = document.createElement('video');
                video.src = item.file;
                video.controls = true;
                video.autoplay = true;
                video.playsInline = true;
                video.className = 'modal-video';
                video.style.opacity = '0';
                video.style.transition = 'opacity 0.3s ease';

                video.addEventListener('loadeddata', () => {
                    const spinner = modalMediaWrapper.querySelector('.modal-spinner');
                    if (spinner) spinner.style.display = 'none';
                    video.style.opacity = '1';
                });

                video.addEventListener('error', () => {
                    modalMediaWrapper.innerHTML = '<p class="error-msg">Gagal memuat video. Format file mungkin tidak didukung oleh browser Anda.</p>';
                });

                modalMediaWrapper.appendChild(video);
            }
        } else {
            const img = document.createElement('img');
            img.src = item.file;
            img.alt = item.title;
            img.className = 'modal-img';
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';

            img.addEventListener('load', () => {
                const spinner = modalMediaWrapper.querySelector('.modal-spinner');
                if (spinner) spinner.style.display = 'none';
                img.style.opacity = '1';
            });

            img.addEventListener('error', () => {
                modalMediaWrapper.innerHTML = '<p class="error-msg">Gagal memuat gambar.</p>';
            });

            modalMediaWrapper.appendChild(img);
        }

        // Show/hide arrows based on index
        updateModalNavArrows();
    }

    function closeModal() {
        // Pause any video playing inside the modal before clearing it
        const video = modalMediaWrapper.querySelector('video');
        if (video) {
            video.pause();
            video.src = '';
            video.load();
        }

        mediaModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scroll
        modalMediaWrapper.innerHTML = '';
        currentModalIndex = -1;
    }

    function updateModalNavArrows() {
        if (currentModalIndex <= 0) {
            modalPrevBtn.style.visibility = 'hidden';
        } else {
            modalPrevBtn.style.visibility = 'visible';
        }

        if (currentModalIndex >= filteredItems.length - 1 || currentModalIndex >= visibleItemsCount - 1) {
            modalNextBtn.style.visibility = 'hidden';
        } else {
            modalNextBtn.style.visibility = 'visible';
        }
    }

    // Modal Navigations
    modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentModalIndex > 0) {
            openModal(currentModalIndex - 1);
        }
    });

    modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentModalIndex < filteredItems.length - 1 && currentModalIndex < visibleItemsCount - 1) {
            openModal(currentModalIndex + 1);
        }
    });

    // Close Modal Events
    modalCloseBtn.addEventListener('click', closeModal);
    mediaModal.addEventListener('click', (e) => {
        // If click outside container, close it
        if (e.target === mediaModal) {
            closeModal();
        }
    });

    // Keyboard support for Modal
    document.addEventListener('keydown', (e) => {
        if (!mediaModal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft' && currentModalIndex > 0) {
            openModal(currentModalIndex - 1);
        } else if (e.key === 'ArrowRight' && currentModalIndex < filteredItems.length - 1 && currentModalIndex < visibleItemsCount - 1) {
            openModal(currentModalIndex + 1);
        }
    });

    /* ==========================================================================
       SCROLL-TRIGGERED REVEAL ANIMATIONS
       ========================================================================== */
    // Setup elements to reveal
    const setupRevealAnimations = () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(sec => {
            sec.querySelectorAll('.section-header, .about-image-wrapper, .about-details, .service-card, .portfolio-filters, .portfolio-card, .contact-info, .contact-form-container').forEach(el => {
                el.classList.add('reveal-element');
            });
        });

        // Intersection Observer Config
        const observerOptions = {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // Special case: If about details is revealed, animate skill progress bars
                    if (entry.target.classList.contains('about-details')) {
                        animateSkills();
                    }

                    obs.unobserve(entry.target); // Animates only once
                }
            });
        }, observerOptions);

        const revealableElements = document.querySelectorAll('.reveal-element');
        revealableElements.forEach(el => observer.observe(el));
    };

    // Helper to animate skill percent progress bars
    function animateSkills() {
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            // Already initialized style in html, trigger transition
            const percentWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = percentWidth;
            }, 100);
        });
    }

    /* ==========================================================================
       CONTACT FORM SUBMIT (MOCKUP)
       ========================================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Mengirim Pesan... <i class="fa-solid fa-circle-notch fa-spin"></i>';

            fetch("https://formsubmit.co/ajax/difzoonstudio@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Nama: name,
                    Email: email,
                    Layanan: service,
                    Pesan: message
                })
            })
            .then(response => {
                if (response.ok) {
                    alert('Pesan berhasil terkirim! Habiburrahman akan segera menghubungi Anda kembali.');
                    contactForm.reset();
                } else {
                    alert('Gagal mengirim pesan. Silakan coba hubungi melalui WhatsApp.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan koneksi. Silakan hubungi langsung ke WhatsApp.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }

    /* ==========================================================================
       APP INITIALIZATION
       ========================================================================== */
    initPortfolio();
    setupRevealAnimations();
});
