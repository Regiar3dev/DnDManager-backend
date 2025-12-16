import express from 'express';
import { requireCampaignRole } from '../middleware/campaignRole.middleware';
import authMiddleware from '../middleware/auth.middleware';
import CampaignController from '../controllers/campaign.controller';
import { Campaign } from '../models';
import SessionController from '../controllers/session.controller';
import userContextMiddleware from '../middleware/userContext.middleware';
import CharacterController from '../controllers/character.controller';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

router.use(authMiddleware); // Activar una vez que se implemento todo.
router.use(userContextMiddleware); // Activar una vez que se implemento todo.

// Crear y fetchear campañas
router.post('/', CampaignController.createCampaign);
router.get('/my', CampaignController.getCampaigns);
router.get('/:campaignId', CampaignController.getCampaignDetails);

// router.get('/sync', CampaignController.syncCampaigns); Test Endpoint

// Crear y fetchear sesiones de una campaña (Se manejan las rutas desde la campaña, pero usan sus propios controllers y servicios)
router.post('/:campaignId/sessions', requireCampaignRole('DM'), SessionController.createSession);
router.get('/:campaignId/sessions', CampaignController.getCampaignSessions);

// Crear y fetchear personajes de una campaña (Se manejan las rutas desde la campaña, pero usan sus propios controllers y servicios)
router.post('/:campaignId/characters', requireCampaignRole('Player'), CharacterController.createCharacter);
router.get('/:campaignId/characters', CampaignController.getCampaignCharacters);

// Crear y fetchear enemigos de una campaña (Se manejan las rutas desde la campaña, pero usan sus propios controllers y servicios)
// router.post('/:campaignId/enemies', requireCampaignRole('DM'), (req, res) => {});
// router.get('/:campaignId/enemies', requireCampaignRole('DM'), CampaignController.getCampaignEnemies);

// Unirse y salir de campañas
router.post('/join',  CampaignController.joinCampaign);
router.post('/:campaignId/leave', requireCampaignRole('Player'), CampaignController.leaveCampaign);

// Actualizar y eliminar campañas
router.patch('/:campaignId', requireCampaignRole('DM'), CampaignController.updateCampaign);
router.delete('/:campaignId', requireCampaignRole('DM'), CampaignController.deleteCampaign);

export default router;