import { TaskManager } from "../..";
import Frequency from "../../models/Frequency";
import Task from "../../models/tasks/Task";
import TaskRefreshTrigger from "../../models/tasks/TaskRefreshTrigger";
import TaskTrigger from "../../models/tasks/TaskTrigger";
import { ITask } from "../../types/task.type";
import { GetRefreshDateCronString } from "../GetRefreshDateCronString";
import { GetRunningDateCronString } from "../GetRunningDateCronString";
import { RefreshTask } from "./RefreshTask";
import { SendTaskWhatsapp } from "./SendTaskWhatsapp";
import cronParser from "cron";


export async function UpdateTaskTrigger(task: ITask) {
    if (task.frequency) {
        let frequency = await Frequency.findById(task.frequency._id)
        if (frequency) {
            let runstring = GetRunningDateCronString(frequency, task.start_date)
            let refstring = GetRefreshDateCronString(frequency, task.start_date)
            if (task.running_trigger && task.refresh_trigger && task.frequency) {
                if (runstring) {
                    await TaskTrigger.findByIdAndUpdate(task.running_trigger._id, {
                        cronString: runstring,
                        updated_at: new Date()
                    })
                    if (TaskManager.exists(task.running_trigger.key)) {
                        TaskManager.update(task.running_trigger.key, runstring, () => { SendTaskWhatsapp(task._id) })
                    }
                    await Task.findByIdAndUpdate(task._id,
                        {
                            next_run_date: new Date(cronParser.sendAt(runstring).toJSDate())
                        }
                    )
                }

                if (refstring) {
                    await TaskRefreshTrigger.findByIdAndUpdate(task.refresh_trigger._id, {
                        cronString: refstring,
                        updated_at: new Date()
                    })
                    if (TaskManager.exists(task.refresh_trigger.key)) {
                        TaskManager.update(task.refresh_trigger.key, refstring, () => { RefreshTask(task._id) })
                    }
                    await Task.findByIdAndUpdate(task._id,
                        {
                            next_refresh_date: new Date(cronParser.sendAt(refstring).toJSDate())
                        }
                    )
                }
                if(task.run_once){
                    if (TaskManager.exists(task._id + "once")) {
                        TaskManager.update(task._id + "once", new Date(task.start_date), () => { SendTaskWhatsapp(task._id) })
                    }
                }
            }
        }
    }
}
