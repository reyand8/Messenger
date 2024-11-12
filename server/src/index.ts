import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import configureSocket from './sockets/socket';

import sequelize from "./config/db";
import userRoutes from "./routes/userRoutes";


dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
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

const server = http.createServer(app);

const PORT = process.env.PORT || 5001

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE']
    }
});

configureSocket(io);

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.error(e)
    }
}

start()