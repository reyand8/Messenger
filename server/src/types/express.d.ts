import { Server } from 'socket.io';
import {IUserPayload} from './user.interface';

declare module 'express' {
    interface Request {
        user?: {
            id: string;
        };
    }
}

declare global {
    namespace Express {
        interface Request {
            io: Server;
        }
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUserPayload;
    }
}