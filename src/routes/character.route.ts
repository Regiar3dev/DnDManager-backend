import express from 'express';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Campaign route is working');
});

router.use(authMiddleware);

// Fetchear detalles de un personaje y personajes del usuario
router.get('/:characterId', (req, res) => {});
router.get('/my', (req, res) => {});

// Actualizar y eliminar personajes
router.put('/:characterId', (req, res) => {});
router.delete('/:characterId', (req, res) => {});

export default router;