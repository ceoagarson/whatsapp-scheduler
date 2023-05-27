import { Request, NextFunction, Response } from "express";
import { GreetingBody } from "../types/greeting.type";
import Greeting from "../models/greetings/Greeting";
import Frequency from "../models/Frequency";
import { isvalidDate } from "../utils/CheckValidDate";
import { GetRunningDateCronString } from "../utils/GetRunningDateCronString";
import { GetRefreshDateCronString } from "../utils/GetRefreshDateCronString";
import GreetingTrigger from "../models/greetings/GreetingTrigger";
import GreetingRefreshTrigger from "../models/greetings/GreetingRefreshTrigger";
import { GreetingManager } from "..";
import cronParser from "cron-parser";
import { SendGreetingWhatsapp } from "../utils/greetings/SendGreetingWhatsapp";
import { RefreshGreeting } from "../utils/greetings/RefreshGreeting";


//get greetings
export const GetGreetings = async (req: Request, res: Response, next: NextFunction) => {
    let greetings = await Greeting.find()
    res.status(200).json({ greetings: greetings })
}

//create new greeting
export const CreateGreeting = async (req: Request, res: Response, next: NextFunction) => {
    const { greeting_image, greeting_detail, person, phone, start_date, frequency } = req.body as GreetingBody
    if (!greeting_image || !greeting_detail || !person || !phone || !start_date)
        return res.status(400).json({ message: "fill all the required fields" });
    if ((String(phone).trim().length != 12))
        return res.status(400).json({ message: "please provide valid mobile number" })
    if (!isvalidDate(new Date(start_date)))
        return res.status(400).json({ message: "please provide valid date" })
    if (new Date(start_date) < new Date())
        return res.status(400).json({ message: `Select valid  date ,date could not be in the past` })

    let greeting = new Greeting({
        greeting_image,
        greeting_detail,
        person,
        phone,
        start_date
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
        greeting.frequency = fq
    }

    greeting = await greeting.save()
    if (!errorStatus)
        return res.status(201).json({ greeting: greeting })
}

//start greeting scheduler
export const StartGreetingScheduler = async (req: Request, res: Response, next: NextFunction) => {
    let greetings = await Greeting.find()
    greetings.forEach(async (greeting) => {
        if (greeting.frequency) {
            let frequency = await Frequency.findById(greeting.frequency._id)
            if (frequency) {
                let runstring = GetRunningDateCronString(frequency, greeting.start_date)
                let refstring = GetRefreshDateCronString(frequency, greeting.start_date)

                if (!greeting.running_trigger && !greeting.refresh_trigger && greeting.frequency) {
                    if (runstring) {
                        let running_trigger = new GreetingTrigger({
                            key: greeting._id + "," + "run",
                            status: "running",
                            cronString: runstring,
                            created_at: new Date(),
                            updated_at: new Date(),
                            greeting: greeting
                        })
                        await running_trigger.save()
                        await Greeting.findByIdAndUpdate(greeting._id,
                            {
                                running_trigger: running_trigger, next_run_date: cronParser.parseExpression(running_trigger.cronString).next().toDate()
                            }
                        )
                        if (running_trigger) {
                            GreetingManager.add(running_trigger.key, runstring, () => { SendGreetingWhatsapp(running_trigger.key) })
                            GreetingManager.start(running_trigger.key)
                        }
                    }
                    if (refstring) {
                        let refresh_trigger = new GreetingRefreshTrigger({
                            key: greeting._id + "," + "refresh",
                            status: "running",
                            cronString: refstring,
                            created_at: new Date(),
                            updated_at: new Date(),
                            greeting: greeting
                        })

                        await refresh_trigger.save()
                        await Greeting.findByIdAndUpdate(greeting._id,
                            {
                                refresh_trigger: refresh_trigger, next_refresh_date: cronParser.parseExpression(refresh_trigger.cronString).next().toDate()
                            })

                        if (refresh_trigger) {
                            GreetingManager.add(refresh_trigger.key, refstring, () => { RefreshGreeting(refresh_trigger.key) })
                            GreetingManager.start(refresh_trigger.key)
                        }

                    }
                }
            }
        }

    })

    return res.status(200).json({ message: "started successfully" })
}


export const DeleteGreeting = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    let greeting = await Greeting.findById(id).populate('refresh_trigger').populate('running_trigger')

    if (greeting) {
        if (greeting.refresh_trigger) {
            await GreetingRefreshTrigger.findByIdAndDelete(greeting.refresh_trigger._id)
            if (GreetingManager.exists(greeting.refresh_trigger.key))
                GreetingManager.deleteJob(greeting.refresh_trigger.key)
        }
        if (greeting.running_trigger) {
            await GreetingTrigger.findByIdAndDelete(greeting.running_trigger._id)
            if (GreetingManager.exists(greeting.running_trigger.key))
                GreetingManager.deleteJob(greeting.running_trigger.key)
        }
        if (greeting.frequency)
            await Frequency.findByIdAndDelete(greeting.frequency._id)
        await Greeting.findByIdAndDelete(id)
        return res.status(200).json({ message: "greeting deleted" })
    }
    return res.status(404).json({ message: "greeting not found" })

}
