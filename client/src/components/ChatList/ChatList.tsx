import React, {useEffect, useState} from 'react';

import {fetchAllUsers} from "../../api/userApi";
import ErrorMsg from "../Status/ErrorMsg/ErrorMsg";
import LoadingMsg from "../Status/LoadingMsg/LoadingMsg";
import ChatItem from "../ChatItem/ChatItem";
import ChatSavedItem from "../ChatSavedItem/ChatSavedItem";
import {IChatListProps} from "../../types/props/props.interface";
import {IUser} from "../../types/user/user.interface";

/**
 * ChatList Component
 *
 * This component fetches and displays a list of users, allows searching through the list,
 * and provides a way to log out.
 *
 * Props:
 * - currUser (IUser | null): The current logged-in user.
 * - setSelectedFriend (function): A function to set the selected user (friend).
 */
const ChatList: React.FC<IChatListProps> = ({currUser, setSelectedFriend}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false);
    const [allUsers, setAllUsers] = useState<IUser[]>()
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const getAllUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetchAllUsers();
                setAllUsers(response)
            } catch (error: any) {
                setIsError(true);
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
        getAllUsers();
    }, []);

    /**
     * Handles logging out by clearing the token from localStorage and reloading the page.
     */
    const handleFinishSession = (): void => {
        localStorage.removeItem('token');
        window.location.reload();
    }

    const searchUser: IUser[] | undefined = allUsers?.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section
            className="flex flex-col flex-none w-24 group lg:max-w-sm md:w-2/5">
            <div className="flex flex-row justify-between items-center flex-none p-5 w-9">
                <button onClick={() => handleFinishSession()}>
                    <svg height="32"
                         viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
                        <title/>
                        <g data-name="1" id="_1">
                            <path
                                d="M27,3V29a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V27H7v1H25V4H7V7H5V3A1,1,0,0,1,6,2H26A1,1,0,0,1,27,3ZM10.71,20.29,7.41,17H18V15H7.41l3.3-3.29L9.29,10.29l-5,5a1,1,0,0,0,0,1.42l5,5Z"
                                id="logout_account_exit_door"
                                className="w-full h-full fill-current text-blue-500"
                            />
                        </g>
                    </svg>
                </button>
            </div>
            <div className="flex-none p-4">
                <form>
                    <div className="relative">
                        <label>
                            <input
                                className="
                                rounded-full py-2 pr-10 pl-10 w-full border
                                border-gray-800 focus:border-gray-700 bg-gray-800
                                focus:bg-gray-900 focus:outline-none text-gray-200
                                focus:shadow-md transition duration-300 ease-in
                                "
                                type="text" placeholder="Search..."
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                            <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                                <svg viewBox="0 0 24 24" className="w-6 h-6">
                                    <path fill="#bbb"
                                          d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
                                </svg>
                            </span>
                        </label>
                    </div>
                </form>
            </div>
            {isError ? (
                <ErrorMsg/>
            ) : isLoading ? (
                <LoadingMsg/>
            ) : (
                <div className="flex-1 p-3 overflow-y-scroll">
                    {searchUser?.length === 0 ? (
                        <p className="text-gray-200 mt-1 ml-3">No users found</p>
                    ) : (
                        searchUser?.map((user) => (
                            user.id === currUser?.id ? (
                                <ChatSavedItem  key={user.id} user={user} setSelectedFriend={setSelectedFriend}/>
                            ) : (
                                <ChatItem key={user.id} user={user} setSelectedFriend={setSelectedFriend}/>
                            )
                        ))
                    )}
                </div>
            )}
        </section>
    );
};

export default ChatList;