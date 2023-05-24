import { Request, NextFunction, Response } from "express";
import CronJobManager from "cron-job-manager";
import { SendWhatsappTask } from "../utils/TaskScheduler";

export const TaskManager = new CronJobManager()

export const Index = (req: Request, res: Response, next: NextFunction) => {
    TaskManager.add("job1", '15 * * * * *', SendWhatsappTask)
    TaskManager.add("job2", '15 * * * * *', SendWhatsappTask)
    res.send("task added")
}

export const StartJob = (req: Request, res: Response, next: NextFunction) => {
    TaskManager.start('job1')
    res.send("task started")

}

export const StopJob = (req: Request, res: Response, next: NextFunction) => {
    TaskManager.stop('job1')
    res.send("stopped task")

}

export const UpdateJob = (req: Request, res: Response, next: NextFunction) => {
    TaskManager.update('job1', '0/1 * * * *')
    res.send("task updated for every seconds")

}

export const DeleteJob = (req: Request, res: Response, next: NextFunction) => {
    let jobs = TaskManager.listCrons()
    console.log(jobs)
    if (TaskManager.exists('job1')) {
        TaskManager.deleteJob('job11')
        return res.send("selected job deleted")
    }
    res.send("selected job not found")
}

