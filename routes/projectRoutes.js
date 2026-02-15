const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const { storage } = require('../configs/cloudinary');
const upload = multer({ storage });

// GET /api/projects - Public route to get all projects
router.get('/', projectController.getProjects);

// POST /api/projects/create - Protected route to add a project
router.post('/create', authMiddleware, upload.single('project-image'), projectController.createProject);

module.exports = router;
