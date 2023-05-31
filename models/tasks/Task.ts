import mongoose from "mongoose";
import { ITask } from "../../types/task.type";

const TaskSchema = new mongoose.Schema<ITask, mongoose.Model<ITask>>({
    task_title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    task_detail: {
        type: String,
        required: true,
        trim: true
    }
    ,
    person: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    whatsapp_status: {
        type: String,
        trim: true,
        lowercase: true,
    },
    whatsapp_timestamp: Date,
     task_status: {
        type: String,
        trim: true,
        lowercase: true,
    },
    
    task_timestamp: Date,
    autoRefresh: {
        type: Boolean,
        default: true
    },
    autoStop: {
        type: Boolean,
        default: false
    },
    run_once: {
        type: Boolean,
        default: false
    },
    frequency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Frequency'
    }
    ,
    running_trigger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskTrigger'
    },
    refresh_trigger:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskRefreshTrigger'
    },    
    start_date: {
        type:Date,
        required: true
    },
    next_run_date: Date,
    next_refresh_date: Date,
    created_at: Date,
    updated_at: Date,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
const Task = mongoose.model<ITask, mongoose.Model<ITask>>("Task", TaskSchema);
export default Task;