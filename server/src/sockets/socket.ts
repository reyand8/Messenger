import { Server, Socket } from 'socket.io';


const configureSocket = (io: Server) => {

    io.on('connection', (socket: Socket) => {
        socket.on('joinRoom', (userId: string) => {
            socket.join(userId);
        });

        socket.on('sendMessage', (messageData) => {
            const { receiverId, message } = messageData;
            console.log(messageData)
            if (socket.rooms.has(receiverId)) {
                io.to(receiverId).emit('newMessage', message);
            } else {
                console.log(`User is not in the room ${receiverId}`);
            }
        });

        socket.on('updateMessage', (messageData) => {
            const { receiverId, message } = messageData;
            console.log(messageData)
            if (socket.rooms.has(receiverId)) {
                io.to(receiverId).emit('newMessage', message);
            } else {
                console.log(`User is not in the room ${receiverId}`);
            }
        });

        socket.on('deleteMessage', (messageData) => {
            const { receiverId, idMsg } = messageData;
            if (socket.rooms.has(receiverId)) {
                io.to(receiverId).emit('deleteMessage', idMsg);
            } else {
                console.log(`User is not in the room ${receiverId}`);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export default configureSocket;