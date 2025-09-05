import { Router } from 'express';
import { container } from '../config';
import { validateRegister, validateLogin, authenticateToken } from '../middleware';

const router = Router();
const authController = container.authController;

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/refresh-token', authController.refreshToken);

export default router;