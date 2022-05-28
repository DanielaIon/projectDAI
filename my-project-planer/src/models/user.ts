
export type User = {

    name: string,
    email: string,
    role: UserRole,
}

export enum UserRole {
    USER = 'user',
    MANAGER = 'manager',
    ADMIN = 'admin'
}