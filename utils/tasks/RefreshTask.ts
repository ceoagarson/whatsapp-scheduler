import Task from "../../models/tasks/Task"
import cronParser from "cron-parser"

export const RefreshTask = async (job_id: string) => {
    let task = await Task.findById(job_id.split(",")[0]).populate('refresh_trigger')
    if (!task?.autoRefresh)
        console.log(`refreshing task for ${task?.task_title}`)
    if (task && task.refresh_trigger) {
        await Task.findByIdAndUpdate(task._id, { next_refresh_date: cronParser.parseExpression(task.refresh_trigger.cronString).next().toDate() })
    }
}