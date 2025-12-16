import express from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import { CharacterUpdateSchema } from '../schemas/Character.schema';
import { CharacterCreateSchema } from '../schemas/Character.schema';
import userContextMiddleware from '../middleware/userContext.middleware';
import CharacterController from '../controllers/character.controller';

const router = express.Router();

router.use(authMiddleware);
router.use(userContextMiddleware);


// Fetchear detalles de un personaje y personajes del usuario
router.get('/:characterId', validationMiddleware(CharacterCreateSchema), CharacterController.getCharacterDetails);
router.get('/', CharacterController.getCharactersByPlayer);

// Actualizar y eliminar personajes
router.put('/:characterId',validationMiddleware(CharacterUpdateSchema), CharacterController.updateCharacter);
router.delete('/:characterId',  CharacterController.deleteCharacter);

export default router;