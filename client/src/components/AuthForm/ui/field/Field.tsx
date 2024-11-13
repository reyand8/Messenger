import { forwardRef } from 'react';
import { InputHTMLAttributes } from 'react';

import {IFieldProps} from '../../../../types/props/props.interface';


export type TypeInputProps = InputHTMLAttributes<HTMLInputElement> & IFieldProps;

export const Field = forwardRef<HTMLInputElement, TypeInputProps>(
    ({
        error, style,
        className, ...rest }, ref) => {
        return (
            <label className="block mb-2 text-sm font-medium text-white" style={style}>
                <input ref={ref}
                    {...rest}
                    className="
                    bg-gray-50 border rounded-lg block w-full p-2.5
                    dark:bg-gray-700 border-gray-600
                    placeholder-gray-400 text-white focus:ring-blue-500
                    focus:border-blue-500"
                />
                {error && (
                    <div className="absolute -bottom-5 left-9 text-red-600 text-xs">
                        {error.message}
                    </div>
                )}
            </label>
        );
    }
);


export default Field;