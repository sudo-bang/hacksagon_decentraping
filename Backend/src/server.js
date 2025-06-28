import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import siteRoutes from './routes/siteRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();

// --- Connect to Database ---
connectDB();

// --- Middleware ---
app.use(cors()); // Enable CORS for your frontend
app.use(express.json()); // To accept JSON data in the body

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/jobs', jobRoutes);

// --- Root Route for testing ---
app.get('/', (req, res) => {
  res.send('Uptime Monitor Backend API is running!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));