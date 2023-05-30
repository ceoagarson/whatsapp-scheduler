import Task from "../../models/tasks/Task"
import cronParser from "cron-parser"

export const RefreshTask = async (job_id: string) => {
    let task = await Task.findById(job_id.split(",")[0]).populate('refresh_trigger')
    if(task){
        if (!task.autoRefresh) {
            task.task_status = "pending"
            task.whatsapp_status=""
            task.autostop=true
            task.task_timestamp=null
            task.whatsapp_timestamp=null
            await task.save()
        }
        if (task && task.refresh_trigger) {
            await Task.findByIdAndUpdate(task._id, { next_refresh_date: cronParser.parseExpression(task.refresh_trigger.cronString).next().toDate() })
        }
    }
    
}