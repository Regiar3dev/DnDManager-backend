import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

router.get('/:campaignId/characters', (req, res) => {});

router.post('/:campaignId/create', (req, res) => {});
router.put('/:campaignId/update', (req, res) => {});
router.delete('/:campaignId/delete', (req, res) => {});

export default router;