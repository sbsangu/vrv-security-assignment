export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MODERATOR = 'MODERATOR',
   
}

export interface IUser {
    id?: string;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt?: Date;
}


export interface AuthPayload {
    id: string;
    email: string;
    role: string;
  }
  