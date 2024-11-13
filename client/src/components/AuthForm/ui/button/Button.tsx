import { InputHTMLAttributes } from 'react';

import { Loader } from '../loader/Loader';


interface IButton extends InputHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

export function Button({ isLoading, children}: IButton) {
    return (
        <button className="
            w-full text-white focus:ring-4 focus:outline-none
            font-medium rounded-lg text-sm px-5 py-2.5 text-center
            bg-primary-600 hover:bg-primary-700
            focus:ring-primary-800">
            {isLoading ? <Loader /> : children}
        </button>
    );
}
