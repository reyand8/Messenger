import React, { useState } from 'react';
import {Controller, useForm} from 'react-hook-form';

import { register, login } from '../../api/authApi';
import Field from './ui/field/Field';
import {Button} from './ui/button/Button';
import {IFormData} from '../../types/auth/auth.interface';
import {IAuthFormProps} from '../../types/props/props.interface';

/**
 * AuthForm Component
 *
 * This component is responsible for rendering a form for user authentication. It supports both login and registration
 * functionality.
 *
 * @component
 *
 * @prop {Function} setToken - Function to set the authentication token in the parent component.
 *
 * @state {boolean} isRegister - Flag to switch between the registration and login form views.
 * @state {boolean} isLoading - Flag indicating whether a request to the server is in progress.
 * @state {string | null} error - Stores error message if an authentication error occurs.
 *
 * @returns {JSX.Element} The rendered form component for authentication (login or registration).
 */
const AuthForm: React.FC<IAuthFormProps> = ({ setToken }) => {
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors } } = useForm<IFormData>({
            defaultValues: { username: '', email: '', password: '' },
        });

    /**
     * Handles form submission for login or registration.
     *
     * @param {IFormData} data - The form data containing the email, password, and optionally username.
     */
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
                                    autoComplete="current-username"
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
                                autoComplete="current-email"
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
                                autoComplete="current-password"
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