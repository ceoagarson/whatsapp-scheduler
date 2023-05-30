import mongoose from "mongoose";
import { IFrequency } from "../types/task.type";

const FrequencySchema = new mongoose.Schema<IFrequency, mongoose.Model<IFrequency>>({
    type: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    frequency: String,
    frequencyType: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
})
const Frequency = mongoose.model<IFrequency, mongoose.Model<IFrequency>>("Frequency", FrequencySchema);
export default Frequency;