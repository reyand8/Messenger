import React from 'react';

import SavedMessages from '../../assets/SavedMessages.jpg';
import {IChatSavedItemProps} from '../../types/props/props.interface';


const ChatSavedItem: React.FC<IChatSavedItemProps> = ({user, setSelectedFriend}) => {
    return (
        <div onClick={() => setSelectedFriend(user)} key={user.id}
            className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
            <div className="flex flex-shrink-0 w-16 h-16 relative">
                <img className="shadow-md rounded-full w-full h-full object-cover"
                    src={SavedMessages} alt=""/>
            </div>
            <div className="flex-auto min-w-0 ml-5 mr-6 hidden md:block group-hover:block">
                <p className="text-white font-semibold">Saved Messages</p>
            </div>
        </div>
    );
};

export default ChatSavedItem;