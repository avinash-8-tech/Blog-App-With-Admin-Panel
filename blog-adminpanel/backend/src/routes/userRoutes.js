import express from 'express';
import { 
  getUsers, 
  getUserById, 
  deleteUser, 
  getUserPosts 
} from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);

router.get('/:id', getUserById);

router.delete('/:id', deleteUser);

router.get('/:id/posts', getUserPosts);

export default router;