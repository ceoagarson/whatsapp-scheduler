import { TaskManager } from ".."
import Task from "../models/tasks/Task"
import { RefreshTask } from "./RefreshTask"
import { SendTaskWhatsapp } from "./SendTaskWhatsapp"

export async function RestartJobs() {
    let tasks = await Task.find().populate('frequency').populate('run_trigger').populate('refresh_trigger')
    tasks.forEach(async (task) => {
        if(task.run_trigger&&task.refresh_trigger){
            TaskManager.add(`${task.run_trigger._id}`, task.run_trigger.cronString, SendTaskWhatsapp)
            TaskManager.add(`${task.refresh_trigger._id}`, task.refresh_trigger.cronString, RefreshTask)
            TaskManager.start(`${task.run_trigger._id}`)
            TaskManager.start(`${task.refresh_trigger._id}`)
        }
    })
}