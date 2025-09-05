import { Router } from 'express';
import { container } from '../config';
import { authenticateToken, validateUUID, validateUpdateUser } from '../middleware';

const router = Router();
const userController = container.userController;
const followController = container.followController;

router.get('/', userController.searchUsers);
router.get('/me', authenticateToken, userController.getCurrentUser);
router.get('/:id', validateUUID('id'), userController.getUserById);
router.get('/username/:username', userController.getUserByUsername);
router.put('/:id', authenticateToken, validateUUID('id'), validateUpdateUser, userController.updateUser);
router.delete('/:id', authenticateToken, validateUUID('id'), userController.deleteUser);
router.post('/:id/follow', authenticateToken, validateUUID('id'), followController.followUser);
router.delete('/:id/unfollow', authenticateToken, validateUUID('id'), followController.unfollowUser);
router.get('/:id/followers', validateUUID('id'), followController.getFollowers);
router.get('/:id/following', validateUUID('id'), followController.getFollowing);

export default router;