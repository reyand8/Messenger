export interface IMessage {
    id: number;
    text: string;
    senderId: number;
    receiverId: number;
    imagePaths: string[],
    createdAt: string;
    updatedAt: string;
}


export interface IFetchMessage {
    id: number;
    text: string;
    createdAt: string;
    updatedAt: string;
    imagePaths: string[];
    receiver: {
        id: number;
        username: string;
        email: string;
    };
    receiverId: number;
    sender: {
        id: number;
        username: string;
        email: string;
    };
    senderId: number;
}

export interface ISendMessage {
    id: number;
    text: string;
    createdAt: string;
    updatedAt: string;
    imagePaths: string[];
    receiverId: number;
    senderId: number;
}

export interface IDeleteMessage {
    message: string;
}

export interface IEditMessage {
   data: ISendMessage
}


