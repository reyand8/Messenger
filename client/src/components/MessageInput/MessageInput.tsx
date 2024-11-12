import React, {useState} from 'react';

import {IMessageInputProps} from "../../types/props/props.interface";


const MessageInput: React.FC<IMessageInputProps> = ({handleSendMessage}) => {
    const [message, setMessage] = useState<string>('');

    return (
        <div className="flex-none">
            <div className="flex flex-row items-center p-4">
                <button type="button"
                        className="flex flex-shrink-0 focus:outline-none mx-2
                        block text-blue-600 hover:text-blue-700 w-6 h-6
                        ">
                    <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                        <path
                            d="M10,1.6c-4.639,0-8.4,3.761-8.4,8.4s3.761,8.4,8.4,8.4s8.4-3.761,8.4-8.4S14.639,1.6,10,1.6z M15,11h-4v4H9  v-4H5V9h4V5h2v4h4V11z"/>
                    </svg>
                </button>
                <div className="relative flex-grow">
                    <form onSubmit={handleSendMessage}>
                        <input
                            className="rounded-full py-2 pl-3 pr-10 w-full border border-gray-800
                            focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none
                            text-gray-200 focus:shadow-md transition duration-300 ease-in"
                            type="text" value={message}  placeholder="Aa"/>
                        <button type="submit"
                                className="flex flex-shrink-0 absolute top-0 right-0 mt-2 mr-3
                                focus:outline-none block text-blue-600 hover:text-blue-700 w-6 h-6">
                            <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                                <path
                                    d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM6.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.16 3a6 6 0 0 1-11.32 0h11.32z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;