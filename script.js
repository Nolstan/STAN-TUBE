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

    /**
     * Video Modal Logic
     */
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeModal');
    const videoPlayer = document.getElementById('videoPlayer');

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
    /**
     * Fetch and Render Academic Records
     */
    const academicContainer = document.getElementById('academic-container');
    if (academicContainer) {
        fetch(`${API_BASE_URL}/api/academic`)
            .then(response => response.json())
            .then(records => {
                academicContainer.innerHTML = ''; // Clear loading placeholder

                if (records.length === 0) {
                    academicContainer.innerHTML = '<div class="no-records">No academic records found.</div>';
                    return;
                }

                records.forEach(record => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.setAttribute('data-category', record.type);

                    // Determine background gradient based on type or random
                    const bgClass = 'academic-bg-' + (Math.floor(Math.random() * 3) + 1);

                    // Grade Color
                    const gradeClass = record.grade >= 50 ? 'grade-pass' : 'grade-fail';

                    // Image Handling
                    let imageHtml = '';
                    if (record.imageUrl) {
                        imageHtml = `<div class="card-image-placeholder" style="background-image: url('${record.imageUrl}'); background-size: cover;">
                                        <span class="card-grade ${gradeClass}">${record.grade}%</span>
                                      </div>`;
                    } else {
                        imageHtml = `<div class="card-image-placeholder ${bgClass}">
                                        <span class="card-grade ${gradeClass}">${record.grade}%</span>
                                      </div>`;
                    }

                    card.innerHTML = `
                        ${imageHtml}
                        <div class="card-info">
                            <h3>${record.subject}</h3>
                            <div class="meta-info">
                                <span class="match-score">${record.matchScore}% Match</span>
                                <span class="year">${record.year}</span>
                                <span class="rating">${record.type}</span>
                            </div>
                            <p class="desc">${record.description || ''}</p>
                            <div class="card-actions" style="margin-top: 0;">
                                <button class="action-btn comment-btn" title="Comments" data-id="${record._id}" data-type="academic">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${record.grade}%;"></div>
                            </div>
                        </div>
                    `;
                    // Make card image clickable
                    if (record.imageUrl) {
                        const imageDiv = card.querySelector('.card-image-placeholder');
                        imageDiv.style.cursor = 'pointer';
                        imageDiv.addEventListener('click', () => {
                            const imageModal = document.getElementById('imageModal');
                            const lightboxImg = document.getElementById('lightboxImage');
                            lightboxImg.src = record.imageUrl;
                            imageModal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        });
                    }

                    academicContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error fetching academic records:', error);
                academicContainer.innerHTML = '<div class="error-message">Failed to load academic records.</div>';
            });
    }

    /**
     * Fetch and Render Projects
     */
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        fetch(`${API_BASE_URL}/api/projects`)
            .then(response => response.json())
            .then(projects => {
                projectsContainer.innerHTML = ''; // Clear placeholder

                if (projects.length === 0) {
                    projectsContainer.innerHTML = '<div class="no-records">No projects found.</div>';
                    return;
                }

                // Update Hero Section with the Latest Project
                const latestProject = projects[0];
                const heroTitle = document.getElementById('hero-title');
                const heroDesc = document.getElementById('hero-description');
                const heroWatchDemo = document.getElementById('hero-watch-demo');
                const heroViewCode = document.getElementById('hero-view-code');

                if (heroTitle) heroTitle.textContent = latestProject.title;
                if (heroDesc) heroDesc.textContent = latestProject.description || '';

                if (heroWatchDemo) {
                    if (latestProject.videoUrl) {
                        heroWatchDemo.style.display = 'inline-flex';
                        heroWatchDemo.setAttribute('data-video', latestProject.videoUrl);
                        // Add click event for hero watch demo (since it's dynamic now or needs to hook into modal)
                        heroWatchDemo.addEventListener('click', (e) => {
                            e.preventDefault();
                            openVideoModal(latestProject.videoUrl);
                        });
                    } else {
                        heroWatchDemo.style.display = 'none';
                    }
                }

                if (heroViewCode) {
                    if (latestProject.codeUrl) {
                        heroViewCode.style.display = 'inline-flex';
                        heroViewCode.href = latestProject.codeUrl;
                    } else {
                        heroViewCode.style.display = 'none';
                    }
                }

                projects.forEach(project => {
                    const card = document.createElement('div');
                    card.classList.add('card', 'video-card');
                    card.setAttribute('data-category', project.category);

                    // Image/Placeholder Handling
                    let imageHtml = '';
                    if (project.imageUrl) {
                        imageHtml = `
                            <div class="card-image-placeholder" style="background-image: url('${project.imageUrl}'); background-size: cover;">
                                <div class="play-icon">
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>`;
                    } else {
                        const bgClass = 'project-bg-' + (Math.floor(Math.random() * 3) + 1);
                        imageHtml = `
                            <div class="card-image-placeholder ${bgClass}">
                                <div class="play-icon">
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>`;
                    }

                    card.innerHTML = `
                        ${imageHtml}
                        <div class="card-info">
                            <h3>${project.title}</h3>
                            <div class="meta-info">
                                <span class="duration">${project.duration || ''}</span>
                                <span class="quality">${project.quality || 'HD'}</span>
                            </div>
                            <p class="desc">${project.description || ''}</p>
                            <div class="card-actions">
                                ${project.codeUrl ? `
                                <button class="action-btn" title="View Code" onclick="window.open('${project.codeUrl}', '_blank')">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                                    </svg>
                                </button>` : ''}
                                ${project.videoUrl ? `
                                <button class="action-btn watch-demo-btn" title="Watch Demo" data-video="${project.videoUrl}">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>` : ''}
                                <button class="action-btn comment-btn" title="Comments" data-id="${project._id}" data-type="projects">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;

                    // Watch Demo Button Logic (reuse existing modal logic if any)
                    const demoBtn = card.querySelector('.watch-demo-btn');
                    if (demoBtn) {
                        demoBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const videoUrl = demoBtn.getAttribute('data-video');
                            openVideoModal(videoUrl);
                        });
                    }

                    projectsContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                projectsContainer.innerHTML = '<div class="error-message">Failed to load projects.</div>';
            });
    }

    /**
     * Helper function to open video modal
     */
    function openVideoModal(videoUrl) {
        const videoModal = document.getElementById('videoModal');
        const videoPlayer = document.getElementById('videoPlayer');

        // Handle YouTube links conversion to embed if necessary
        let embedUrl = videoUrl;
        if (videoUrl.includes('youtube.com/watch?v=')) {
            embedUrl = videoUrl.replace('watch?v=', 'embed/');
        } else if (videoUrl.includes('youtu.be/')) {
            embedUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
        }

        // Add autoplay if not already there
        if (!embedUrl.includes('autoplay=1')) {
            embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1';
        }

        videoPlayer.src = embedUrl;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Image Lightbox Modal Logic
     */
    const imageModal = document.getElementById('imageModal');
    const closeImageBtn = document.getElementById('closeImageModal');

    if (closeImageBtn) {
        closeImageBtn.addEventListener('click', () => {
            imageModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Comment System Logic
     */
    const commentModal = document.getElementById('commentModal');
    const closeCommentBtn = document.getElementById('closeCommentModal');
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');

    if (closeCommentBtn) {
        closeCommentBtn.addEventListener('click', () => {
            commentModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Handle opening comment modal (using event delegation for dynamic buttons)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.comment-btn');
        if (btn) {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            const type = btn.getAttribute('data-type');
            openCommentModal(id, type);
        }
    });

    function openCommentModal(id, type) {
        document.getElementById('currentTargetId').value = id;
        document.getElementById('currentTargetType').value = type;
        document.getElementById('commentModalTitle').textContent = `Comments - ${type === 'academic' ? 'Academic Record' : 'Project'}`;

        commentList.innerHTML = '<div class="loading-placeholder">Loading comments...</div>';
        commentModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        fetchComments(id, type);
    }

    function fetchComments(id, type) {
        fetch(`${API_BASE_URL}/api/comments/${type}/${id}`)
            .then(res => res.json())
            .then(comments => {
                renderComments(comments);
            })
            .catch(err => {
                console.error('Error fetching comments:', err);
                commentList.innerHTML = '<div class="error-message">Failed to load comments.</div>';
            });
    }

    function renderComments(comments) {
        if (!comments || comments.length === 0) {
            commentList.innerHTML = '<div class="no-comments">No comments yet. Be the first to say something!</div>';
            return;
        }

        commentList.innerHTML = comments.map(c => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-user">${c.username}</span>
                    <span class="comment-date">${new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p class="comment-text">${c.comment}</p>
            </div>
        `).join('');
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('currentTargetId').value;
            const type = document.getElementById('currentTargetType').value;
            const username = document.getElementById('commentUsername').value;
            const comment = document.getElementById('commentText').value;

            const payload = {
                username,
                comment
            };

            // Backend expectation: academicRecordId or projectId
            if (type === 'academic') {
                payload.academicRecordId = id;
            } else {
                payload.projectId = id;
            }

            fetch(`${API_BASE_URL}/api/comments/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.comment) {
                        document.getElementById('commentText').value = '';
                        fetchComments(id, type); // Reload comments
                    } else {
                        alert(data.message || 'Error posting comment');
                    }
                })
                .catch(err => {
                    console.error('Error posting comment:', err);
                    alert('An error occurred. Check console.');
                });
        });
    }
});
