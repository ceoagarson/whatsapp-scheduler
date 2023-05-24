import { Request, NextFunction, Response } from "express";
import { TaskBody } from "../types/task.type";
import { isvalidDate } from "../utils/ValidDate";

export const StartTaskScheduler = (req: Request, res: Response, next: NextFunction) => {
    const { task_title, task_status, phone, person, start_date, frequency } = req.body as TaskBody
    if (!task_title || !task_status || !phone || !person || !start_date || !frequency)
        return res.status(400).json({ message: "fill all the required fields" });

    if ((String(phone).trim().length < 10))
        return res.status(403).json({ message: "please provide valid mobile number" });

    if (!isvalidDate(start_date)) {
        return res.status(403).json({ message: "please provide valid date" });
    }

    if (start_date < new Date()) {
        return res.status(403).json({ message: `Select valid  date ,date could not be in the past` })
    }

    let mf = frequency.months
    let hf = frequency.hours
    let df = frequency.days
    let wf = frequency.weeks
    let monthf = frequency.months
    let weekdays = frequency.weekdays
    let monthdays = frequency.monthdays
    if (!hf || typeof (hf) !== "number") hf = 0
    if (!df || typeof (df) !== "number") df = 0
    if (!wf || typeof (wf) !== "number") wf = 0
    if (!monthf || typeof (monthf) !== "number") monthf = 0

    let TmpArr = [mf, hf, df, wf, monthf]
    let count = 0
    TmpArr.forEach((item) => {
        if (item > 0) {
            count++;
        }
    });


    if (count > 1)
        return res.status(400).json({ message: "Select one from minuts,hours,days,weeks,months,weekday and monthday" });
    if (weekdays && monthdays)
        return res.status(400).json({ message: "Select one from minuts,hours,days,weeks,months,weekday and monthday" });

    let cronString = ""
    if (mf > 0) {
        cronString = "0-59" + `/${mf}` + " * * * *"
    }
    if (hf > 0) {
        cronString = `${start_date.getMinutes()}` + " 0/" + `${hf}` + " * * *"
    }
    if (df > 0) {
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + "1/" + `${df}` + " *" + " *"
    }
    if (wf > 0) {
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + " *" + " * " + "0/" + `${3}`
    }
    if (monthf > 0) {
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + `${start_date.getDate()}` + " 1/" + `${monthf}` + " *"
    }
   
    if(weekdays.length>0){
        let days = weekdays.split(",")
        let duplicates = days.filter((item, index) => days.indexOf(item) !== index)
        let tempTotal=0
        days.forEach((item)=>{
            tempTotal+=Number(item)
        })
        if (tempTotal > 28 ||duplicates.length>0){
            return res.status(400).json({ message: "select correct format for week days like 1,2,7" });
        }
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + " *" + " * " + weekdays
    }

    if (monthdays.length > 0) {
        let days = monthdays.split(",")
        let duplicates = days.filter((item, index) => days.indexOf(item) !== index)
        let tempTotal = 0
        days.forEach((item) => {
            tempTotal += Number(item)
        })
        if (tempTotal > 28 || duplicates.length > 0) {
            return res.status(400).json({ message: "select correct format for month days like 1,2,7 till 31" });
        }
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + monthdays 
        + " * " + "*"
    }

    res.status(200).json({ cronString: cronString })
}

