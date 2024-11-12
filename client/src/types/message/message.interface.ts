export interface IMessage {
    id: number;
    text: string;
    senderId: number;
    receiverId: number;
    createdAt: string;
    updatedAt: string;
}

export interface INewMessage {
    id?: number;
    text: string;
    senderId?: number;
    receiverId?: number;
    createdAt?: string;
    updatedAt?: string;
}