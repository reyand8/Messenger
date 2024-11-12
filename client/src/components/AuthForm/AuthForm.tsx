import React, { useState } from 'react';
import {Controller, useForm} from "react-hook-form";

import { register, login } from '../../api/authApi';
import Field from "./ui/field/Field";
import {Button} from "./ui/button/Button";
import {IFormData} from "../../types/auth/auth.interface";
import {IAuthFormProps} from "../../types/props/props.interface";


const AuthForm: React.FC<IAuthFormProps> = ({ setToken }) => {
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors } } = useForm<IFormData>({
        defaultValues: { username: '', email: '', password: '' },
    });

    const onSubmit = async (data: IFormData): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = isRegister
                ? await register(data.username, data.email, data.password)
                : await login(data.email, data.password);
            localStorage.setItem('token', response.token);
            setToken(response.token);
        } catch (error: any) {
            setError('Authentication error. Please try again.');
            console.error('Authentication error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="
            w-full bg-white rounded-lg shadow
            dark:border md:mt-0 sm:max-w-md xl:p-0
            dark:bg-gray-800 dark:border-gray-700"
        >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                {isRegister ?
                    <h1 className="
                    text-xl font-bold leading-tight
                    tracking-tight text-gray-900 md:text-2xl
                    dark:text-white"
                    >
                      Registration
                    </h1>
                    :
                    <h1 className="
                    text-xl font-bold leading-tight tracking-tight
                    text-gray-900 md:text-2xl dark:text-white"
                    >
                         Login
                    </h1>
                }
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                {isRegister && (
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: 'Username is required' }}
                        render={({ field }) => (
                            <Field
                                {...field}
                                placeholder="Username"
                                error={errors.username}
                                className="mb-7"
                            />
                        )}
                    />
                    )}
                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: 'Email is required', pattern: /^\S+@\S+\.\S+$/i }}
                        render={({ field }) => (
                            <Field
                                {...field}
                                placeholder="Email"
                                error={errors.email}
                                className="mb-10"
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: 'Password is required' }}
                        render={({ field }) => (
                            <Field
                                {...field}
                                placeholder="Password"
                                type="password"
                                error={errors.password}
                                className="mb-13"
                            />
                        )}
                    />
                    {error &&
                        <p className="text-red-500 text-center">{error}</p>
                    }
                    <div className="text-center">
                        <Button isLoading={isLoading} disabled={isLoading} type="submit">
                            {isRegister ? 'Register' : 'Login'}
                        </Button>
                    </div>
                    <button type="button" onClick={() => setIsRegister(!isRegister)}
                        className="text-sm font-light text-gray-500 dark:text-gray-400">
                        {isRegister ?
                            <div className="flex mb-4 ml-3">
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account?
                                </p>
                                <p className="font-medium text-primary-600 hover:underline dark:text-primary-500 pl-2">
                                    Login
                                </p>
                            </div>
                            :
                            <div className="flex mb-4 ml-3">
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">No account?</p>
                                <p className="font-medium text-primary-600 hover:underline dark:text-primary-500 pl-2">
                                    Register
                                </p>
                            </div>
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;