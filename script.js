// script.js

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Navbar Scroll Effect
     * Changes background from transparent to solid color on scroll
     */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /**
     * Smooth Scrolling for Anchors
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Add some dynamic "shimmer" or loading effect if needed later
    console.log("Streaming Portfolio Loaded Successfully");

    /**
     * Video Modal Logic
     */
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeModal');
    const videoPlayer = document.getElementById('videoPlayer');

    // Placeholder Video URL (Rick Roll for demo safety/humor, or a generic nature loop)
    // Using a generic landscape video from Pixabay or similar would be better, but YouTube embed is standard.
    // Let's use a nice "Nature" placeholder or a Tech abstract one.
    const demoVideoUrl = "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1"; // 4K Nature

    // Open Modal
    document.querySelectorAll('.btn-primary, .action-btn[title="Watch Demo"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check if it's the specific "Watch Demo" buttons
            if (btn.textContent.includes('Watch Demo') || btn.getAttribute('title') === 'Watch Demo') {
                e.preventDefault();
                modal.classList.add('active');
                videoPlayer.src = demoVideoUrl;
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        videoPlayer.src = ""; // Stop video
        document.body.style.overflow = ''; // Restore scrolling
    }

    closeBtn.addEventListener('click', closeModal);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /**
     * Universal Filtering Logic
     * Works for both Academic and Project sections
     */
    const filterPills = document.querySelectorAll('.filter-pill');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Find the parent container (section-filters)
            const parentContainer = pill.closest('.section-filters');
            if (!parentContainer) return;

            // Find the section that contains this filter container
            const section = parentContainer.closest('.content-section');
            if (!section) return;

            // Remove active class from pills IN THIS CONTAINER ONLY
            parentContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            // Add active class to clicked pill
            pill.classList.add('active');

            const filterValue = pill.getAttribute('data-filter');

            // diverse cards selector to include both .card and .video-card if they are distinct classes, 
            // though .video-card usually has .card too.
            const cards = section.querySelectorAll('.card');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = ''; // Reset to default (flex/block)
                    // Simple fade animation
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
