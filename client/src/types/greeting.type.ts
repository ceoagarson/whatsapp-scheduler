export type IFrequency = {
    _id?: string,
    type: string,//greeting or greeting
    minutes?: number,
    hours?: number,
    days?: number,
    months?: number,
    weekdays?: string,
    monthdays?: string,
}
export type IGreetingTrigger = {
    _id: string,
    key: string,
    status: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    greeting: IGreeting,
}
export type IGreetingRefreshTrigger = {
    _id: string,
    key: string,
    status: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    greeting: IGreeting
}
export interface IGreeting{
    _id: string,
    greeting_image:string,
    greeting_detail:string,
    person:string,
    phone:string,

    message_id:string,
    whatsapp_status: string,
    whatsapp_timestamp: Date,
    greeting_status: string,
    greeting_timestamp: Date,

    autoRefresh:boolean,
    autostop:boolean,
   
    frequency:IFrequency,
    running_trigger:IGreetingTrigger,
    refresh_trigger:IGreetingRefreshTrigger,
    
    start_date: Date,
    next_run_date:Date,
    next_refresh_date:Date,
    created_at: Date,
    updated_at: Date
}


export type GreetingBody = Request['body'] & IGreeting;