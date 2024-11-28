import express, {Router} from 'express';
import { getUsers } from '../controllers/userController';


const router: Router = express.Router();

router.get('/allUsers', getUsers);

export default router;