import mongoose from "mongoose";
import { IMessage } from "../../types/messages.type";

const MessageSchema = new mongoose.Schema<IMessage, mongoose.Model<IMessage>>({
    message_image: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    message_detail: {
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
    whatsapp_timestamp: Date, message_status: {
        type: String,
        trim: true,
        lowercase: true,
    },
    message_timestamp: Date,
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
        ref: 'MessageTrigger'
    },
    refresh_trigger:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MessageRefreshTrigger'
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
    },
   
})
const Message = mongoose.model<IMessage, mongoose.Model<IMessage>>("Message", MessageSchema);
export default Message;