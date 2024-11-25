import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import configureSocket from './sockets/socket';

import sequelize from './config/db';
import userRoutes from './routes/userRoutes';


dotenv.config();

const app = express();

const ORIGIN_URL: string = 'http://localhost:3000';

app.use(cors({
    origin: ORIGIN_URL,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const server = http.createServer(app);

const PORT: string | 5001 = process.env.PORT || 5001;

const io = new Server(server, {
    cors: {
        origin: ORIGIN_URL,
        methods: ['GET', 'POST', 'DELETE']
    }
});

configureSocket(io);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.error(e);
    }
};

start();