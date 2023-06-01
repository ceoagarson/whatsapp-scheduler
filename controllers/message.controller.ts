import { Request, NextFunction, Response } from "express";
import { MessageBody } from "../types/messages.type";
import Message from "../models/messages/Message";
import { isvalidDate } from "../utils/CheckValidDate";
import MessageTrigger from "../models/messages/MessageTrigger";
import MessageRefreshTrigger from "../models/messages/MessageRefreshTrigger";
import { MessageManager } from "..";
import { CreateMessageTrigger } from "../utils/messages/CreateMessageTrigger";
import { UpdateMessageTrigger } from "../utils/messages/UpdateMessageTrigger";
import { SortUniqueNumbers } from "../utils/SortUniqueNumbers";
import Frequency from "../models/Frequency";



//get messages
export const GetMessages = async (req: Request, res: Response, next: NextFunction) => {
    let messages = await Message.find().populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    res.status(200).json(messages)
}

//create new message
export const CreateMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { message_image, message_detail, person, phone, start_date, frequency } = req.body as MessageBody
    if (!message_image || !message_detail || !person || !phone || !start_date)
        return res.status(400).json({ message: "fill all the required fields" });
    if ((String(phone).trim().length != 12))
        return res.status(400).json({ message: "please provide valid mobile number" })
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({ message: "please provide valid date" })
    if (new Date(start_date) < new Date())
        return res.status(400).json({ message: `Select valid  date ,date could not be in the past` })
    let message = new Message({
        message_image,
        message_detail,
        person,
        phone,
        start_date,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    })

    if (frequency) {
        let ftype = frequency.frequencyType
        let freq = frequency.frequency
        if (ftype === "minutes" && freq && Number(freq) > 0) {
            if (Number(freq) < 0 || Number(freq) > 59)
                return res.status(400).json({ message: "choose minutes from 0-59" })
        }
        if (ftype === "hours" && freq && Number(freq) > 0) {
            if (Number(freq) < 0 || Number(freq) > 23)
                return res.status(400).json({ message: "choose hours from 0-23" })
        }
        if (ftype === "days" && freq && Number(freq) > 0) {
            if (Number(freq) < 1 || Number(freq) > 31)
                return res.status(400).json({ message: "choose days from 1-31" })
        }
        if (ftype === "months" && freq && Number(freq) > 0) {
            if (Number(freq) < 1 || Number(freq) > 12)
                return res.status(400).json({ message: "choose months from 1-12" })
        }
        if (ftype === "weekdays" && freq && freq.length > 0) {
            let tmpWeekdays = [1, 2, 3, 4, 5, 6, 7]
            let errorStatus = false
            freq.split(",").forEach((item) => {
                if (!tmpWeekdays.includes(Number(item)))
                    errorStatus = true
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select week days in correct format like : 1,2,3,4 from range (1-7), 1-mon,2-tue,3-wed,4-thu,5-fri,6-sat,7-sun" })
            tmpWeekdays = freq.split(",").map((item) => { return Number(item) })
            freq = SortUniqueNumbers(tmpWeekdays).toString()
        }

        if (ftype === "monthdays" && freq && freq.length > 0) {
            let errorStatus = false
            freq.split(",").forEach((item) => {
                if (Number(item) < 1 && item.length > 31)
                    errorStatus = true
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select month days in correct format like :1,2,3,4 from range (1-31)" })
        }
        let tmpMonthdays = freq.split(",").map((item) => { return Number(item) })
        freq = SortUniqueNumbers(tmpMonthdays).toString()
        let fq = new Frequency({
            type: frequency?.type,
            frequency: frequency.frequency,
            frequencyType: frequency.frequencyType
        })
        if (fq) {
            await fq.save()
            message.frequency = fq
        }
    }

    message = await message.save()
    return res.status(201).json({ message: message })
}

//start message scheduler
export const StartMessageScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let messages = await Message.find().populate('updated_by').populate('created_by').populate('frequency')
    messages.forEach(async (message) => {
        let date = new Date(message.start_date)
        if (date > new Date())
            CreateMessageTrigger(message)
    })
    return res.status(200).json({ message: "started successfully" })
}


export const StopMessageScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let messages = await Message.find().populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    messages.forEach(async (message) => {
        if (message) {
            await Message.findByIdAndUpdate(message._id, {
                autoStop: true,
                autoRefresh: false
            })
        }

    })
    return res.status(200).json({ message: "Scheduler Stopped Successfully" })
}

export const DeleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    let message = await Message.findById(id).populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    if (message) {
        if (message.refresh_trigger) {
            await MessageRefreshTrigger.findByIdAndDelete(message.refresh_trigger._id)
            if (MessageManager.exists(message.refresh_trigger.key))
                MessageManager.deleteJob(message.refresh_trigger.key)
        }
        if (message.running_trigger) {
            await MessageTrigger.findByIdAndDelete(message.running_trigger._id)
            if (MessageManager.exists(message.running_trigger.key))
                MessageManager.deleteJob(message.running_trigger.key)
        }
        if (message.frequency)
            await Frequency.findByIdAndDelete(message.frequency._id)
        await Message.findByIdAndDelete(id)
        return res.status(200).json({ message: "message deleted" })
    }
    return res.status(404).json({ message: "message not found" })

}


