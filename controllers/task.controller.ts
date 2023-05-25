import { Request, NextFunction, Response } from "express";
import { TaskBody } from "../types/task.type";
import Task from "../models/tasks/Task";
import { GetCronSTring } from "../utils/GetCronSTring";

export const GetTasks =async(req:Request,res:Response,next:NextFunction)=>{
    let tasks=await Task.find()
    res.status(200).json({ tasks: tasks })
}

export const CreateTask = async(req: Request, res: Response, next: NextFunction)=>{
    const { task_title, task_detail, person, phone, frequency } = req.body as TaskBody
    let task = new Task({
        task_title,
        task_detail,
        person,
        phone,
        frequency
    })
    task = await task.save()
    let time = GetCronSTring(task, res)
    return res.status(201).json({ time: time,task:task })
}