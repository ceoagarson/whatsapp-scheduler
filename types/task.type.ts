export type Frequency={
    once:boolean,
    minutes:number,
    hours:number,
    days:number,
    weeks:number,
    months:number,
    years:number,
    weekdays:string,
    monthdays:string
}
export interface ITask{
    _id: string,
    task_title:string,
    task_detail:string,
    task_status:string,
    person:string,
    phone:number,
    task_timestamp:Date,
    whatsapp_status:string,
    whatsapp_timestamp:Date,
    start_date:Date,
    refresh_date:Date,
    frequency:Frequency,
    stop_message:boolean,
    delete_trigger:boolean
}


export type TUserBody = Request['body'] & ITask;