import React from 'react';

import {formattedDate} from "../../utils/formattedDate";
import {IMessageFriendProps} from "../../types/props/props.interface";
import {BASE_URL} from "../../constants/apiUrl";


const MessageFriend: React.FC<IMessageFriendProps> = ({message}) => {
    const { text,  createdAt, imagePaths } = message[0]
    return (
        <>
            <p className="text-center text-sm text-gray-500 p-4">
                {formattedDate(createdAt)}
            </p>
            <div className="flex flex-row justify-start">
                <div className="relative flex flex-shrink-0 w-8 h-8 mr-4">
                    <img className="shadow-md rounded-full w-full h-full object-cover"
                         src="https://randomuser.me/api/portraits/women/33.jpg"
                         alt=""
                    />
                </div>
                <div className="text-sm text-gray-700 grid grid-flow-row gap-2">
                    <div className="flex items-center group">
                        {imagePaths
                            ?
                            <img src={`${BASE_URL}/${imagePaths}`} className="w-36" alt=""/>
                            :
                            <p className="
                            px-6 py-3 rounded-r-full rounded-l-full bg-gray-800
                            max-w-xs lg:max-w-md text-gray-200"
                            >
                                {text}
                            </p>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageFriend;