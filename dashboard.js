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
            const titleMap = {
                'academic-add': 'Add Academic Record',
                'academic-manage': 'Manage Academic Records',
                'projects-add': 'Add Project',
                'projects-manage': 'Manage Projects'
            };
            sectionTitle.textContent = titleMap[targetId] || 'Dashboard';
        });
    });

    // --- Records Management Logic ---

    // Fetch and render academic records
    function loadAcademicRecords() {
        fetch(`${API_BASE_URL}/api/academic`)
            .then(response => response.json())
            .then(records => {
                const list = document.getElementById('academic-list');
                if (!list) return;
                list.innerHTML = '';
                records.forEach(record => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${record.subject}</td>
                        <td>${record.grade}%</td>
                        <td>${record.type}</td>
                        <td>${record.year}</td>
                        <td>
                            <button class="btn-edit" onclick="editAcademic('${record._id}')">Edit</button>
                            <button class="btn-delete" onclick="deleteAcademic('${record._id}')">Delete</button>
                        </td>
                    `;
                    list.appendChild(tr);
                });
            })
            .catch(err => console.error('Error loading academic records:', err));
    }

    // Fetch and render projects
    function loadProjects() {
        fetch(`${API_BASE_URL}/api/projects`)
            .then(response => response.json())
            .then(projects => {
                const list = document.getElementById('project-list');
                if (!list) return;
                list.innerHTML = '';
                projects.forEach(project => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${project.title}</td>
                        <td>${project.category}</td>
                        <td>${project.quality}</td>
                        <td>
                            <button class="btn-edit" onclick="editProject('${project._id}')">Edit</button>
                            <button class="btn-delete" onclick="deleteProject('${project._id}')">Delete</button>
                        </td>
                    `;
                    list.appendChild(tr);
                });
            })
            .catch(err => console.error('Error loading projects:', err));
    }

    // Initial Load
    loadAcademicRecords();
    loadProjects();

    // Expose edit/delete to window for onclick handlers
    window.editAcademic = (id) => {
        fetch(`${API_BASE_URL}/api/academic`)
            .then(res => res.json())
            .then(records => {
                const record = records.find(r => r._id === id);
                if (record) {
                    // Switch to Add section
                    document.querySelector('[data-target="academic-add"]').click();

                    document.getElementById('academic-id').value = record._id;
                    document.getElementById('subject').value = record.subject;
                    document.getElementById('grade').value = record.grade;
                    document.getElementById('match').value = record.matchScore;
                    document.getElementById('year').value = record.year;
                    document.getElementById('type').value = record.type;
                    document.getElementById('description').value = record.description || '';
                    document.getElementById('academic-form-title').textContent = 'Edit Academic Record';
                    document.getElementById('academic-submit-btn').textContent = 'Update Record';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
    };

    window.deleteAcademic = (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            fetch(`${API_BASE_URL}/api/academic/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    loadAcademicRecords();
                })
                .catch(err => console.error('Delete error:', err));
        }
    };

    window.editProject = (id) => {
        fetch(`${API_BASE_URL}/api/projects`)
            .then(res => res.json())
            .then(projects => {
                const project = projects.find(p => p._id === id);
                if (project) {
                    // Switch to Add section
                    document.querySelector('[data-target="projects-add"]').click();

                    document.getElementById('project-id').value = project._id;
                    document.getElementById('project-title').value = project.title;
                    document.getElementById('duration').value = project.duration || '';
                    document.getElementById('quality').value = project.quality;
                    document.getElementById('category').value = project.category;
                    document.getElementById('video-url').value = project.videoUrl || '';
                    document.getElementById('code-url').value = project.codeUrl || '';
                    document.getElementById('project-desc').value = project.description || '';
                    document.getElementById('project-form-title').textContent = 'Edit Project';
                    document.getElementById('project-submit-btn').textContent = 'Update Project';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
    };

    window.deleteProject = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            fetch(`${API_BASE_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    loadProjects();
                })
                .catch(err => console.error('Delete error:', err));
        }
    };

    // --- Form Submission Logic ---
    const academicForm = document.getElementById('academic-form');
    const projectForm = document.getElementById('project-form');

    if (academicForm) {
        academicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('academic-id').value;
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
            } else if (!id) {
                alert('Please select a grade paper image.');
                return;
            }

            const url = id ? `${API_BASE_URL}/api/academic/${id}` : `${API_BASE_URL}/api/academic/create`;
            const method = id ? 'PUT' : 'POST';

            fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.message.includes('successfully')) {
                        academicForm.reset();
                        document.getElementById('academic-id').value = '';
                        document.getElementById('academic-form-title').textContent = 'Add New Record';
                        document.getElementById('academic-submit-btn').textContent = 'Add Record';
                        loadAcademicRecords();
                        // Optional: switch back to manage view
                        document.querySelector('[data-target="academic-manage"]').click();
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
            const id = document.getElementById('project-id').value;
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

            const url = id ? `${API_BASE_URL}/api/projects/${id}` : `${API_BASE_URL}/api/projects/create`;
            const method = id ? 'PUT' : 'POST';

            fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.message.includes('successfully')) {
                        projectForm.reset();
                        document.getElementById('project-id').value = '';
                        document.getElementById('project-form-title').textContent = 'Add New Project';
                        document.getElementById('project-submit-btn').textContent = 'Add Project';
                        loadProjects();
                        // Optional: switch back to manage view
                        document.querySelector('[data-target="projects-manage"]').click();
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    alert('An error occurred. Check console.');
                });
        });
    }
});
