import mongoose from "mongoose";
import { ITaskRefreshTrigger } from "../../types/task.type";

const TaskRefreshTriggerSchema = new mongoose.Schema<ITaskRefreshTrigger, mongoose.Model<ITaskRefreshTrigger>>({
    key: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    }
    ,
    cronString: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,
    },
    task:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    }
})
const TaskRefreshTrigger = mongoose.model<ITaskRefreshTrigger, mongoose.Model<ITaskRefreshTrigger>>("TaskRefreshTrigger", TaskRefreshTriggerSchema);

export default TaskRefreshTrigger;