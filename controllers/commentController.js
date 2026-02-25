const AcademicComment = require('../models/AcademicComment');
const ProjectComment = require('../models/ProjectComment');

// --- Academic Comments ---

// Add a comment to an academic record
exports.addAcademicComment = async (req, res) => {
    try {
        const { academicRecordId, username, comment } = req.body;

        if (!academicRecordId || !username || !comment) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newComment = new AcademicComment({
            academicRecord: academicRecordId,
            username,
            comment
        });

        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding academic comment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get comments for an academic record
exports.getAcademicComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await AcademicComment.find({ academicRecord: id }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching academic comments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- Project Comments ---

// Add a comment to a project
exports.addProjectComment = async (req, res) => {
    try {
        const { projectId, username, comment } = req.body;

        if (!projectId || !username || !comment) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newComment = new ProjectComment({
            project: projectId,
            username,
            comment
        });

        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding project comment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get comments for a project
exports.getProjectComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await ProjectComment.find({ project: id }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching project comments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
