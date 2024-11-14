import {ICurrUser, IUser} from '../user/user.interface';
import {FieldError} from 'react-hook-form';
import {IMessage} from '../message/message.interface';
import React from 'react';
import {Socket} from 'socket.io-client';


export interface IAuthFormProps {
    setToken: (token: string) => void;
}

export interface IChatItemProps {
    user: IUser;
    setSelectedFriend: (user: IUser) => void;

}

export interface IChatListProps {
    setSelectedFriend: (user: IUser) => void;
    currUser: ICurrUser | null;
}

export interface IChatMainProps {
    setToken: (token: string) => void;
}

export interface IChatSavedItemProps {
    user: IUser;
    setSelectedFriend: (user: IUser) => void;
}

export interface IChatWindowProps {
    selectedFriend: IUser | null;
    currUser: ICurrUser | null;
}

export interface IFieldProps {
    placeholder: string;
    error?: FieldError;
}

export interface IMessageFriendProps {
    message: IMessage[];
}

export interface IMessageInputProps {
    handleSendMessage: (e: React.FormEvent) => void;
}

export interface IMessageMyProps {
    message: IMessage[];
    setEditMessage: (message: IMessage | null) => void;
    currRoom: number;
    socket: Socket;
}