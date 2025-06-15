// backend/src/index.ts

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Define Mongoose schema for Alumni
const alumniSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    rollNumber: { type: String, required: true, unique: true, index: true },
    gender: String,
    yearOfEntry: Number,
    yearOfGraduation: Number,
    programName: String,
    specialization: String,
    department: String,
    currentLocationIndia: String,
    currentOverseasLocation: String,
    lastPosition: String,
    lastOrganization: String,
    natureOfJob: String,
    email: String,
    phone: String,
    linkedIn: String,
    twitter: String,
    instagram: String,
    facebook: String,
    hostels: String,
    higherStudies: String,
    startup: String,
    achievements: String,
    photoLink: String,
});

const Alumni = mongoose.model('Alumni', alumniSchema);

// Connect to MongoDB
const MONGO_URL =
    process.env.MONGO_URL || 'mongodb://localhost:27017/alumni_db';
mongoose
    .connect(MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// search endpoint -->
app.get('/api/search', async (req, res) => {
    const name =
        typeof req.query.name === 'string' ? req.query.name.trim() : '';
    const rollNumber =
        typeof req.query.rollNumber === 'string'
            ? req.query.rollNumber.trim()
            : '';

    try {
        const orConditions: any[] = [];
        if (name) {
            orConditions.push({ name: { $regex: new RegExp(name, 'i') } });
        }
        if (rollNumber) {
            orConditions.push({ rollNumber });
        }

        if (orConditions.length === 0) {
            res.json({ count: 0, data: [] });
            return;
        }

        const query = { $or: orConditions };
        const results = await Alumni.find(query).limit(100);

        res.json({ count: results.length, data: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
