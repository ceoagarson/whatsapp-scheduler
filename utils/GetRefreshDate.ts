import { IFrequency } from "../types/task.type"

export function GetRefreshDate(frequency:IFrequency) {
    let date = new Date()
    let mf = frequency?.minutes
    let hf = frequency?.hours
    let df = frequency?.days
    let monthf = frequency?.months
    let weekdays = frequency?.weekdays
    let monthdays = frequency?.monthdays

    let refresh_date = date
    if (mf && mf >4) {
        let miliseconds = 2*60000
        refresh_date = new Date(date.getTime() - miliseconds)
    }
    if (hf && hf > 0) {
        let miliseconds = 10 * 60000
        refresh_date = new Date(date.getTime() - miliseconds)
    }
    if (df && df > 0) {
        let miliseconds = 30 * 60000
        refresh_date = new Date(date.getTime() - miliseconds)
    }

    if (monthf && monthf > 0) {
        let miliseconds = (30) * 60000
        refresh_date = new Date(date.getTime() - miliseconds)
    }

    if (weekdays && weekdays.length > 0) {
        let miliseconds = 30 * 60000
        refresh_date = new Date(date.getTime() - miliseconds)
    }

    if (monthdays && monthdays.length > 0) {
        let miliseconds = 30 * 60000
        refresh_date = new Date(date.getTime() - miliseconds)
    }

    return refresh_date
}