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
import cronParser from "cron-parser";


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
                            next_run_date: cronParser.parseExpression(runstring).next().toDate()
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
                            next_refresh_date: cronParser.parseExpression(refstring).next().toDate()
                        }
                    )
                }
            }
        }
    }
}