const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Academic Comments
router.post('/academic', commentController.addAcademicComment);
router.get('/academic/:id', commentController.getAcademicComments);

// Project Comments
router.post('/projects', commentController.addProjectComment);
router.get('/projects/:id', commentController.getProjectComments);

module.exports = router;
