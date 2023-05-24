import { ITask } from "./task.type";

export type ITaskTrigger={
    _id:string,
    key:string,
    status:string,
    cronString:string,
    created_at:Date,
    updated_at:Date
    task:ITask,
}
export type ITaskRefreshTrigger = {
    _id: string,
    key: string,
    status: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    task: ITask,
}
export type TaskTriggerBody = Request['body'] & ITaskTrigger;
export type TaskRefreshTriggerBody = Request['body'] & ITaskRefreshTrigger;