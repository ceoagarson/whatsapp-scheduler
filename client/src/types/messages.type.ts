import { IFrequency } from "./task.type"
import { IUser } from "./user.type"

export type IMessageTrigger = {
    _id: string,
    key: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    message: IMessage,
}
export type IMessageRefreshTrigger = {
    _id: string,
    key: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    message: IMessage
}
export interface IMessage {
    _id: string,
    message_image: string,
    message_detail: string,
    person: string,
    phone: string,

    message_id: string,
    whatsapp_status: string,
    whatsapp_timestamp: Date | null,
    message_status: string,
    message_timestamp: Date | null,
    run_once: boolean,
    autoRefresh: boolean,
    autoStop: boolean,

    frequency: IFrequency,
    running_trigger: IMessageTrigger,
    refresh_trigger: IMessageRefreshTrigger,

    start_date: Date,
    next_run_date: Date,
    next_refresh_date: Date,
    created_at: Date,
    created_by: IUser,
    updated_at: Date,
    updated_by: IUser
}


export type MessageBody = Request['body'] & IMessage;