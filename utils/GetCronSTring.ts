import { Response } from "express";
import { IGreeting } from "../types/greeting.type";
import { ITask } from "../types/task.type";
import { isvalidDate } from "./CheckValidDate";

export const GetCronSTring = (task: ITask | IGreeting, res: Response) => {
    if ((String(task.phone).trim().length < 10))
        return res.status(400).json({ message : "please provide valid mobile number" })
    if (!isvalidDate(task.start_date))
        return res.status(400).json({ message :"please provide valid date" })
    if (task.start_date < new Date())
        return res.status(400).json({ message :`Select valid  date ,date could not be in the past` })
       
    let mf = task.frequency.months
    let hf = task.frequency.hours
    let df = task.frequency.days
    let wf = task.frequency.weeks
    let monthf = task.frequency.months
    let weekdays = task.frequency.weekdays
    let monthdays = task.frequency.monthdays
    if (!hf || typeof (hf) !== "number") hf = 0
    if (!df || typeof (df) !== "number") df = 0
    if (!wf || typeof (wf) !== "number") wf = 0
    if (!monthf || typeof (monthf) !== "number") monthf = 0

    let TmpArr = [mf, hf, df, wf, monthf]
    let count = 0
    TmpArr.forEach((item) => {
        if (item&&item > 0) {
            count++;
        }
    });

    if (weekdays || monthdays)
        count++
    if (count > 1)
        return res.status(400).json({ message : "Select one from minuts,hours,days,weeks,months,weekday and monthday" })

    let cronString =undefined
    if (mf&&mf > 0) {
        cronString = "0-59" + `/${mf}` + " * * * *"
    }
    if (hf > 0) {
        cronString = `${task.start_date.getMinutes()}` + " 0/" + `${hf}` + " * * *"
    }
    if (df > 0) {
        cronString = `${task.start_date.getMinutes()} ` + `${task.start_date.getHours()} ` + "1/" + `${df}` + " *" + " *"
    }
    if (wf > 0) {
        cronString = `${task.start_date.getMinutes()} ` + `${task.start_date.getHours()} ` + " *" + " * " + "0/" + `${3}`
    }
    if (monthf > 0) {
        cronString = `${task.start_date.getMinutes()} ` + `${task.start_date.getHours()} ` + `${task.start_date.getDate()}` + " 1/" + `${monthf}` + " *"
    }

    if (weekdays&&weekdays.length > 0) {
        let days = weekdays.split(",")
        let duplicates = days.filter((item, index) => days.indexOf(item) !== index)
        let tempTotal = 0
        days.forEach((item) => {
            tempTotal += Number(item)
        })
        if (tempTotal > 28 || duplicates.length > 0) {
            return res.status(400).json({ message: "select correct format for week days like 1,2,7 till 7" })
           
        }
        cronString = `${task.start_date.getMinutes()} ` + `${task.start_date.getHours()} ` + " *" + " * " + weekdays
    }

    if (monthdays && monthdays.length > 0) {
        let days = monthdays.split(",")
        let duplicates = days.filter((item, index) => days.indexOf(item) !== index)
        let tempTotal = 0
        days.forEach((item) => {
            tempTotal += Number(item)
        })
        if (tempTotal > 28 || duplicates.length > 0) {
            return res.status(400).json({ message: "select correct format for month days like 1,2,7 till 31" })
           
        }
        cronString = `${task.start_date.getMinutes()} ` + `${task.start_date.getHours()} ` + monthdays
            + " * " + "*"
    }
    return cronString
}