export const StopSingleMessageScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    let message = await Message.findById(id)
    if (message) {
        await Message.findByIdAndUpdate(message._id, {
            autoStop: true,
            autoRefresh:false
        })
        return res.status(200).json({ message: "Scheduler Stopped Successfully" })
    }
    else
        return res.status(200).json({ message: "message not found" })
}

export const StartSingleMessageScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    let message = await Message.findById(id)
    if (message) {
        let date = new Date(message.start_date)
        if (date > new Date())
            CreateMessageTrigger(message)
        return res.status(200).json({ message: "Scheduler Stopped Successfully" })
    }
    else
        return res.status(200).json({ message: "message not found" })
}

// update message

export const UpdateMessage = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id
    let message = await Message.findById(id).populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    if (!message)
        return res.status(404).json({ message: "message not found" })

    const { message_image, message_detail, person, phone, start_date, frequency } = req.body as MessageBody
    if (!message_image || !message_detail || !person || !phone || !start_date)
        return res.status(400).json({ message: "fill all the required fields" });
    if ((String(phone).trim().length != 12))
        return res.status(400).json({ message: "please provide valid mobile number" })
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({ message: "please provide valid date" })
    if (new Date(start_date) < new Date())
        return res.status(400).json({ message: `Select valid  date ,date could not be in the past` })
    await Message.findByIdAndUpdate(message._id, {
        message_image,
        message_detail,
        person,
        phone,
        start_date,
        created_at: message.created_at,
        updated_at: message.updated_at,
        created_by: message.created_by,
        updated_by: message.updated_by
    })

    if (frequency) {
        let ftype = frequency.frequencyType
        let freq = frequency.frequency
        if (ftype === "minutes" && freq && Number(freq) > 0) {
            if (Number(freq) < 0 || Number(freq) > 59)
                return res.status(400).json({ message: "choose minutes from 0-59" })
        }
        if (ftype === "hours" && freq && Number(freq) > 0) {
            if (Number(freq) < 0 || Number(freq) > 23)
                return res.status(400).json({ message: "choose hours from 0-23" })
        }
        if (ftype === "days" && freq && Number(freq) > 0) {
            if (Number(freq) < 1 || Number(freq) > 31)
                return res.status(400).json({ message: "choose days from 1-31" })
        }
        if (ftype === "months" && freq && Number(freq) > 0) {
            if (Number(freq) < 1 || Number(freq) > 12)
                return res.status(400).json({ message: "choose months from 1-12" })
        }
        if (ftype === "weekdays" && freq && freq.length > 0) {
            let tmpWeekdays = [1, 2, 3, 4, 5, 6, 7]
            let errorStatus = false
            freq.split(",").forEach((item) => {
                if (!tmpWeekdays.includes(Number(item)))
                    errorStatus = true
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select week days in correct format like : 1,2,3,4 from range (1-7), 1-mon,2-tue,3-wed,4-thu,5-fri,6-sat,7-sun" })
            tmpWeekdays = freq.split(",").map((item) => { return Number(item) })
            freq = SortUniqueNumbers(tmpWeekdays).toString()
        }

        if (ftype === "monthdays" && freq && freq.length > 0) {
            let errorStatus = false
            freq.split(",").forEach((item) => {
                if (Number(item) < 1 && item.length > 31)
                    errorStatus = true
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select month days in correct format like :1,2,3,4 from range (1-31)" })
            let tmpMonthdays = freq.split(",").map((item) => { return Number(item) })
            freq = SortUniqueNumbers(tmpMonthdays).toString()
        }
        if (message.frequency) {
            await Frequency.findByIdAndUpdate(message.frequency._id, {
                frequency: freq,
                frequencyType: ftype
            })
            let updatedMessage = await Message.findById(id).populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
            if (updatedMessage)
                UpdateMessageTrigger(updatedMessage)
            return res.status(200).json({ message: "message updated SuccessFully" })
        }

        else {
            let fq = new Frequency({
                type: frequency?.type,
                frequency: frequency.frequency,
                frequencyType: frequency.frequencyType
            })
            if (fq)
                await fq.save()
            message.frequency = fq
            message = await message.save()
            CreateMessageTrigger(message)
            return res.status(200).json({ message: "message updated SuccessFully" })
        }
    }
    else {
        return res.status(200).json({ message: "message updated SuccessFully" })
    }
}
