import { IUser } from "./user.type"

export type IFrequency = {
    _id?: string,
    type: string,//task or greeting
    frequencyType:string,
    frequency:string
}
export type ITaskTrigger = {
    _id: string,
    key: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    task: ITask,
}
export type ITaskRefreshTrigger = {
    _id: string,
    key: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    task: ITask
}
export interface ITask {
    _id: string,
    task_title: string,
    task_detail: string,
    person: string,
    phone: string,

    message_id: string,
    whatsapp_status: string,
    whatsapp_timestamp: Date | null,
    task_status: string,
    task_timestamp: Date | null,

    autoRefresh: boolean,
    autostop: boolean,

    frequency: IFrequency,
    running_trigger: ITaskTrigger,
    refresh_trigger: ITaskRefreshTrigger,
    run_once:boolean,
    start_date: Date,
    next_run_date: Date,
    next_refresh_date: Date,
    created_at: Date,
    created_by: IUser,
    updated_at: Date,
    updated_by: IUser
}


export type TaskBody = Request['body'] & ITask;