import { TaskManager } from ".."
import Task from "../models/tasks/Task"
import { RefreshTask } from "./RefreshTask"
import { SendTaskWhatsapp } from "./SendTaskWhatsapp"

export async function RestartJobs() {
    let tasks = await Task.find().populate('frequency').populate('run_trigger').populate('refresh_trigger')
    tasks.forEach(async (task) => {
        let running_trigger = task.run_trigger
        let refresh_trigger = task.refresh_trigger
        let runsring = running_trigger?.cronString
        let refstring = refresh_trigger?.cronString
        if (running_trigger && runsring) {
            TaskManager.add(`${running_trigger._id}`, runsring, () => {
                if (running_trigger)
                    SendTaskWhatsapp(running_trigger._id)
            })
            TaskManager.start(`${running_trigger._id}`)
        }
        if (refresh_trigger && refstring) {
            TaskManager.add(`${refresh_trigger._id}`, refstring, () => {
                if (refresh_trigger)
                    RefreshTask(refresh_trigger?._id)
            })
            TaskManager.start(`${refresh_trigger._id}`)
        }
    })
}