import express from 'express';
import AuthController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

// Registro y login de usuarios
router.post('/register', AuthController.register);
router.get('/login', authMiddleware, AuthController.login);

// TBD: rutas adicionales para autenticación (logout, refresh token, etc.)

// TBD: rutas para admins (gestión de usuarios, roles, permisos, etc.)

export default router;