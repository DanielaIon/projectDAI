import { User } from "./user";

export type Task = {
    responsableUser: User,
    status: TaskStatus,
    description: string,
    title: string,
    beginningTimestamp: number,
    endingTimestamp: number,
}

export enum TaskStatus {
    TO_DO = 'to_do',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}