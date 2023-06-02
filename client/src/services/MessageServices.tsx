import { IFrequency } from "../types/task.type";
import { apiClient } from "./utils/AxiosInterceptor";

export const GetMessages = async () => {
    return await apiClient.get(`messages`)
}

export const GetRecord = async (phone?:number) => {
    return await apiClient.get(`records/${phone}`)
}
export const NewMessage = async (body: {
    message_image: string,
    message_detail: string,
    person: string,
    phone: number,
    start_date: string,
    frequency?: IFrequency
}) => {
    return await apiClient.post("messages", body);
};

export const StartMessageScheduler = async () => {
    return await apiClient.post('messages/start')
}
export const StartSingleMessageScheduler = async (id: string) => {
    return await apiClient.post(`messages/start/${id}`)
}

export const StopMessageScheduler = async () => {
    return await apiClient.post('messages/stop')
}
export const StopSingleMessageScheduler = async (id: string) => {
    return await apiClient.post(`messages/stop/${id}`)
}

export const DeleteMessage = async (id: string) => {
    return await apiClient.delete(`messages/${id}`)
}

export const UpdateMessage = async ({ id, body }: {
    id: string, body: {
        message_image: string,
        message_detail: string,
        person: string,
        phone: number,
        start_date: string,
        frequency?: IFrequency
    }
}) => {
    return await apiClient.put(`messages/${id}`, body)
}