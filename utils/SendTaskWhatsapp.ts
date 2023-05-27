import Task from "../models/tasks/Task"
import cronParser from "cron-parser"

export const SendTaskWhatsapp = async (job_id: string) => {
    let task = await Task.findById(job_id.split(",")[0])
    if(task?.frequency&&task.next_run_date){
        await Task.findByIdAndUpdate(task._id, { next_run_date: cronParser.parseExpression(task.running_trigger.cronString).next().toDate() })
    }
    console.log(`whatsapp sent for ${task?.task_title}`)
}