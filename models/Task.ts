import mongoose from "mongoose";
import { ITask } from "../types/task.type";

const TaskSchema = new mongoose.Schema<ITask, mongoose.Model<ITask>>({
    task_title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    task_detail: {
        type: String,
        trim: true
    }
    ,
    task_status: {
        type: String,
        trim: true,
        lowercase: true,
    },
    person: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
        lowercase: true
    }
    ,
    whatsapp_status: {
        type: String,
        trim: true,
        lowercase: true,
    },
    autostop: {
        type: Boolean,
        default: false
    },
    autoRefresh:{
        type: Boolean,
        default: true
    },
    frequency:
    {
        minutes: Number,
        hours: Number,
        days: Number,
        weeks: Number,
        months: Number,
        weekdays: String,
        monthdays: String
    }
    ,
    trigger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskTrigger',
        required: true
    },
    start_date: Date,
    refresh_date: Date,
    created_at: Date,
    updated_at: Date,
    whatsapp_timestamp: Date,
    task_timestamp:Date,
   
})
const Task = mongoose.model<ITask, mongoose.Model<ITask>>("Task", TaskSchema);
export default Task;