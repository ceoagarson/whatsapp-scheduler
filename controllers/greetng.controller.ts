import { Request, NextFunction, Response } from "express";
import { MessageBody } from "../types/messages.type";
import Message from "../models/messages/Message";
import Frequency from "../models/Frequency";
import { isvalidDate } from "../utils/CheckValidDate";
import { GetRunningDateCronString } from "../utils/GetRunningDateCronString";
import { GetRefreshDateCronString } from "../utils/GetRefreshDateCronString";
import MessageTrigger from "../models/messages/MessageTrigger";
import MessageRefreshTrigger from "../models/messages/MessageRefreshTrigger";
import { MessageManager } from "..";
import cronParser from "cron-parser";
import { SendMessageWhatsapp } from "../utils/messages/SendMessageWhatsapp";
import { RefreshMessage } from "../utils/messages/RefreshMessage";


//get messages
export const GetMessages = async (req: Request, res: Response, next: NextFunction) => {
    let messages = await Message.find().populate('updated_by').populate('created_by').populate('refresh_trigger').populate('running_trigger').populate('frequency')
    res.status(200).json( messages)
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
    let messages = await Message.find()
    messages.forEach(async (message) => {
        if (message.frequency) {
            let frequency = await Frequency.findById(message.frequency._id)
            if (frequency) {
                let runstring = GetRunningDateCronString(frequency, message.start_date)
                let refstring = GetRefreshDateCronString(frequency, message.start_date)

                if (!message.running_trigger && !message.refresh_trigger && message.frequency) {
                    if (runstring) {
                        let running_trigger = new MessageTrigger({
                            key: message._id + "," + "run",
                            status: "running",
                            cronString: runstring,
                            created_at: new Date(),
                            updated_at: new Date(),
                            message: message
                        })
                        await running_trigger.save()
                        await Message.findByIdAndUpdate(message._id,
                            {
                                running_trigger: running_trigger, next_run_date: cronParser.parseExpression(running_trigger.cronString).next().toDate()
                            }
                        )
                        if (running_trigger) {
                            MessageManager.add(running_trigger.key, runstring, () => { SendMessageWhatsapp(running_trigger.key) })
                            MessageManager.start(running_trigger.key)
                        }
                    }
                    if (refstring) {
                        let refresh_trigger = new MessageRefreshTrigger({
                            key: message._id + "," + "refresh",
                            status: "running",
                            cronString: refstring,
                            created_at: new Date(),
                            updated_at: new Date(),
                            message: message
                        })

                        await refresh_trigger.save()
                        await Message.findByIdAndUpdate(message._id,
                            {
                                refresh_trigger: refresh_trigger, next_refresh_date: cronParser.parseExpression(refresh_trigger.cronString).next().toDate()
                            })

                        if (refresh_trigger) {
                            MessageManager.add(refresh_trigger.key, refstring, () => { RefreshMessage(refresh_trigger.key) })
                            MessageManager.start(refresh_trigger.key)
                        }

                    }
                }
            }
        }

    })

    return res.status(200).json({ message: "started successfully" })
}


export const DeleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    let message = await Message.findById(id).populate('refresh_trigger').populate('running_trigger')

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
