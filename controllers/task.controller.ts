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
import { SortUniqueNumbers } from "../utils/SortUniqueNumbers";



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

    if (frequency) {
        let ftype = frequency.frequencyType
        let freq = frequency.frequency
        if (ftype === "minutes" && freq && Number(freq) > 0) {
            if (Number(freq) < 0 || Number(freq) > 59)
                return res.status(400).json({ message: "choose minutes from 0-59" })
        }
        if (ftype === "hours" && freq && Number(freq) > 0) {
            if (Number(freq) < 0 || Number(freq) > 23)
                return res.status(400).json({ message: "choose hours from 0-23" })
        }
        if (ftype === "days" && freq && Number(freq) > 0) {
            if (Number(freq) < 1 || Number(freq) > 31)
                return res.status(400).json({ message: "choose days from 1-31" })
        }
        if (ftype === "months" && freq && Number(freq) > 0) {
            if (Number(freq) < 1 || Number(freq) > 12)
                return res.status(400).json({ message: "choose months from 1-12" })
        }
        if (ftype === "weekdays" && freq && freq.length > 0) {
            let tmpWeekdays = [1, 2, 3, 4, 5, 6, 7]
            let errorStatus = false
            freq.split(",").forEach((item) => {
                if (!tmpWeekdays.includes(Number(item)))
                    errorStatus = true
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select week days in correct format like : 1,2,3,4 from range (1-7), 1-mon,2-tue,3-wed,4-thu,5-fri,6-sat,7-sun" })
            tmpWeekdays = freq.split(",").map((item) =>{return Number(item)})
            freq = SortUniqueNumbers(tmpWeekdays).toString()
        }

        if (ftype === "monthdays" && freq && freq.length > 0) {
            let errorStatus = false
            freq.split(",").forEach((item) => {
                if (Number(item) < 1 && item.length > 31)
                    errorStatus = true
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select month days in correct format like :1,2,3,4 from range (1-31)" })
        }
        let tmpMonthdays = freq.split(",").map((item) => { return Number(item) })
        freq = SortUniqueNumbers(tmpMonthdays).toString()
    }
    let fq = new Frequency({
        type: frequency?.type,
        frequency: frequency.frequency,
        frequencyType: frequency.frequencyType
    })
    if (fq)
        await fq.save()
    task.frequency = fq
    task = await task.save()
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
        let ftype = frequency.frequencyType
        let freq = frequency.frequency
        if (ftype === "minutes" && freq && Number(freq) > 0) {
            if (Number(freq) < 0 || Number(freq) > 59)
                return res.status(400).json({ message: "choose minutes from 0-59" })
        }
        if (ftype === "hours" && freq && Number(freq) > 0) {
            if (Number(freq) < 0 || Number(freq) > 23)
                return res.status(400).json({ message: "choose hours from 0-23" })
        }
        if (ftype === "days" && freq && Number(freq) > 0) {
            if (Number(freq) < 1 || Number(freq) > 31)
                return res.status(400).json({ message: "choose days from 1-31" })
        }
        if (ftype === "months" && freq && Number(freq) > 0) {
            if (Number(freq) < 1 || Number(freq) > 12)
                return res.status(400).json({ message: "choose months from 1-12" })
        }
        if (ftype === "weekdays" && freq && freq.length > 0) {
            let tmpWeekdays = [1, 2, 3, 4, 5, 6, 7]
            let errorStatus = false
            freq.split(",").forEach((item) => {
                if (!tmpWeekdays.includes(Number(item)))
                    errorStatus = true
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select week days in correct format like : 1,2,3,4 from range (1-7), 1-mon,2-tue,3-wed,4-thu,5-fri,6-sat,7-sun" })
            tmpWeekdays = freq.split(",").map((item) => { return Number(item) })
            freq = SortUniqueNumbers(tmpWeekdays).toString()
        }

        if (ftype === "monthdays" && freq && freq.length > 0) {
            let errorStatus = false
            freq.split(",").forEach((item) => {
                if (Number(item) < 1 && item.length > 31)
                    errorStatus = true
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select month days in correct format like :1,2,3,4 from range (1-31)" })
            let tmpMonthdays = freq.split(",").map((item) => { return Number(item) })
            freq = SortUniqueNumbers(tmpMonthdays).toString()
        }
        await Frequency.findByIdAndUpdate(task.frequency._id, {
            frequency: freq,
            frequencyType: ftype
        })
    }
    let updatedTask = await Task.findById(id).populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    if (updatedTask)
        UpdateTaskTrigger(updatedTask)
    if (!errorStatus)
        return res.status(201).json({ message: "task updated SuccessFully" })
}
