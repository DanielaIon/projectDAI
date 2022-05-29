import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { Project } from "../models/project";
import { Task } from "../models/task";
import { User } from "../models/user";
import { Id, WithId } from "../models/with-id";
import { removeUser, setUser } from "./auth-service";

// const hostname = "http://localhost:8080";
const hostname = "https://d575-141-85-0-105.eu.ngrok.io" 

export const register = async (email: string, password: string) => {
    const { data } = await axios.post(`${hostname}/auth/register`, {
        email, password
    });
    const { user, error } = data;
    if (error) {
        showNotification({
            color: 'danger',
            title: 'Error on register',
            message: error,
        });
    }
    setUser(user);
    window.location.reload();
};
export const login = async (email: string, password: string) => {
    const { data } = await axios.post(`${hostname}/auth/login`, {
        email, password
    });
    const { user, error } = data;
    if (error) {
        showNotification({
            color: 'danger',
            title: 'Error on log in',
            message: error,
        });
    }
    setUser(user);
    window.location.reload();
};
export const logout = async () => {
    removeUser();
    window.location.reload();
};

export const createProject = async (project: Omit<Project, "id">) =>
    (await axios.post(`${hostname}/project`, project)).data;
export const getProjectList = async () =>
    (await axios.get(`${hostname}/project`)).data;
export const deleteProject = async (projectId: Id) =>
    (await axios.delete(`${hostname}/project/${projectId}`)).data;
export const updateProject = async (projectId: Id, project: Partial<Project>): Promise<void> =>
    await axios.put(`${hostname}/project/${projectId}`, project);

export const createTask = async (projectId: Id, task: Omit<Task, "id">) =>
    (await axios.post(`${hostname}/project/${projectId}/task`, task)).data;
export const getTaskList = async (projectId: Id) =>
    (await axios.get(`${hostname}/project/${projectId}/task`)).data;
export const deleteTask = async (projectId: Id, taskId: Id) =>
    (await axios.delete(`${hostname}/project/${projectId}/task/${taskId}`)).data;
export const updateTask = async (projectId: Id, taskId: Id, task: Partial<Task>): Promise<void> =>
    await axios.put(`${hostname}/project/${projectId}/task/${taskId}`, task);

export const getTeam = async (projectId: Id): Promise<WithId<User>[]> =>
    (await axios.get(`${hostname}/project/${projectId}/team`)).data;
export const addUserToTeam = async (projectId: Id, userId: Id): Promise<void> =>
    await axios.put(`${hostname}/project/${projectId}/team/add/${userId}`);
export const removeUserFromTeam = async (projectId: Id, userId: Id): Promise<void> =>
    await axios.put(`${hostname}/project/${projectId}/team/remove/${userId}`);

export const getUserList = async (): Promise<WithId<User>[]> =>
    (await axios.get(`${hostname}/user`)).data;
export const updateUser = async (userId: Id, user: Partial<User>): Promise<WithId<User>[]> =>
    (await axios.put(`${hostname}/user/${userId}`, user)).data;
export const deleteUser = async (userId: Id): Promise<WithId<User>[]> =>
    (await axios.delete(`${hostname}/user/${userId}`)).data;
