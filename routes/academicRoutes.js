const express = require('express');
const router = express.Router();
const upload = require('../configs/cloudinary');
const academicController = require('../controllers/academicController');
const authMiddleware = require('../middleware/auth');

// POST /api/academic/create - Create a new academic record with image upload
router.post('/create', authMiddleware, upload.single('image'), academicController.createAcademicRecord);

// GET /api/academic - Get all records
router.get('/', academicController.getAllAcademicRecords);

module.exports = router;
