import mongoose from "mongoose";
import { IFrequency } from "../../types/task.type";

const FrequencySchema = new mongoose.Schema<IFrequency, mongoose.Model<IFrequency>>({
    type: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    minutes: Number,
    hours: Number,
    days: Number,
    weeks: Number,
    months: Number,
    weekdays: String,
    monthdays: String
})
const Frequency = mongoose.model<IFrequency, mongoose.Model<IFrequency>>("Frequency", FrequencySchema);
export default Frequency;