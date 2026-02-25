const AcademicRecord = require('../models/AcademicRecord');
const Project = require('../models/Project');
const { cloudinary } = require('../configs/cloudinary');

// --- Academic Records ---

// Update Academic Record
exports.updateAcademicRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, grade, matchScore, year, type, description } = req.body;

        let updateData = {
            subject,
            grade,
            matchScore: matchScore || 0,
            year,
            type,
            description
        };

        if (req.file) {
            // If new image, update image data
            updateData.imageUrl = req.file.path;
            updateData.cloudinaryId = req.file.filename;

            // Optional: Delete old image from Cloudinary if needed
            const oldRecord = await AcademicRecord.findById(id);
            if (oldRecord && oldRecord.cloudinaryId) {
                await cloudinary.uploader.destroy(oldRecord.cloudinaryId);
            }
        }

        const updatedRecord = await AcademicRecord.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedRecord) {
            return res.status(404).json({ message: 'Academic Record not found' });
        }

        res.status(200).json({ message: 'Academic Record updated successfully', record: updatedRecord });
    } catch (error) {
        console.error('Error updating academic record:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Academic Record
exports.deleteAcademicRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await AcademicRecord.findById(id);

        if (!record) {
            return res.status(404).json({ message: 'Academic Record not found' });
        }

        // Delete image from Cloudinary
        if (record.cloudinaryId) {
            await cloudinary.uploader.destroy(record.cloudinaryId);
        }

        await AcademicRecord.findByIdAndDelete(id);
        res.status(200).json({ message: 'Academic Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting academic record:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- Projects ---

// Update Project
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, duration, quality, category, videoUrl, codeUrl, description } = req.body;

        let updateData = {
            title,
            duration,
            quality,
            category,
            videoUrl,
            codeUrl,
            description
        };

        if (req.file) {
            updateData.imageUrl = req.file.path;
            updateData.cloudinaryId = req.file.filename;

            const oldProject = await Project.findById(id);
            if (oldProject && oldProject.cloudinaryId) {
                await cloudinary.uploader.destroy(oldProject.cloudinaryId);
            }
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete image from Cloudinary
        if (project.cloudinaryId) {
            await cloudinary.uploader.destroy(project.cloudinaryId);
        }

        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
