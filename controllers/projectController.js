const Project = require('../models/Project');
const cloudinary = require('../configs/cloudinary');

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { title, duration, quality, category, videoUrl, codeUrl, description } = req.body;
        let imageUrl = '';

        if (req.file) {
            imageUrl = req.file.path; // Cloudinary URL
        }

        const project = new Project({
            title,
            duration,
            quality,
            category,
            videoUrl,
            codeUrl,
            description,
            imageUrl
        });

        await project.save();
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
