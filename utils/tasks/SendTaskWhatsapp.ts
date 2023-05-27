import cronParser from "cron-parser"
import Task from "../../models/tasks/Task"

export const SendTaskWhatsapp = async (job_id: string) => {
    let task = await Task.findById(job_id.split(",")[0]).populate('running_trigger')
    console.log(`whatsapp sent for ${task?.task_title}`)
    if (task && task.running_trigger) {
        await Task.findByIdAndUpdate(task._id, { next_run_date: cronParser.parseExpression(task.running_trigger.cronString).next().toDate() })
    }
}