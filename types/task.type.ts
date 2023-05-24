import { ITaskTrigger } from "./trigger.type";

export type Frequency={
    minutes:number,
    hours:number,
    days:number,
    weeks:number,
    months:number,
    weekdays:string,
    monthdays:string
}

export interface ITask{
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
    trigger:ITaskTrigger,
}


export type TaskBody = Request['body'] & ITask;