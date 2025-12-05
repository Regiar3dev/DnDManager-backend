import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth.route';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
  res.send('DnDManager Backend is running');
});

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
