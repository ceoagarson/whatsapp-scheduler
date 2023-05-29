import { apiClient } from "./utils/AxiosInterceptor";

// get user
export const GetMessages = async () => {
    return await apiClient.get(`messages`)
}

// new message
export const NewMessage = async (body: {
    message_title: string,
    message_detail: string,
    person: string,
    phone: number,
    start_date: Date,
    frequency?: {
        type: string,
        minutes: number,
        hours: number,
        days: number,
        months: number,
        weekdays: string,
        monthdays: string
    }
}) => {
    return await apiClient.post("messages", body);
};

// start scheduler
export const StartMessageScheduler = async () => {
    return await apiClient.post('messages/start')
}

export const DeleteMessage = async (id: string) => {
    return await apiClient.delete(`messages/${id}`)
}