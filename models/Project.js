const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    quality: {
        type: String,
        enum: ['HD', '4K', 'SD'],
        default: 'HD'
    },
    category: {
        type: String,
        enum: ['school', 'personal'],
        required: true
    },
    videoUrl: {
        type: String,
        trim: true
    },
    codeUrl: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
