import React, {useEffect, useState} from 'react';

import AuthForm from './components/AuthForm/AuthForm';
import ChatMain from './components/ChatMain/ChatMain';
import {verifyToken} from './api/authApi';
import {IUser} from './types/user/user.interface';

/**
 * The main App component handles authentication and displays the chat interface.
 *
 * This component verify if a valid token is stored in `localStorage`, and attempts
 * to fetch the data. If the token is valid, the user data is
 * stored in the state, and the main chat interface (`ChatMain`) is rendered. If the token
 * is not available or invalid, the authentication form (`AuthForm`) is shown.
 *
 * @returns {JSX.Element} The App component JSX.
 */
const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
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
    }, []);

    return (
        <>
            {
                !token
                    ?
                    <div className="
                    bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center
                    px-6 py-8 mx-auto md:h-screen lg:py-0">
                        <AuthForm setToken={setToken}/>
                    </div>
                    :
                    <div className="flex h-screen">
                        <ChatMain currUser={userData} />
                    </div>
            }
        </>
    );
};

export default App;