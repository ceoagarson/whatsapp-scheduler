import { Request, NextFunction, Response } from "express";
import Task from "../models/tasks/Task";
import axios from "axios"

export const ConnectWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
    let myToken = process.env.myToken
    let mode = req.query['hub.mode'];
    let challange = req.query["hub.challenge"];
    let token = req.query['hub.verify_token']
    if (mode && token) {
        if (mode === "subscribe" && token === myToken) {
            return res.send(challange)
        } else {
            return res.status(500).json({ message: "error whwile connecting meta whatsapp cloud api" })
        }
    }
    return res.status(500).json({ message: "server error" })
}

export const ResponseWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
    let token = process.env.accessToken
    if (!token) {
        return res.status(400).json({ message: "Please provide valid access token" })
    }
    const { entry } = req.body
    try {
        if (entry.length > 0 && token) {
            if (entry[0].changes[0].value.messages) {
                let type = entry[0].changes[0].value.messages[0].type
                let from = entry[0].changes[0].value.messages[0].from
                switch (type) {
                    case "button": {
                        let btnRes = entry[0].changes[0].value.messages[0].button.text
                        let timestamp = new Date(entry[0].changes[0].value.messages[0].timestamp * 1000)
                        let wamid = String(entry[0].changes[0].value.messages[0].context.id)
                        UpdateTaskStatus(wamid, btnRes, timestamp)
                        sendTextMessage(`Response Saved`, from, token)
                    }
                        break;
                    case "text": {
                        sendTextMessage(`Hi , We Got Your Message`, from, token)
                    }
                        break;
                    default: sendTextMessage(`failed to parse message `, from, token)
                }
            }
            if (entry[0].changes[0].value.statuses) {
                let status = String(entry[0].changes[0].value.statuses[0].status)
                let wamid = String(entry[0].changes[0].value.statuses[0].id)
                let timestamp = new Date(entry[0].changes[0].value.statuses[0].timestamp * 1000)
                UpdateTaskWhatsappStatus(wamid, status, timestamp)
            }
        }
    }
    catch (error: any) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
    return res.status(200).json({ message: "success" })
}

async function sendTextMessage(message: string, from: string, token: string) {
    
    let phone_id = process.env.phone_id
    let url = `https://graph.facebook.com/v16.0/${phone_id}/messages`;
    let data = {
        "messaging_product": "whatsapp",
        "to": from,
        "type": "text",
        "text": {
            "body": message
        }
    }
    let config = {
        url:url,
        method: "post",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    await axios(config).catch((err)=>console.log(err))
}

async function UpdateTaskStatus(wamid: string, btnRes: string, timestamp: Date) {
    let task = await Task.findOne({ message_id: wamid })
    if (task) {
        if (btnRes.toLowerCase() === "done") {
            task.autostop = true
        }
        task.task_status = btnRes.toLowerCase()
        task.task_timestamp = new Date(timestamp)
        await task.save()
    }

}

async function UpdateTaskWhatsappStatus(wamid: string, status: string, timestamp: Date) {
    let task = await Task.findOne({ message_id: wamid })
    if (task) {
        task.whatsapp_status = status
        task.whatsapp_timestamp = new Date(timestamp)
        await task.save()
    }

}