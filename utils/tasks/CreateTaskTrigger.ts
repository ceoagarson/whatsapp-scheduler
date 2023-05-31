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
import cronParser from "cron-parser";
import CronJobManager from "cron-job-manager";


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
                            running_trigger: running_trigger, next_run_date: cronParser.parseExpression(running_trigger.cronString).next().toDate(),
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
                            refresh_trigger: refresh_trigger, next_refresh_date: cronParser.parseExpression(refresh_trigger.cronString).next().toDate(),
                            autoStop:false,
                            autoRefresh:true
                        })

                    if (refresh_trigger) {
                        TaskManager.add(refresh_trigger.key, refstring, () => { RefreshTask(task._id) })
                        TaskManager.start(refresh_trigger.key)
                    }

                }
                
            }
        }
    }
    else{
        new CronJobManager('a one-timer', new Date(task.start_date), () => { SendTaskWhatsapp(task._id) }).start('a one-timer')
        await Task.findByIdAndUpdate(task._id, { run_once: true })
    }
}