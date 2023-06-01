import { IFrequency } from "../types/task.type";
import { apiClient } from "./utils/AxiosInterceptor";

export const GetTasks = async () => {
    return await apiClient.get(`tasks`)
}

export const NewTask = async (body: {
    task_title: string,
    task_detail: string,
    person: string,
    phone: number,
    start_date: string,
    frequency?: IFrequency
}) => {
    return await apiClient.post("tasks", body);
};

export const StartTaskScheduler = async () => {
    return await apiClient.post('tasks/start')
}
export const StartSingleTaskScheduler = async (id: string) => {
    return await apiClient.post(`tasks/start/${id}`)
}

export const StopTaskScheduler = async () => {
    return await apiClient.post('tasks/stop')
}
export const StopSingleTaskScheduler = async (id: string) => {
    return await apiClient.post(`tasks/stop/${id}`)
}

export const DeleteTask = async (id: string) => {
    return await apiClient.delete(`tasks/${id}`)
}

export const UpdateTask = async ({ id, body }: {
    id: string, body: {
        task_title: string,
        task_detail: string,
        person: string,
        phone: number,
        start_date: string,
        frequency?: IFrequency
    }
}) => {
    return await apiClient.put(`tasks/${id}`,body)
}