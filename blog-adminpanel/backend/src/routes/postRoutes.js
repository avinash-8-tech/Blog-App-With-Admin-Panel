import express from 'express';
import { 
  getPosts, 
  getPostById, 
  deletePost 
} from '../controllers/postController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getPosts);

router.get('/:id', getPostById);

router.delete('/:id', deletePost);

export default router;