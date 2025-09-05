import { Router } from 'express';
import { container } from '../config';
import { validateUUID, validateCreatePost, validateUpdatePost, authenticateToken } from '../middleware';

const router = Router();
const postController = container.postController;

router.post('/', authenticateToken, validateCreatePost, postController.createPost);
router.get('/feed', authenticateToken, postController.getFeed);
router.get('/', postController.getAllPosts);
router.get('/:id', validateUUID('id'), postController.getPostById);
router.put('/:id', authenticateToken, validateUUID('id'), validateUpdatePost, postController.updatePost);
router.delete('/:id', authenticateToken, validateUUID('id'), postController.deletePost);
router.get('/user/:id', validateUUID('id'), postController.getUserPosts);

export default router;