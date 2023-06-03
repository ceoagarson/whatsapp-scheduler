import Task from "../../models/tasks/Task"
import cronParser from "cron"

export const RefreshTask = async (task_id: string) => {
    let task = await Task.findById(task_id).populate('refresh_trigger')
    if (task) {
        if (task.autoRefresh) {
            await Task.findByIdAndUpdate(task._id, {
                task_status: "pending",
                whatsapp_status: "",
                autoStop: false,
                task_timestamp: new Date(),
                whatsapp_timestamp: null
            })
        }
        if (task && task.refresh_trigger) {
            await Task.findByIdAndUpdate(task._id, { next_refresh_date: new Date(cronParser.sendAt(task.refresh_trigger.cronString).toJSDate()) })
        }
    }

}