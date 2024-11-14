import React, {useEffect, useState} from 'react';

import ChatList from '../ChatList/ChatList';
import ChatWindow from '../ChatWindow/ChatWindow';
import {ISelectedFriend, IUser} from '../../types/user/user.interface';
import {verifyToken} from '../../api/authApi';
import {IChatMainProps} from '../../types/props/props.interface';


const ChatMain: React.FC<IChatMainProps> = ({setToken}) => {
    const [selectedFriend, setSelectedFriend]
        = useState<ISelectedFriend | null>(null);
    const [userData, setUserData] = useState<IUser | null>(null);


    useEffect(() => {
        const fetchUserData = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                try {
                    const user = await verifyToken(storedToken);
                    setUserData(user);
                } catch (error: any) {
                    console.error(error.message);
                    localStorage.removeItem('token');
                }
            }
        };
        fetchUserData();
    }, [setToken]);

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-row flex-grow">
                <div className="flex h-screen w-full bg-gray-900 text-gray-200 overflow-hidden">
                    <ChatList currUser={userData} setSelectedFriend={setSelectedFriend} />
                    <ChatWindow currUser={userData} selectedFriend={selectedFriend} />
                </div>
            </div>
        </div>
    );
};

export default ChatMain;