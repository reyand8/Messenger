import React, {useState} from 'react';

import ChatList from '../ChatList/ChatList';
import ChatWindow from '../ChatWindow/ChatWindow';
import {ISelectedFriend} from '../../types/user/user.interface';
import {IChatMainProps} from '../../types/props/props.interface';


const ChatMain: React.FC<IChatMainProps> = ({ currUser }) => {
    const [selectedFriend, setSelectedFriend]
        = useState<ISelectedFriend | null>(null);

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-row flex-grow">
                <div className="flex h-screen w-full bg-gray-900 text-gray-200 overflow-hidden">
                    <ChatList currUser={currUser} setSelectedFriend={setSelectedFriend} />
                    <ChatWindow currUser={currUser} selectedFriend={selectedFriend} />
                </div>
            </div>
        </div>
    );
};

export default ChatMain;