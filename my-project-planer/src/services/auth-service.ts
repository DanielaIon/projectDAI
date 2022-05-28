import { User, UserRole } from "../models/user";
import { WithId } from '../models/with-id';


export const getUser = (): WithId<User> | null => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
        return null;
    }

    try {
        return JSON.parse(userJson);
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const setUser = (user: WithId<User> | undefined): void => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const removeUser = (): void => {
    localStorage.removeItem('user');
}

export const isManager = (): boolean => {
    const user = getUser();
    if (!user) {
        return false;
    }

    return user.role !== UserRole.USER;
}

export const isAdmin = (): boolean => {
    const user = getUser();
    if (!user) {
        return false;
    }

    return user.role === UserRole.ADMIN;
}