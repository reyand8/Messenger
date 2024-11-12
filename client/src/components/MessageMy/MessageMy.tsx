import React from "react";

import {formattedDate} from "../../utils/formattedDate";
import {deleteMessage} from "../../api/messageApi";
import {IMessageMyProps} from "../../types/props/props.interface";
import {BASE_URL} from "../../constants/apiUrl";


const MessageMy: React.FC<IMessageMyProps> = ({message, setEditMessage, currRoom, socket}) => {
    const { id, text,  createdAt, imagePaths } = message[0];

    const handleDeleteMessage = async (idMsg: number) => {
        try {
            if (idMsg) {
                await deleteMessage(idMsg);
                const messageData = {
                    receiverId: currRoom.toString(),
                    idMsg: idMsg,
                };
                socket.emit('deleteMessage', messageData)
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <p className="text-center text-sm text-gray-500 p-4 ">
                {formattedDate(createdAt)}
            </p>
            <div className="flex flex-row justify-end">
                <div className="text-sm text-white grid grid-flow-row gap-2">
                    <div className="flex items-center flex-row-reverse group">
                        {imagePaths
                            ?
                            <img src={`${BASE_URL}/${imagePaths}`} className="w-36" alt=""/>
                            :
                            <p className="rounded-t-full rounded-l-full bg-blue-700 px-6 py-3 max-w-xs lg:max-w-md">
                                {text}
                            </p>
                        }
                        <button type="button" onClick={() => handleDeleteMessage(id)}
                                className="
                            hidden group-hover:block flex flex-shrink-0 focus:outline-none
                            mx-2 block rounded-full text-gray-500 hover:text-gray-900
                            hover:bg-gray-700 bg-gray-800 w-8 h-8 p-2
                            ">
                            <svg fill="none" height="18" stroke="currentColor"
                                 viewBox="0 0 53 53"
                                 width="20" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z"/>

                            </svg>
                        </button>
                        <button type="button" onClick={() => setEditMessage(message[0])}
                                className="
                                hidden group-hover:block flex flex-shrink-0 focus:outline-none mx-2
                                block rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-700
                                bg-gray-800 w-8 h-8 p-2
                                ">

                            <svg fill="none" height="16" stroke="currentColor"
                                viewBox="0 0 24 24"
                                 width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>

                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageMy;