import { TaskManager } from ".."
import Frequency from "../models/Frequency"
import Task from "../models/tasks/Task"
import { GetCronString } from "./GetCronString"
import { GetRefreshCronString } from "./GetRefreshCronString"
import { RefreshTask } from "./RefreshTask"
import { SendTaskWhatsapp } from "./SendTaskWhatsapp"

export async function RestartJobs() {
    console.log(TaskManager)
    let tasks = await Task.find()
    tasks.forEach(async (task) => {
        if (task.frequency) {
            let frequency = await Frequency.findById(task.frequency._id)
            if (frequency) {
                let runstring = GetCronString(frequency, new Date(task.start_date))
                let refstring = GetRefreshCronString(frequency, new Date(task.start_date))
                if (task.run_trigger?.status === "running" && task.refresh_trigger?.status === "running") {
                    if (runstring && refstring) {
                        TaskManager.add(`${task.run_trigger._id}`, runstring, SendTaskWhatsapp)
                        TaskManager.add(`${task.refresh_trigger._id}`, refstring, RefreshTask)
                        TaskManager.start(`${task.run_trigger._id}`)
                        TaskManager.start(`${task.refresh_trigger._id}`)
                    }
                }
                if (task.frequency.once) {
                    let cronString = `${new Date(task.start_date).getMinutes()} ` + `${new Date(task.start_date).getHours()} ` + "1/" + `${1}` + " *" + " *"
                    if (cronString){
                        TaskManager.add(`${task._id}`, cronString, SendTaskWhatsapp)
                        TaskManager.start(`${task._id}`)
                    }
                }
            }
        }
    })

}