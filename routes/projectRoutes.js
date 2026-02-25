const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const managementController = require('../controllers/managementController');
const authMiddleware = require('../middleware/auth');
const { storage, upload } = require('../configs/cloudinary');

// GET /api/projects - Public route to get all projects
router.get('/', projectController.getProjects);

// POST /api/projects/create - Protected route to add a project
router.post('/create', authMiddleware, upload.single('project-image'), projectController.createProject);

// PUT /api/projects/:id - Update project
router.put('/:id', authMiddleware, upload.single('project-image'), managementController.updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authMiddleware, managementController.deleteProject);

module.exports = router;
