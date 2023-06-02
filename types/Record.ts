export type IRecord = {
    _id: string,
    phone: number,
    message: string,
    timestamp: Date
}

export type TUserBody = Request['body'] & IRecord;