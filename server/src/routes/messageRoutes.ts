import express, {Router} from 'express';

import {getMessages, createMessage, deleteMessage, editMessage, uploadFiles}
    from '../controllers/messageController';
import {uploadFilesMiddleware}
    from '../middleware/uploadMiddleware';


const router: Router = express.Router();

router.get('/:senderId/:receiverId', getMessages);
router.post('/delete/:id', deleteMessage);
router.post('/edit/:id', editMessage);
router.post('/upload', uploadFilesMiddleware, uploadFiles);
router.post('/', createMessage);

export default router;