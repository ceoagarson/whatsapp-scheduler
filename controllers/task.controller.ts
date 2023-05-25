import { Request, NextFunction, Response } from "express";
import { TaskBody } from "../types/task.type";
import Task from "../models/tasks/Task";
import Frequency from "../models/tasks/Frequency";
import { isvalidDate } from "../utils/CheckValidDate";
import { RestartJobs } from "../utils/RestartJobs";

export const GetTasks = async (req: Request, res: Response, next: NextFunction) => {
    let tasks = await Task.find()
    res.status(200).json({ tasks: tasks })
}
export const CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    const { task_title, task_detail, person, phone, start_date, frequency } = req.body as TaskBody
    if (!task_title || !task_detail || !person || !phone || !start_date)
        return res.status(400).json({ message: "fill all the required fields" });
    if ((String(phone).trim().length < 10))
        return res.status(400).json({ message: "please provide valid mobile number" })
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({ message: "please provide valid date" })
    if (start_date < new Date())
        return res.status(400).json({ message: `Select valid  date ,date could not be in the past` })

    if (frequency) {
        let mf = frequency.minutes
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
            if (item && item > 0) {
                count++;
            }
        });

        if (weekdays || monthdays)
            count++
        if (count > 1)
            return res.status(400).json({ message: "Select one from minuts,hours,days,weeks,months,weekday and monthday" })


        if (weekdays && weekdays.length > 0) {
            let days = weekdays.split(",")
            let duplicates = days.filter((item, index) => days.indexOf(item) !== index)
            let tempTotal = 0
            days.forEach((item) => {
                tempTotal += Number(item)
            })
            if (tempTotal > 28 || duplicates.length > 0) {
                return res.status(400).json({ message: "select correct format for week days like 1,2,7 till 7" })

            }
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
        }
    }
    let task = new Task({
        task_title,
        task_detail,
        person,
        phone,
        start_date
    })

    let fq = new Frequency({
        type: frequency?.type,
        minutes: frequency?.minutes,
        hours: frequency?.hours,
        days: frequency?.days,
        weeks: frequency?.weeks,
        months: frequency?.months,
        weekdays: frequency?.weekdays,
        monthdays: frequency?.monthdays,
    })
    task.frequency = fq
    task = await task.save()
    fq = await fq.save()
    return res.status(201).json({ task: task, frequency: frequency })
}

export const StartTaskScheduler = async (req: Request, res: Response, next: NextFunction) => {
    RestartJobs()
    return res.status(200).json({ message: "started successfully" })
}



