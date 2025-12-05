import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

router.get('/:campaignId/sessions', (req, res) => {});

router.post('/:campaignId/create', (req, res) => {});
router.post('/:campaignId/join', (req, res) => {});
router.post('/:campaignId/leave', (req, res) => {});

router.post('/:campaignId/:sessionId/start', (req, res) => {});
router.post('/:campaignId/:sessionId/addNote', (req, res) => {});
router.post('/:campaignId/:sessionId/updateCharacter', (req, res) => {});
router.post('/:campaignId/:sessionId/end', (req, res) => {});

export default router;
