import mongoose from "mongoose";
import { IMessageRefreshTrigger } from "../../types/messages.type";

const MessageRefreshTriggerSchema = new mongoose.Schema<IMessageRefreshTrigger, mongoose.Model<IMessageRefreshTrigger>>({
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
    message:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }
})
const MessageRefreshTrigger = mongoose.model<IMessageRefreshTrigger, mongoose.Model<IMessageRefreshTrigger>>("MessageRefreshTrigger", MessageRefreshTriggerSchema);

export default MessageRefreshTrigger;