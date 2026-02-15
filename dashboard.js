// Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {

    // Auth Guard: Redirect to login if no token
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Display logged-in user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userDisplay = document.getElementById('user-display');
    if (userDisplay && user.username) {
        userDisplay.textContent = user.username;
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    // Navigation Logic
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-target]');
    const sections = document.querySelectorAll('.form-section');
    const sectionTitle = document.getElementById('section-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show target section
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(`${targetId}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update Header Title
            if (targetId === 'academic') {
                sectionTitle.textContent = 'Academic Records';
            } else if (targetId === 'projects') {
                sectionTitle.textContent = 'Projects';
            }
        });
    });

    // Form Submission Logic (Placeholder)
    const academicForm = document.getElementById('academic-form');
    const projectForm = document.getElementById('project-form');

    if (academicForm) {
        academicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('subject', document.getElementById('subject').value);
            formData.append('grade', document.getElementById('grade').value);
            formData.append('matchScore', document.getElementById('match').value);
            formData.append('year', document.getElementById('year').value);
            formData.append('type', document.getElementById('type').value);
            formData.append('description', document.getElementById('description').value);

            const fileInput = document.getElementById('grade-paper');
            if (fileInput.files.length > 0) {
                formData.append('image', fileInput.files[0]);
            } else {
                alert('Please select a grade paper image.');
                return;
            }

            fetch(`${API_BASE_URL}/api/academic/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Academic Record created successfully') {
                        alert('Academic Record Added Successfully!');
                        academicForm.reset();
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    alert('An error occurred. Check console.');
                });
        });
    }

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('title', document.getElementById('project-title').value);
            formData.append('duration', document.getElementById('duration').value);
            formData.append('quality', document.getElementById('quality').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('videoUrl', document.getElementById('video-url').value);
            formData.append('codeUrl', document.getElementById('code-url').value);
            formData.append('description', document.getElementById('project-desc').value);

            const projectImage = document.getElementById('project-image');
            if (projectImage && projectImage.files.length > 0) {
                formData.append('project-image', projectImage.files[0]);
            }

            fetch(`${API_BASE_URL}/api/projects/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Project created successfully') {
                        alert('Project Added Successfully!');
                        projectForm.reset();
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    alert('An error occurred. Check console.');
                });
        });
    }
});
