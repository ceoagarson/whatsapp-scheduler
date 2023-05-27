import { TaskManager } from "../.."
import Task from "../../models/tasks/Task"
import { RefreshTask } from "./RefreshTask"
import { SendTaskWhatsapp } from "./SendTaskWhatsapp"

export async function RestartTaskJobs() {
    let tasks = await Task.find().populate("running_trigger").populate('refresh_trigger')
    tasks.forEach(async (task) => {
        let running_trigger = task.running_trigger
        let refresh_trigger = task.refresh_trigger
        let runsring = running_trigger?.cronString
        let refstring = refresh_trigger?.cronString
        if (running_trigger && runsring) {
            TaskManager.add(running_trigger.key, runsring, () => {
                SendTaskWhatsapp(running_trigger.key)
            })
            TaskManager.start(running_trigger.key)
        }
        if (refresh_trigger && refstring) {
            TaskManager.add(refresh_trigger.key, refstring, () => {
                RefreshTask(refresh_trigger.key)
            })
            TaskManager.start(refresh_trigger.key)
        }
    })
}