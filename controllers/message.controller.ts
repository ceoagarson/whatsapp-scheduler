import { Request, NextFunction, Response } from "express";
import { MessageBody } from "../types/messages.type";
import Message from "../models/messages/Message";
import Frequency from "../models/Frequency";
import { isvalidDate } from "../utils/CheckValidDate";
import MessageTrigger from "../models/messages/MessageTrigger";
import MessageRefreshTrigger from "../models/messages/MessageRefreshTrigger";
import { MessageManager } from "..";
import { CreateMessageTrigger } from "../utils/messages/CreateMessageTrigger";
import { UpdateMessageTrigger } from "../utils/messages/UpdateMessageTrigger";
import { SortUniqueNumbers } from "../utils/SortUniqueNumbers";



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

    let errorStatus = false

    if (frequency) {
        let mf = frequency.minutes
        let hf = frequency.hours
        let df = frequency.days
        let monthf = frequency.months
        let weekdays = frequency.weekdays
        let monthdays = frequency.monthdays
        if (!mf) mf = 0
        if (!hf) hf = 0
        if (!df) df = 0
        if (!monthf) monthf = 0
        let TmpArr = [mf, hf, df, monthf]
        let count = 0
        TmpArr.forEach((item) => {
            if (item > 0) {
                count++;
            }
        });
        if (weekdays)
            count++
        if (monthdays)
            count++
        if (count > 1)
            return res.status(400).json({ message: "Select one from minuts,hours,days,weeks,months,weekday and monthday" })
        let tmpWeekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        if (weekdays && weekdays.length > 0) {
            weekdays.split(",").forEach((item) => {
                if (!tmpWeekdays.includes(item.toLowerCase())) {
                    errorStatus = true

                }
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select week days in correct format" })
            let numWeeks: number[] = []
            weekdays.split(',').forEach((wd) => {
                if (wd === "mon")
                    numWeeks.push(1)
                if (wd === "tue")
                    numWeeks.push(2)
                if (wd === "wed")
                    numWeeks.push(3)
                if (wd === "thu")
                    numWeeks.push(4)
                if (wd === "fri")
                    numWeeks.push(5)
                if (wd === "sat")
                    numWeeks.push(6)
                if (wd === "sun")
                    numWeeks.push(7)
            })
            weekdays = SortUniqueNumbers(numWeeks).toString()
        }
        if (monthdays && monthdays.length > 0) {
            monthdays.split(",").forEach((item) => {
                if (Number(item) < 10 && item.length > 1) {
                    errorStatus = true

                }

                if (Number(item) === 0 || item.length > 2 || Number(item) > 31) {
                    errorStatus = true
                }
            })
            if (errorStatus) {
                return res.status(400).json({ message: `Select month days in correct format` })
            }
        }

        let fq = new Frequency({
            type: frequency?.type,
            minutes: mf,
            hours: hf,
            days: df,
            months: monthf,
            weekdays: weekdays,
            monthdays: monthdays
        })
        if (fq)
            await fq.save()
        message.frequency = fq
    }
    message = await message.save()
    if (!errorStatus)
        return res.status(201).json({ message: message })
}

//start message scheduler
export const StartMessageScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let messages = await Message.find().populate('updated_by').populate('created_by').populate('frequency')
    messages.forEach(async (message) => {
        CreateMessageTrigger(message)
    })
    return res.status(200).json({ message: "started successfully" })
}


export const StopMessageScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let messages = await Message.find().populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    messages.forEach(async (message) => {
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
            await Message.findByIdAndUpdate(message._id, {
                next_run_date: null,
                next_refresh_date: null,
                refresh_trigger: null,
                running_trigger: null
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
        await Message.findByIdAndUpdate(message._id, {
            next_run_date: null,
            next_refresh_date: null,
            refresh_trigger: null,
            running_trigger: null
        })
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
    await Message.findByIdAndUpdate({
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
    let errorStatus = false

    if (frequency) {
        let mf = frequency.minutes
        let hf = frequency.hours
        let df = frequency.days
        let monthf = frequency.months
        let weekdays = frequency.weekdays
        let monthdays = frequency.monthdays
        if (!mf) mf = 0
        if (!hf) hf = 0
        if (!df) df = 0
        if (!monthf) monthf = 0
        let TmpArr = [mf, hf, df, monthf]
        let count = 0
        TmpArr.forEach((item) => {
            if (item > 0) {
                count++;
            }
        });
        if (weekdays)
            count++
        if (monthdays)
            count++
        if (count > 1)
            return res.status(400).json({ message: "Select one from minuts,hours,days,weeks,months,weekday and monthday" })
        let tmpWeekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        if (weekdays && weekdays.length > 0) {
            weekdays.split(",").forEach((item) => {
                if (!tmpWeekdays.includes(item.toLowerCase())) {
                    errorStatus = true

                }
            })
            if (errorStatus)
                return res.status(400).json({ message: "Select week days in correct format" })
            let numWeeks = weekdays.split(',').map((wd) => {
                if (wd === "mon")
                    return '1'
                if (wd === "tue")
                    return '2'
                if (wd === "wed")
                    return '3'
                if (wd === "thu")
                    return '4'
                if (wd === "fri")
                    return '5'
                if (wd === "sat")
                    return '6'
                if (wd === "sun")
                    return '7'

            })
            weekdays = numWeeks.toString()
        }
        if (monthdays && monthdays.length > 0) {
            monthdays.split(",").forEach((item) => {
                if (Number(item) < 10 && item.length > 1) {
                    errorStatus = true

                }

                if (Number(item) === 0 || item.length > 2 || Number(item) > 31) {
                    errorStatus = true
                }
            })
            if (errorStatus) {
                return res.status(400).json({ message: `Select month days in correct format` })
            }
        }

        await Frequency.findByIdAndUpdate(message.frequency._id, {
            type: frequency?.type,
            minutes: mf,
            hours: hf,
            days: df,
            months: monthf,
            weekdays: weekdays,
            monthdays: monthdays
        })
    }
    let updatedMessage = await Message.findById(id).populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    if (updatedMessage)
        UpdateMessageTrigger(updatedMessage)
    if (!errorStatus)
        return res.status(201).json({ message: "message updated SuccessFully" })
}
