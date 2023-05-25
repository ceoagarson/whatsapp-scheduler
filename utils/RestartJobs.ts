import Frequency from "../models/tasks/Frequency"
import Task from "../models/tasks/Task"
import TaskRefreshTrigger from "../models/tasks/TaskRefreshTrigger"
import TaskTrigger from "../models/tasks/TaskTrigger"
import { GetCronString } from "./GetCronString"
import { GetRefreshCronString } from "./GetRefreshCronString"

export async function RestartJobs() {
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
                    }
                }
            }
        }
    })
}