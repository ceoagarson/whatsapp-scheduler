import { IGreeting } from "./greeting.type";
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
export type IGreetingTrigger = {
    _id: string,
    key: string,
    status: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    task: IGreeting,
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
export type GreetingTriggerBody = Request['body'] & IGreetingTrigger;
export type TaskTriggerBody = Request['body'] & ITaskTrigger;
export type TaskRefreshTriggerBody = Request['body'] & ITaskRefreshTrigger;