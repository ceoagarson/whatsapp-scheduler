import { Request, NextFunction, Response } from "express";
import { TaskBody } from "../types/task.type";
import Task from "../models/tasks/Task";
import Frequency from "../models/Frequency";
import { isvalidDate } from "../utils/CheckValidDate";
import TaskTrigger from "../models/tasks/TaskTrigger";
import TaskRefreshTrigger from "../models/tasks/TaskRefreshTrigger";
import { TaskManager } from "..";
import { CreateTaskTrigger } from "../utils/tasks/CreateTaskTrigger";
import { UpdateTaskTrigger } from "../utils/tasks/UpdateTaskTrigger";



//get tasks
export const GetTasks = async (req: Request, res: Response, next: NextFunction) => {
    let tasks = await Task.find().populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    res.status(200).json(tasks)
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
        start_date,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
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
    let tasks = await Task.find().populate('updated_by').populate('created_by').populate('frequency')
    tasks.forEach(async (task) => {
        CreateTaskTrigger(task)
    })
    return res.status(200).json({ message: "started successfully" })
}


export const StopTaskScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let tasks = await Task.find().populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    tasks.forEach(async (task) => {
        if (task) {
            if (task.refresh_trigger) {
                await TaskRefreshTrigger.findByIdAndDelete(task.refresh_trigger._id)
                if (TaskManager.exists(task.refresh_trigger.key))
                    TaskManager.deleteJob(task.refresh_trigger.key)
            }
            if (task.running_trigger) {
                await TaskTrigger.findByIdAndDelete(task.running_trigger._id)
                if (TaskManager.exists(task.running_trigger.key))
                    TaskManager.deleteJob(task.running_trigger.key)
            }
            await Task.findByIdAndUpdate(task._id, {
                next_run_date: null,
                next_refresh_date: null,
                refresh_trigger: null,
                running_trigger: null
            })

        }

    })
    return res.status(200).json({ message: "Scheduler Stopped Successfully" })
}

export const DeleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    let task = await Task.findById(id).populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    if (task) {
        if (task.refresh_trigger) {
            await TaskRefreshTrigger.findByIdAndDelete(task.refresh_trigger._id)
            if (TaskManager.exists(task.refresh_trigger.key))
                TaskManager.deleteJob(task.refresh_trigger.key)
        }
        if (task.running_trigger) {
            await TaskTrigger.findByIdAndDelete(task.running_trigger._id)
            if (TaskManager.exists(task.running_trigger.key))
                TaskManager.deleteJob(task.running_trigger.key)
        }
        if (task.frequency)
            await Frequency.findByIdAndDelete(task.frequency._id)
        await Task.findByIdAndDelete(id)
        return res.status(200).json({ message: "task deleted" })
    }
    return res.status(404).json({ message: "task not found" })

}


export const StopSingleTaskScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    let task = await Task.findById(id)
    if (task) {
        if (task.refresh_trigger) {
            await TaskRefreshTrigger.findByIdAndDelete(task.refresh_trigger._id)
            if (TaskManager.exists(task.refresh_trigger.key))
                TaskManager.deleteJob(task.refresh_trigger.key)
        }
        if (task.running_trigger) {
            await TaskTrigger.findByIdAndDelete(task.running_trigger._id)
            if (TaskManager.exists(task.running_trigger.key))
                TaskManager.deleteJob(task.running_trigger.key)
        }
        await Task.findByIdAndUpdate(task._id, {
            next_run_date: null,
            next_refresh_date: null,
            refresh_trigger: null,
            running_trigger: null
        })
        return res.status(200).json({ message: "Scheduler Stopped Successfully" })
    }
    else
        return res.status(200).json({ message: "task not found" })
}


// update task
export const UpdateTask = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    let task = await Task.findById(id).populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    if (!task)
        return res.status(404).json({ message: "task not found" })

    const { task_title, task_detail, person, phone, start_date, frequency } = req.body as TaskBody
    if (!task_title || !task_detail || !person || !phone || !start_date)
        return res.status(400).json({ message: "fill all the required fields" });
    if ((String(phone).trim().length != 12))
        return res.status(400).json({ message: "please provide valid mobile number" })
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({ message: "please provide valid date" })
    if (new Date(start_date) < new Date())
        return res.status(400).json({ message: `Select valid  date ,date could not be in the past` })
    await Task.findByIdAndUpdate({
        task_title,
        task_detail,
        person,
        phone,
        start_date,
        created_at: task.created_at,
        updated_at: task.updated_at,
        created_by: task.created_by,
        updated_by: task.updated_by
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

        await Frequency.findByIdAndUpdate(task.frequency._id, {
            type: frequency?.type,
            minutes: mf,
            hours: hf,
            days: df,
            months: monthf,
            weekdays: weekdays,
            monthdays: monthdays
        })
    }
    let updatedTask = await Task.findById(id).populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    if (updatedTask)
        UpdateTaskTrigger(updatedTask)
    if (!errorStatus)
        return res.status(201).json({ message: "task updated SuccessFully" })
}
