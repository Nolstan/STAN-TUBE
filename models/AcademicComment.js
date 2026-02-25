const mongoose = require('mongoose');

const academicCommentSchema = new mongoose.Schema({
    academicRecord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicRecord',
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AcademicComment', academicCommentSchema);
