const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    matchScore: {
        type: Number,
        default: 0
    },
    year: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['assignments', 'midsem', 'endsem', 'quiz'],
        required: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true // Making image required as per user request for "Picture of paper"
    },
    cloudinaryId: {
        type: String // To manage deletions if needed
    }
}, { timestamps: true });

module.exports = mongoose.model('AcademicRecord', academicRecordSchema);
