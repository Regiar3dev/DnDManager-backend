import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

// Initialize Firebase Admin
import './config/firebase.config';

import authRouter from './routes/auth.route';
import campaignRouter from './routes/campaign.route';
import sessionRouter from './routes/session.route';
import characterRouter from './routes/character.route';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

connectDB();

const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
  res.status(200).send('DnDManager Backend is running');
});

app.use('/api/auth', authRouter);
app.use('/api/campaigns', campaignRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/characters', characterRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
