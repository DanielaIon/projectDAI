import { Task } from "./task";
import { User } from "./user";

export type Project = {
    title: string,
    deadlineTimestamp: number,
    description: string,
    responsableUser: User,
}