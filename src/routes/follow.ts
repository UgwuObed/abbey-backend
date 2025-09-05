import { Router } from 'express';
import { container } from '../config';
import { authenticateToken, validateUUID } from '../middleware';

const router = Router();
const followController = container.followController;


router.post('/:id/follow', authenticateToken, validateUUID('id'), followController.followUser);
router.delete('/:id/unfollow', authenticateToken, validateUUID('id'), followController.unfollowUser);
router.get('/:id/followers', validateUUID('id'), followController.getFollowers);
router.get('/:id/following', validateUUID('id'), followController.getFollowing);
router.get('/:id/status', authenticateToken, validateUUID('id'), followController.checkFollowStatus);

export default router;