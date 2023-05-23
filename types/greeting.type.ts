import { Frequency } from "./task.type.js";

export interface IGreeting {
    _id: string,
    greeting_title: string,
    greeting_detail: string,
    greeting_status: string,
    person: string,
    phone: number,
    greeting_timestamp: Date,
    whatsapp_status: string,
    whatsapp_timestamp: Date,
    start_date: Date,
    refresh_date: Date,
    frequency: Frequency,
    stop_message: boolean,
    delete_trigger: boolean
}

export type TUserBody = Request['body'] & IGreeting;