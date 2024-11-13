import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

import MessageFriend from "../MessageFriend/MessageFriend";
import MessageMy from "../MessageMy/MessageMy";
import StartConversation from "../Status/StartConversation/StartConversation";
import SavedMessages from "../../assets/SavedMessages.jpg";
import {IChatWindowProps} from "../../types/props/props.interface";
import {editMyMessage, fetchMessages, sendMessage, uploadImage} from "../../api/messageApi";
import {IMessage} from "../../types/message/message.interface";
import {calculateRoom} from "../../utils/createRoom";
import AddedImage from "../../assets/AddedImage.svg";
import SendBtn from "../../assets/SendBtn.svg";

const socket = io('http://localhost:5001');

/**
 * ChatWindow component - renders the chat window for a selected friend
 *
 * @param {IChatWindowProps} props - component props, including current user and selected friend
 *
 * @returns {JSX.Element} The ChatWindow component
 */
const ChatWindow: React.FC<IChatWindowProps> = ({currUser, selectedFriend}) => {

    const [message, setMessage] =
        useState('');
    const [messages, setMessages] =
        useState<IMessage[]>([]);
    const [editMessage, setEditMessage] =
        useState<IMessage | null>(null);
    const [imageFile, setImageFile] =
        useState<File[]>([]);

    const currUserToken: string | null = localStorage.getItem('token')

    const currUserId: string | undefined = currUser?.id
    const currSelectedFriend: string | undefined  = selectedFriend?.id

    const currRoom: number = currUserId && currSelectedFriend ? calculateRoom(currUserId, currSelectedFriend) : 0;

    /**
     * useEffect hook to load messages and connect to sockets
     */
    useEffect(() => {
        if (!currUserId || !currSelectedFriend) return;
        socket.emit('joinRoom', currRoom.toString());

        const loadMessages = async (): Promise<void> => {
            try {
                if (currUserToken && currUserId && currSelectedFriend) {
                    const fetchedMessages = await fetchMessages(currSelectedFriend, currUserId, currUserToken);
                    setMessages(fetchedMessages);
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadMessages();

        socket.on('newMessage', (newMessage: IMessage) => {
            setMessages((prevMessages) => {
                const existingMessage: IMessage | undefined =
                    prevMessages.find((msg: IMessage): boolean => msg.id === newMessage.id);
                if (existingMessage) {
                    return prevMessages.map((msg: IMessage): IMessage =>
                        (msg.id === newMessage.id ? newMessage : msg));
                } else {
                    return [...prevMessages, newMessage];
                }
            });
        });

        socket.on('deleteMessage', (idMsg: number) => {
            setMessages((prevMessages) => {
                if (idMsg) {
                    return prevMessages.filter((msg: IMessage): boolean =>
                        msg.id !== idMsg
                    );
                }
                return prevMessages;
            });
        });

        return () => {
            socket.off('newMessage');
        };
    }, [currSelectedFriend, currUserId, currUserToken, currRoom]);

    /**
     * Handles file change event
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - the file input change event
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(Array.from(e.target.files));
        }
    };

    /**
     * Handles message input change
     *
     * @param {string} msg - the typed message
     */
    const inputMessage = (msg: string): void => {
        if (editMessage) {
            setEditMessage((prevMessage: IMessage | null) => ({
                ...prevMessage!,
                text: msg,
            }));
        } else {
            setMessage(msg)
        }
    };

    /**
     * Handles message submission
     *
     * @param {React.FormEvent} e - the form submit event
     */
    const onSubmitMessage = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (imageFile.length > 0) {
            await handleImageUpload();
        } else if (editMessage) {
            await updateMessage();
        } else {
            await createNewMessage();
        }
    };

    /**
     * Handles image upload
     */
    const handleImageUpload = async () => {
        if (imageFile && currUserToken) {
            const formData = new FormData();
            imageFile.forEach((file) => {
                formData.append('image', file);
            });
            try {
                if (currUserId && currSelectedFriend) {
                    const imageData =
                        await uploadImage(currUserId, currSelectedFriend, formData, currUserToken);
                    setImageFile([]);
                    const messageData = {
                        receiverId: currRoom.toString(),
                        message: imageData,
                    };
                    socket.emit('sendMessage', messageData);
                    setMessages((prevMessages: IMessage[]) => [...prevMessages, imageData]);
                    setImageFile([]);
                    setMessage('');
                }
            } catch (error) {
                console.error('Image upload error', error);
            }
        }
    };

    /**
     * Creates a new message
     */
    const createNewMessage = async (): Promise<void> => {
        try {
            if (currUserToken && currUserId && currSelectedFriend) {
                const newMessage = await sendMessage(currUserId, currSelectedFriend, message, currUserToken);
                const messageData = {
                    receiverId: currRoom.toString(),
                    message: newMessage,
                };
                socket.emit('sendMessage', messageData);
                setMessages((prevMessages: IMessage[]) => [...prevMessages, newMessage]);
                setMessage('');
            }
        } catch (error) {
            console.error('Create message error', error);
        }
    };

    /**
     * Updates an existing message
     */
    const updateMessage = async (): Promise<void> => {
        if (!editMessage) return;
        try {
            if (currUserToken && currUserId && currSelectedFriend) {
                const updatedMessage = await editMyMessage(editMessage.id, editMessage.text, currUserToken);
                const messageData = {
                    receiverId: currRoom.toString(),
                    message: updatedMessage.data,
                };
                socket.emit('updateMessage', messageData);
                setMessages((prevMessages: IMessage[]) =>
                    prevMessages.map((msg: IMessage) => (msg.id === updatedMessage.data.id ? updatedMessage.data : msg))
                );
                setEditMessage(null);
            }
        } catch (error) {
            console.error('Update message error', error);
        }
    };

    return (
        !selectedFriend ? <StartConversation /> : (
            <section className="flex flex-col flex-auto border-l border-gray-700">
                <div className="flex flex-row flex-none justify-between items-center shadow px-6 py-4">
                    {currUserId === currSelectedFriend ? (
                        <div className="flex items-center">
                            <div className="flex flex-shrink-0 w-12 h-12 mr-4 relative">
                                <img className="shadow-md rounded-full w-full h-full object-cover"
                                     src={SavedMessages}
                                     alt=""
                                />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold">Saved Messages</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div className="flex flex-shrink-0 w-12 h-12 mr-4 relative">
                                <img className="shadow-md rounded-full w-full h-full object-cover"
                                     src={"https://randomuser.me/api/portraits/women/13.jpg"}
                                     alt=""
                                />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold">{selectedFriend.username}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex">
                        <div className="block rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 p-2">
                            <svg viewBox="0 0 20 20" className="w-full h-full fill-current text-blue-500">
                                <path
                                    d="M11.1735916,16.8264084 C7.57463481,15.3079672 4.69203285,12.4253652 3.17359164,8.82640836 L5.29408795,6.70591205 C5.68612671,6.31387329 6,5.55641359 6,5.00922203 L6,0.990777969 C6,0.45097518 5.55237094,3.33066907e-16 5.00019251,3.33066907e-16 L1.65110039,3.33066907e-16 L1.00214643,8.96910337e-16 C0.448676237,1.13735153e-15 -1.05725384e-09,0.445916468 -7.33736e-10,1.00108627 C-7.33736e-10,1.00108627 -3.44283713e-14,1.97634814 -3.44283713e-14,3 C-3.44283713e-14,12.3888407 7.61115925,20 17,20 C18.0236519,20 18.9989137,20 18.9989137,20 C19.5517984,20 20,19.5565264 20,18.9978536 L20,18.3488996 L20,14.9998075 C20,14.4476291 19.5490248,14 19.009222,14 L14.990778,14 C14.4435864,14 13.6861267,14.3138733 13.2940879,14.7059121 L11.1735916,16.8264084 Z"/>
                            </svg>
                        </div>
                        <div className="block rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 p-2 ml-4">
                            <svg viewBox="0 0 20 20" className="w-full h-full fill-current text-blue-500">
                                <path
                                    d="M0,3.99406028 C0,2.8927712 0.894513756,2 1.99406028,2 L14.0059397,2 C15.1072288,2 16,2.89451376 16,3.99406028 L16,16.0059397 C16,17.1072288 15.1054862,18 14.0059397,18 L1.99406028,18 C0.892771196,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M8,14 C10.209139,14 12,12.209139 12,10 C12,7.790861 10.209139,6 8,6 C5.790861,6 4,7.790861 4,10 C4,12.209139 5.790861,14 8,14 Z M8,12 C9.1045695,12 10,11.1045695 10,10 C10,8.8954305 9.1045695,8 8,8 C6.8954305,8 6,8.8954305 6,10 C6,11.1045695 6.8954305,12 8,12 Z M16,7 L20,3 L20,17 L16,13 L16,7 Z"/>
                            </svg>
                        </div>
                        <div className="block rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 p-2 ml-4">
                            <svg viewBox="0 0 20 20" className="w-full h-full fill-current text-blue-500">
                                <path
                                    d="M2.92893219,17.0710678 C6.83417511,20.9763107 13.1658249,20.9763107 17.0710678,17.0710678 C20.9763107,13.1658249 20.9763107,6.83417511 17.0710678,2.92893219 C13.1658249,-0.976310729 6.83417511,-0.976310729 2.92893219,2.92893219 C-0.976310729,6.83417511 -0.976310729,13.1658249 2.92893219,17.0710678 Z M9,11 L9,10.5 L9,9 L11,9 L11,15 L9,15 L9,11 Z M9,5 L11,5 L11,7 L9,7 L9,5 Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-scroll p-4">
                    {messages.map((msg: IMessage) => {
                        if (currUserId && (+msg.senderId === +currUserId)) {
                            return <MessageMy key={msg.id}
                                              message={[msg]}
                                              setEditMessage={setEditMessage}
                                              currRoom={currRoom}
                                              socket={socket}
                            />;
                        }
                        return <MessageFriend key={msg.id} message={[msg]}/>;
                    })}
                </div>
                <div className="flex-none">
                    <div className="flex flex-row items-center p-4">
                        <button type="button"
                                onClick={() => {
                                    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
                                    if (fileInput) {
                                        fileInput.click();
                                    }
                                }}
                                className="
                                flex flex-shrink-0 focus:outline-none mx-2
                                block text-blue-600 hover:text-blue-700 w-6 h-6
                        ">
                            <input
                                type="file"
                                name="image"
                                id="file-input"
                                multiple
                                style={{display: 'none'}}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {imageFile.length > 0 ? (
                                <img src={AddedImage} alt=""/>
                            ) : (
                                <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                                    <path
                                        d="M10,1.6c-4.639,0-8.4,3.761-8.4,8.4s3.761,8.4,8.4,8.4s8.4-3.761,8.4-8.4S14.639,1.6,10,1.6z M15,11h-4v4H9  v-4H5V9h4V5h2v4h4V11z"/>
                                </svg>
                            )}
                        </button>
                        <div className="relative flex-grow">
                            <form onSubmit={onSubmitMessage}>
                                <input
                                    className="rounded-full py-2 pl-3 pr-10 w-full border border-gray-800
                            focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none
                            text-gray-200 focus:shadow-md transition duration-300 ease-in"
                                    type="text"
                                    value={message || (editMessage?.text || '')}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        inputMessage(e.target.value)} placeholder="Aa"/>
                                <button type="submit"
                                        className="flex flex-shrink-0 absolute top-0 right-0 mt-2 mr-3
                                focus:outline-none block text-blue-600 hover:text-blue-700 w-6 h-6">
                                    <img src={SendBtn} alt=""/>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    );
};

export default ChatWindow;