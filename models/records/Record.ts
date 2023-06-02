import mongoose from "mongoose";
import { IRecord } from "../../types/Record";

const RecordSchema = new mongoose.Schema<IRecord, mongoose.Model<IRecord>>({
    phone: {
        type: Number,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    timestamp: Date
})
const Record = mongoose.model<IRecord, mongoose.Model<IRecord>>("Record", RecordSchema);
export default Record;