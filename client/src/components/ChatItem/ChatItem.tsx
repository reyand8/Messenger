import React from 'react';

import getRandomContact from '../../utils/randomImg';
import {IChatItemProps} from '../../types/props/props.interface';


const ChatItem: React.FC<IChatItemProps> = ({user, setSelectedFriend}) => {
    return (
        <div onClick={() => setSelectedFriend(user)} key={user.id}
            className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
            <div className="flex flex-shrink-0 w-16 h-16 relative">
                <img
                    className="shadow-md rounded-full w-full h-full object-cover"
                    src={getRandomContact()} alt=""
                />
            </div>
            <div className="flex-auto min-w-0 ml-5 mr-6 hidden md:block group-hover:block">
                <p className="text-white font-semibold">{user.username}</p>
            </div>
        </div>
    );
};

export default ChatItem;