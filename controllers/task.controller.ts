import { Request, NextFunction, Response } from "express";
import { TaskBody } from "../types/task.type";
import Task from "../models/tasks/Task";
import Frequency from "../models/Frequency";
import { isvalidDate } from "../utils/CheckValidDate";
import { RestartJobs } from "../utils/RestartJobs";
import { GetCronString } from "../utils/GetCronString";
import { GetRefreshCronString } from "../utils/GetRefreshCronString";
import TaskTrigger from "../models/tasks/TaskTrigger";
import TaskRefreshTrigger from "../models/tasks/TaskRefreshTrigger";
import { TaskManager } from "..";
import { SendTaskWhatsapp } from "../utils/SendTaskWhatsapp";
import { RefreshTask } from "../utils/RefreshTask";




export const Index = async (req: Request, res: Response, next: NextFunction) => {
    console.log(TaskManager)
    res.status(200).json({ message: "ok" })
}

export const GetTasks = async (req: Request, res: Response, next: NextFunction) => {
    TaskManager.add("job1", "1 * * * * ", () => console.log("running job1"))
    TaskManager.start('job1')
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
        let monthf = frequency.months
        let weekdays = frequency.weekdays
        let monthdays = frequency.monthdays
        if (!hf || typeof (hf) !== "number") hf = 0
        if (!df || typeof (df) !== "number") df = 0
        if (!monthf || typeof (monthf) !== "number") monthf = 0

        let TmpArr = [mf, hf, df, monthf]
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
    let tasks = await Task.find()
    tasks.forEach(async (task) => {
        if (task.frequency) {
            let frequency = await Frequency.findById(task.frequency._id)
            if (frequency) {
                let runstring = GetCronString(frequency, new Date(task.start_date))
                let refstring = GetRefreshCronString(frequency, new Date(task.start_date))
                if (!task.run_trigger && !task.refresh_trigger) {
                    if (runstring) {
                        let run_trigger = new TaskTrigger({
                            key: task._id,
                            status: "running",
                            cronString: runstring,
                            created_at: new Date(),
                            updated_at: new Date(),
                            task: task
                        })

                        await run_trigger.save()
                        await Task.findByIdAndUpdate(task._id, { run_trigger: run_trigger })
                        TaskManager.add(`${run_trigger._id}`, runstring, SendTaskWhatsapp)
                        TaskManager.start(`${run_trigger._id}`)
                      
                    }
                    if (refstring) {
                        let refresh_trigger = new TaskRefreshTrigger({
                            key: task._id,
                            status: "running",
                            cronString: refstring,
                            created_at: new Date(),
                            updated_at: new Date(),
                            task: task
                        })

                        await refresh_trigger.save()
                        await Task.findByIdAndUpdate(task._id, { refresh_trigger: refresh_trigger })
                        TaskManager.add(`${refresh_trigger._id}`, refstring, RefreshTask)
                        TaskManager.start(`${refresh_trigger._id}`)
                    }
                    if (!runstring && !refstring) {
                        await Task.findByIdAndUpdate(task._id, { once: true })
                        let cronString = `${new Date(task.start_date).getMinutes()} ` + `${new Date(task.start_date).getHours()} ` + "1/" + `${1}` + " *" + " *"
                        if (cronString) {
                            TaskManager.add(`${task._id}`, cronString, SendTaskWhatsapp)
                            TaskManager.start(`${task._id}`)
                        }
                    }
                }
            }
        }
    })
    return res.status(200).json({ message: "started successfully" })
}



