import express from 'express';
import { requireCampaignRole } from '../middleware/campaignRole.middleware';
import authMiddleware from '../middleware/auth.middleware';
import CampaignController from '../controllers/campaign.controller';
import SessionController from '../controllers/session.controller';
import CharacterController from '../controllers/character.controller';
import validationMiddleware from '../middleware/validation.middleware';
import { CampaignCreateSchema, CampaignUpdateSchema } from '../schemas/Campaign.schema';
import { CharacterCreateSchema } from '../schemas/Character.schema';
import { SessionSchema } from '../schemas/Session.schema';
import userContextMiddleware from '../middleware/userContext.middleware';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

router.use(authMiddleware);
router.use(userContextMiddleware);

// Crear y fetchear campañas
router.post('/',validationMiddleware(CampaignCreateSchema), CampaignController.createCampaign);
router.get('/my', CampaignController.getCampaigns);
router.get('/:campaignId', CampaignController.getCampaignDetails);

// router.get('/sync', CampaignController.syncCampaigns); Test Endpoint

// Crear y fetchear sesiones de una campaña (Se manejan las rutas desde la campaña, pero usan sus propios controllers y servicios)
router.post('/:campaignId/sessions', requireCampaignRole('DM'), validationMiddleware(SessionSchema), SessionController.createSession);
router.get('/:campaignId/sessions', CampaignController.getCampaignSessions);

// Crear y fetchear personajes de una campaña (Se manejan las rutas desde la campaña, pero usan sus propios controllers y servicios)
router.post('/:campaignId/characters', requireCampaignRole('Player'), validationMiddleware(CharacterCreateSchema), CharacterController.createCharacter);
router.get('/:campaignId/characters', CampaignController.getCampaignCharacters);

// Crear y fetchear enemigos de una campaña (Se manejan las rutas desde la campaña, pero usan sus propios controllers y servicios)
// router.post('/:campaignId/enemies', requireCampaignRole('DM'), (req, res) => {});
// router.get('/:campaignId/enemies', requireCampaignRole('DM'), CampaignController.getCampaignEnemies);

// Unirse y salir de campañas
router.post('/join', CampaignController.joinCampaign);
router.post('/:campaignId/leave', requireCampaignRole('Player'), CampaignController.leaveCampaign);

// Actualizar y eliminar campañas
router.patch('/:campaignId', requireCampaignRole('DM'), validationMiddleware(CampaignUpdateSchema), CampaignController.updateCampaign);
router.delete('/:campaignId', requireCampaignRole('DM'), CampaignController.deleteCampaign);

export default router;