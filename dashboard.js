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

            fetch('http://localhost:5000/api/academic/create', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Academic Record created successfully') {
                        alert('Success: ' + data.message);
                        academicForm.reset();
                    } else {
                        alert('Error: ' + (data.message || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Check console.');
                });
        });
    }

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('project-title').value;

            alert(`Project Added:\nTitle: ${title}`);
            projectForm.reset();
        });
    }
});
