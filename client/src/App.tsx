import React, {useEffect, useState} from 'react';

import AuthForm from './components/AuthForm/AuthForm';
import ChatMain from "./components/ChatMain/ChatMain";
import {verifyToken} from "./api/authApi";
import {IUser} from "./types/user/user.interface";


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
                    <div className='
                    bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center
                    px-6 py-8 mx-auto md:h-screen lg:py-0'>
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