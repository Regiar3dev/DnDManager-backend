import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

router.post('/create', (req, res) => {});
router.get('/:id', (req, res) => {});
router.put('/:id', (req, res) => {});
router.delete('/:id', (req, res) => {});

export default router;