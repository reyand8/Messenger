export interface IUser {
    id: string;
    username: string;
}

export interface ICurrUser {
    id: string;
    username: string;
}

export interface ISelectedFriend {
    id: string;
    username: string;
}

export interface IAllUsers {
    data: IUser[]
}