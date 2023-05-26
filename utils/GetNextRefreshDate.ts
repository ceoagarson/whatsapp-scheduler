import { IFrequency } from "../types/task.type";
import { GetMonthDays } from "./GetMonthDays";
import { SortUniqueNumbers } from "./SortUniqueNumbers";


export function GetNextRefreshDate(frequency: IFrequency, next_refresh: Date) {
    let mf = frequency?.minutes
    let hf = frequency?.hours
    let df = frequency?.days
    let monthf = frequency?.months
    let weekdays = frequency?.weekdays
    let monthdays = frequency?.monthdays
    if (!next_refresh)
        next_refresh = new Date()

    if (mf && mf > 4) {
        for (let i = 1; i <= 60; i += mf) {
            if (i > next_refresh.getMinutes()) {
                next_refresh = new Date(next_refresh.getMinutes() + (i - next_refresh.getMinutes()))
                break
            }

        }
    }
    if (hf && hf > 0) {
        for (let i = 1; i <= 24; i += hf) {
            if (i > next_refresh.getHours()) {
                next_refresh = new Date(next_refresh.getHours() + (i - next_refresh.getHours()))
                break
            }

        }

    }
    if (df && df > 0) {
        for (let i = 1; i <= GetMonthDays(next_refresh.getFullYear(), next_refresh.getMonth()); i += df) {
            if (i > next_refresh.getDate()) {
                next_refresh = new Date(next_refresh.getDate() + (i - next_refresh.getDate()))
                break
            }
        }
    }

    if (monthf && monthf > 0) {
        for (let i = 1; i <= 12; i += monthf) {
            if (i > next_refresh.getMonth()) {
                next_refresh = new Date(next_refresh.getMonth() + (i - next_refresh.getMonth()))
                break
            }
        }
    }

    if (weekdays && weekdays.length > 0) {
        let tempWeekdays: number[] = []
        weekdays.split(",").forEach((wdd) => {
            let wd = 0
            wd = Number(wdd)
            tempWeekdays.push(wd)
        })
        tempWeekdays = SortUniqueNumbers(tempWeekdays)

        for (let i = 1; i <= tempWeekdays.length; i++) {
            if (tempWeekdays[i] === next_refresh.getDay()) {       
                next_refresh = new Date(next_refresh.getDay() + (tempWeekdays[i + 1] - next_refresh.getDay()))
                break
            }
        }
    }
    if (monthdays && monthdays.length > 0) {
        let tempMonthdays: number[] = []
        monthdays.split(",").forEach((wdd) => {
            let wd = 0
            wd = Number(wdd)
            tempMonthdays.push(wd)
        })
        tempMonthdays = SortUniqueNumbers(tempMonthdays)

        for (let i = 1; i <= tempMonthdays.length; i++) {
            if (tempMonthdays[i] === next_refresh.getDay()) {
                next_refresh = new Date(next_refresh.getDate() + (tempMonthdays[i + 1] - next_refresh.getDate()))
                break
            }
        }
    }

    return next_refresh
}