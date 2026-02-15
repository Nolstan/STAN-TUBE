const AcademicRecord = require('../models/AcademicRecord');

exports.createAcademicRecord = async (req, res) => {
    try {
        const { subject, grade, matchScore, year, type, description } = req.body;

        // Image URL from Cloudinary (provided by multer-storage-cloudinary)
        const imageUrl = req.file ? req.file.path : null;
        const cloudinaryId = req.file ? req.file.filename : null;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image upload failed or no file provided' });
        }

        const newRecord = new AcademicRecord({
            subject,
            grade,
            matchScore: matchScore || 0,
            year,
            type,
            description,
            imageUrl,
            cloudinaryId
        });

        const savedRecord = await newRecord.save();

        res.status(201).json({
            message: 'Academic Record created successfully',
            record: savedRecord
        });
    } catch (error) {
        console.error('Error creating academic record:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllAcademicRecords = async (req, res) => {
    try {
        const records = await AcademicRecord.find().sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
