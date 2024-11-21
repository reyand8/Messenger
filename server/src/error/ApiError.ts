import {IApiError} from '../types/error.interface';


const ApiError = (status: number, message: string): IApiError => {
    return { status, message };
};

const badRequest = (message: string): IApiError => {
    return ApiError(404, message);
};

const internal = (message: string): IApiError => {
    return ApiError(500, message);
};

export { ApiError, badRequest, internal };