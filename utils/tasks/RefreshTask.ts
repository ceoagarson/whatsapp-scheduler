import Task from "../../models/tasks/Task"
import cronParser from "cron-parser"

export const RefreshTask = async (task_id: string) => {
    let task = await Task.findById(task_id).populate('refresh_trigger')
    if(task){
        if (task.autoRefresh) {
            task.task_status = "pending"
            task.whatsapp_status=""
            task.autostop=false
            task.task_timestamp=new Date()
            task.whatsapp_timestamp=null
            await task.save()
        }
        if (task && task.refresh_trigger) {
            await Task.findByIdAndUpdate(task._id, { next_refresh_date: cronParser.parseExpression(task.refresh_trigger.cronString).next().toDate() })
        }
    }
    
}