import mongoose from "mongoose";
import { IGreetingRefreshTrigger } from "../../types/greeting.type";

const GreetingRefreshTriggerSchema = new mongoose.Schema<IGreetingRefreshTrigger, mongoose.Model<IGreetingRefreshTrigger>>({
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
    greeting:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Greeting',
        required: true
    }
})
const GreetingRefreshTrigger = mongoose.model<IGreetingRefreshTrigger, mongoose.Model<IGreetingRefreshTrigger>>("GreetingRefreshTrigger", GreetingRefreshTriggerSchema);

export default GreetingRefreshTrigger;