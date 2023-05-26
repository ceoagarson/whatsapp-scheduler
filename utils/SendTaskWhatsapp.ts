import { TaskManager } from ".."
import Task from "../models/tasks/Task"

export const SendTaskWhatsapp=async()=>{
    let tasks = await Task.find()
    console.log("sending whatsapp")
}