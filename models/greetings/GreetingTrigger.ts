import mongoose from "mongoose";
import { IGreetingTrigger } from "../../types/greeting.type";

const GreetingTriggerSchema = new mongoose.Schema<IGreetingTrigger, mongoose.Model<IGreetingTrigger>>({
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
    created_at: Date,
    updated_at: Date,
    greeting:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Greeting',
        required: true
    }
})
const GreetingTrigger = mongoose.model<IGreetingTrigger, mongoose.Model<IGreetingTrigger>>("GreetingTrigger", GreetingTriggerSchema);

export default GreetingTrigger;