import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth route is working');
});

// Example route for authentication
router.post('/login', (req, res) => {});
router.post('/register', (req, res) => {});

router.post('/logout', (req, res) => {});

export default router;