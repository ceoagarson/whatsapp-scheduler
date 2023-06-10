import { TaskManager } from "../..";
import Frequency from "../../models/Frequency";
import Task from "../../models/tasks/Task";
import TaskRefreshTrigger from "../../models/tasks/TaskRefreshTrigger";
import TaskTrigger from "../../models/tasks/TaskTrigger";
import {  ITask } from "../../types/task.type";
import { GetRefreshDateCronString } from "../GetRefreshDateCronString";
import { GetRunningDateCronString } from "../GetRunningDateCronString";
import { RefreshTask } from "./RefreshTask";
import { SendTaskWhatsapp } from "./SendTaskWhatsapp";
import CronJobManager from "cron-job-manager";
import cronParser from "cron"

export  async function CreateTaskTrigger(task:ITask) {
    if (task.frequency) {
        let frequency = await Frequency.findById(task.frequency._id)
        if (frequency) {
            let runstring = GetRunningDateCronString(frequency, task.start_date)
            let refstring = GetRefreshDateCronString(frequency, task.start_date)

            if (!task.running_trigger && !task.refresh_trigger && task.frequency) {
                if (runstring) {
                    let running_trigger = new TaskTrigger({
                        key: task._id + "," + "run",
                        cronString: runstring,
                        created_at: new Date(),
                        updated_at: new Date(),
                        task: task
                    })
                    await running_trigger.save()
                    await Task.findByIdAndUpdate(task._id,
                        {
                            running_trigger: running_trigger, next_run_date: new Date(cronParser.sendAt(runstring).toJSDate()),
                            autoStop: false,
                            autoRefresh: true
                        }
                    )
                    if (running_trigger) {
                        TaskManager.add(running_trigger.key, runstring, () => { SendTaskWhatsapp(task._id) })
                        TaskManager.start(running_trigger.key)
                    }
                }
                if (refstring) {
                    let refresh_trigger = new TaskRefreshTrigger({
                        key: task._id + "," + "refresh",
                        cronString: refstring,
                        created_at: new Date(),
                        updated_at: new Date(),
                        task: task
                    })

                    await refresh_trigger.save()
                    await Task.findByIdAndUpdate(task._id,
                        {
                            refresh_trigger: refresh_trigger, next_refresh_date: new Date(cronParser.sendAt(refstring).toJSDate()),
                            autoStop:false,
                            autoRefresh:true
                        })

                    if (refresh_trigger) {
                        TaskManager.add(refresh_trigger.key, refstring, () => { RefreshTask(task._id) })
                        TaskManager.start(refresh_trigger.key)
                    }

                }
                
            }
            if (task.running_trigger && task.refresh_trigger && task.frequency){
                await Task.findByIdAndUpdate(task._id,
                    {
                        autoStop: false,
                        autoRefresh: true
                    }
                )
            }
        }
    }
    else{    
        TaskManager.add(task._id + "once", new Date(task.start_date), () => { SendTaskWhatsapp(task._id) })
        TaskManager.start(task._id + "once")
        await Task.findByIdAndUpdate(task._id, { run_once: true, autoStop: false })
    }
}