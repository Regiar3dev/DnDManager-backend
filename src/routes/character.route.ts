import express from 'express';
import authMiddleware from '../middleware/auth.middleware';
import userContextMiddleware from '../middleware/userContext.middleware';
import CharacterController from '../controllers/character.controller';

const router = express.Router();

router.use(authMiddleware);
router.use(userContextMiddleware);

// Fetchear detalles de un personaje y personajes del usuario
router.get('/:characterId', CharacterController.getCharacterDetails);
router.get('/', CharacterController.getCharactersByPlayer);

// Actualizar y eliminar personajes
router.put('/:characterId', CharacterController.updateCharacter);
router.delete('/:characterId', CharacterController.deleteCharacter);

export default router;