import express from 'express';
import { getUsers } from '../controllers/userController';


const router = express.Router();

router.get('/allUsers', getUsers);

export default router;