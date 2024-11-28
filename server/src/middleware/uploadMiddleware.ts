import multer from 'multer';


const storage = multer.diskStorage({
    destination: (req, file, cb): void => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb): void => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload: multer.Multer = multer({ storage });


export const uploadFilesMiddleware = upload.array('image');
