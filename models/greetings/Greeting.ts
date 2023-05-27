import mongoose from "mongoose";
import { IGreeting } from "../../types/greeting.type";

const GreetingSchema = new mongoose.Schema<IGreeting, mongoose.Model<IGreeting>>({
    greeting_title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    greeting_detail: {
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
    whatsapp_timestamp: Date, greeting_status: {
        type: String,
        trim: true,
        lowercase: true,
    },
    greeting_timestamp: Date,
    autoRefresh: {
        type: Boolean,
        default: true
    },
    autostop: {
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
        ref: 'GreetingTrigger'
    },
    refresh_trigger:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GreetingRefreshTrigger'
    },    
    start_date: {
        type:Date,
        required: true
    },
    next_run_date: Date,
    next_refresh_date: Date,
    created_at: Date,
    updated_at: Date
   
})
const Greeting = mongoose.model<IGreeting, mongoose.Model<IGreeting>>("Greeting", GreetingSchema);
export default Greeting;