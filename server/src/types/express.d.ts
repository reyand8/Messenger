import { Server } from 'socket.io';

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