import { Frequency } from "./task.type";
import { IGreetingTrigger } from "./trigger.type";


export interface IGreeting{
    _id: string,
    task_title:string,
    task_detail:string,
    task_status:string,
    person:string,
    phone:string,
    whatsapp_status:string,
    start_date:Date,
    refresh_date:Date,
    autostop:boolean,
    autoRefresh:boolean,
    created_at: Date,
    updated_at: Date
    whatsapp_timestamp:Date,
    task_timestamp:Date,
    frequency:Frequency,
    trigger:IGreetingTrigger,
}


export type GreetingBody = Request['body'] & IGreeting;