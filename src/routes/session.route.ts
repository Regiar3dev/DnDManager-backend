import express from 'express';
import { requireCampaignRole } from '../middleware/campaignRole.middleware';
import SessionController from '../controllers/session.controller';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

//Fetchear, unirse y salir de sesiones
router.get('/:sessionId', SessionController.getSessionById);
router.post('/:sessionId/join', requireCampaignRole('Player'), SessionController.joinSession);
router.post('/:sessionId/leave', requireCampaignRole('Player'), SessionController.leaveSession);

// Gestionar el estado de la sesión
router.post('/:sessionId/start', requireCampaignRole('DM'), SessionController.startSession);
router.post('/:sessionId/pause', requireCampaignRole('DM'), SessionController.pauseSession);
router.post('/:sessionId/end', requireCampaignRole('DM'), SessionController.endSession);

// Actualizar notas y eventos de la sesión
router.put('/:sessionId/note', requireCampaignRole('DM'), SessionController.addNoteToSession);
// router.post('/:sessionId/event', requireCampaignRole('DM'), (req, res) => {});

export default router;
