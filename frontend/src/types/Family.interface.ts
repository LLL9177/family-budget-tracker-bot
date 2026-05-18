import type { IUser } from "./User.interface";

export interface IFamily {
    id: string;
    name: string;
    members: IUser[];
    owner: IUser;
    joinRequests: IUser;
}