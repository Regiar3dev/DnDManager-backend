import express from 'express';
import { requireCampaignRole } from '../middleware/campaignRole.middleware';
import authMiddleware from '../middleware/auth.middleware';
import CampaignController from '../controllers/campaign.controller';
import UserService from '../services/User.service';
import CampaignService from '../services/Campaign.service';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

// router.use(authMiddleware); Activar una vez que se implemento todo.

// Crear y fetchear campañas
router.post('/', CampaignController.createCampaign);
router.get('/my', CampaignController.getCampaigns);

// router.get('/sync', CampaignController.syncCampaigns); Test Endpoint

// Crear y fetchear sesiones de una campaña
router.post('/:campaignId/sessions', requireCampaignRole('DM'), (req, res) => {
  res.status(201).send();
});
router.get('/:campaignId/sessions', (req, res) => {});

// Crear y fetchear personajes de una campaña
router.get('/:campaignId/characters', (req, res) => {});
router.post('/:campaignId/characters', requireCampaignRole('Player'), (req, res) => {});

// Crear y fetchear enemigos de una campaña
router.get('/:campaignId/enemies', requireCampaignRole('DM'), (req, res) => {});
router.post('/:campaignId/enemies', requireCampaignRole('DM'), (req, res) => {});

// Unirse y salir de campañas
router.post('/join',  CampaignController.joinCampaign);
router.post('/:campaignId/leave', requireCampaignRole('Player'), CampaignController.leaveCampaign);

// Actualizar y eliminar campañas
router.put('/:campaignId', requireCampaignRole('DM'), (req, res) => {});
router.delete('/:campaignId', requireCampaignRole('DM'), (req, res) => {});

export default router;