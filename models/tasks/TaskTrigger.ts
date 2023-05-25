import mongoose from "mongoose";
import { ITaskTrigger } from "../../types/task.type";

const TaskTriggerSchema = new mongoose.Schema<ITaskTrigger, mongoose.Model<ITaskTrigger>>({
    key: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    status: {
        type: String,
        trim: true,
        lowercase: true,
    }
    ,
    cronString: {
        type: String,
        trim: true
    },
    created_at: Date,
    updated_at: Date,
    task:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    }
})
const TaskTrigger = mongoose.model<ITaskTrigger, mongoose.Model<ITaskTrigger>>("TaskTrigger", TaskTriggerSchema);

export default TaskTrigger;