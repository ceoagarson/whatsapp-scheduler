import { Request, NextFunction, Response } from "express";
import { TaskBody } from "../types/task.type";
import Task from "../models/tasks/Task";
import Frequency from "../models/Frequency";
import { isvalidDate } from "../utils/CheckValidDate";
import { GetCronString } from "../utils/GetCronString";
import { GetRefreshCronString } from "../utils/GetRefreshCronString";
import TaskTrigger from "../models/tasks/TaskTrigger";
import TaskRefreshTrigger from "../models/tasks/TaskRefreshTrigger";
import { TaskManager } from "..";
import { SendTaskWhatsapp } from "../utils/SendTaskWhatsapp";
import { RefreshTask } from "../utils/RefreshTask";
import { GetNextRunDate } from "../utils/GetNextRunDate";
import { GetNextRefreshDate } from "../utils/GetNextRefreshDate";

//home page
export const Index = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "ok" })
}

//get tasks
export const GetTasks = async (req: Request, res: Response, next: NextFunction) => {
    let tasks = await Task.find().populate('frequency').populate('run_trigger').populate('refresh_trigger')
    res.status(200).json({ tasks: tasks })
}

//create new task
export const CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    const { task_title, task_detail, person, phone, start_date, frequency } = req.body as TaskBody
    if (!task_title || !task_detail || !person || !phone || !start_date)
        return res.status(400).json({ message: "fill all the required fields" });
    if ((String(phone).trim().length != 12))
        return res.status(400).json({ message: "please provide valid mobile number" })
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({ message: "please provide valid date" })
    if (new Date(start_date) < new Date())
        return res.status(400).json({ message: `Select valid  date ,date could not be in the past` })

    let task = new Task({
        task_title,
        task_detail,
        person,
        phone,
        start_date
    })

    let errorStatus = false

    if (frequency) {
        let mf = frequency.minutes
        let hf = frequency.hours
        let df = frequency.days
        let monthf = frequency.months
        let weekdays = frequency.weekdays
        let monthdays = frequency.monthdays
        if (!mf) mf = 0
        if (!hf) hf = 0
        if (!df) df = 0
        if (!monthf) monthf = 0
        let TmpArr = [mf, hf, df, monthf]
        let count = 0
        TmpArr.forEach((item) => {
            if (item > 0) {
                count++;
            }
        });
        if (weekdays)
            count++
        if (monthdays)
            count++
        if (count > 1)
            return res.status(400).json({ message: "Select one from minuts,hours,days,weeks,months,weekday and monthday" })
        let tmpWeekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        if (weekdays && weekdays.length > 0) {
            weekdays.split(",").forEach((item) => {
                if (!tmpWeekdays.includes(item.toLowerCase())) {
                    errorStatus = true

                }
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select week days in correct format" })
            let numWeeks = weekdays.split(',').map((wd) => {
                if (wd === "mon")
                    return '1'
                if (wd === "tue")
                    return '2'
                if (wd === "wed")
                    return '3'
                if (wd === "thu")
                    return '4'
                if (wd === "fri")
                    return '5'
                if (wd === "sat")
                    return '6'
                if (wd === "sun")
                    return '7'

            })
            weekdays = numWeeks.toString()
        }
        if (monthdays && monthdays.length > 0) {
            monthdays.split(",").forEach((item) => {
                if (Number(item) < 10 && item.length > 1) {
                    errorStatus = true

                }

                if (Number(item) === 0 || item.length > 2 || Number(item) > 31) {
                    errorStatus = true
                }
            })
            if (errorStatus) {
                return res.status(400).json({ message: `Select month days in correct format` })
            }
        }

        let fq = new Frequency({
            type: frequency?.type,
            minutes: mf,
            hours: hf,
            days: df,
            months: monthf,
            weekdays: weekdays,
            monthdays: monthdays
        })
        if (fq)
            await fq.save()
        task.frequency = fq
    }

    task = await task.save()
    if (!errorStatus)
        return res.status(201).json({ task: task })
}

//start task scheduler
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
                        await Task.findByIdAndUpdate(task._id, { run_trigger: run_trigger, running_date: GetNextRunDate(frequency, task.start_date) })
                        if (run_trigger) {
                            TaskManager.add(`${run_trigger._id}`, runstring, () => { SendTaskWhatsapp(run_trigger._id) })
                            TaskManager.start(`${run_trigger._id}`)
                        }
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
                        await Task.findByIdAndUpdate(task._id, { refresh_trigger: refresh_trigger, refresh_date: GetNextRefreshDate(frequency, task.start_date) })

                        if (refresh_trigger) {
                            TaskManager.add(`${refresh_trigger._id}`, refstring, () => { RefreshTask (refresh_trigger._id)})
                            TaskManager.start(`${refresh_trigger._id}`)
                        }

                    }
                    if (!runstring && !refstring) {
                        await Task.findByIdAndUpdate(task._id, { once: true })
                        let cronString = `${new Date(task.start_date).getMinutes()} ` + `${new Date(task.start_date).getHours()} ` + "1/" + `${1}` + " *" + " *"
                        if (cronString) {
                            TaskManager.add(`${task._id}`, cronString, () => { console.log("run once") })
                            TaskManager.start(`${task._id}`)
                        }
                    }
                }
            }
        }
    })

    return res.status(200).json({ message: "started successfully" })
}



