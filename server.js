const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
const academicRoutes = require('./routes/academicRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/academic', academicRoutes);
app.use('/api/auth', authRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
