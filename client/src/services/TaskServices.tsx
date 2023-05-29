import { IFrequency } from "../types/task.type";
import { apiClient } from "./utils/AxiosInterceptor";

// get user
export const GetTasks = async () => {
    return await apiClient.get(`tasks`)
}

// new task
export const NewTask= async (body: {
    task_title: string,
    task_detail: string,
    person: string,
    phone: number,
    start_date: string,
    frequency?:IFrequency
}) => {
    return await apiClient.post("tasks", body);
};

// start scheduler
export const StartTaskScheduler=async()=>{
    return await apiClient.post('tasks/start')
}

export const DeleteTask = async (id: string) => {
    return await apiClient.delete(`tasks/${id}`)
}