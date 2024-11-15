export interface IFormData {
    username: string;
    email: string;
    password: string;
}

export interface IAuthResponse {
    token: string;
}

export interface IVerifyToken {
    username: string;
    email: string;
    id: string;
}