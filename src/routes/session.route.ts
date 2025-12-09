import express from 'express';
import { requireCampaignRole } from '../middleware/campaignRole.middleware';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

//Fetchear, unirse y salir de sesiones
router.get('/:sessionId', (req, res) => {});
router.post('/:sessionId/join', requireCampaignRole('Player'), (req, res) => {});
router.post('/:sessionId/leave', requireCampaignRole('Player'), (req, res) => {});

// Gestionar el estado de la sesión
router.post('/:sessionId/start', requireCampaignRole('DM'), (req, res) => {});
router.post('/:sessionId/pause', requireCampaignRole('DM'), (req, res) => {});
router.post('/:sessionId/end', requireCampaignRole('DM'), (req, res) => {});

// Actualizar notas y eventos de la sesión
router.put('/:sessionId/note', requireCampaignRole('DM'), (req, res) => {});
router.post('/:sessionId/event', requireCampaignRole('DM'), (req, res) => {});

export default router;
