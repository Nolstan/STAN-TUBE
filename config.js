// Central API Configuration
// Empty string = same origin (for production where frontend and backend are on the same server)
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://stan-tube.onrender.com';
