import express from 'express';

import {getMessages, createMessage, deleteMessage, editMessage} from '../controllers/messageController';


const router = express.Router();

router.get('/:senderId/:receiverId', getMessages);
router.post('/delete/:id', deleteMessage);
router.post('/edit/:id', editMessage);
router.post('/', createMessage);

export default router;