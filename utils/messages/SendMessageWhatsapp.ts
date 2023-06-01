import cronParser from "cron-parser"
import Message from "../../models/messages/Message"
import axios from "axios"

export const SendMessageWhatsapp = async (task_id: string) => {
    let message = await Message.findById(task_id).populate('running_trigger')
    if (message) {
        if (message.run_once)
            await Message.findByIdAndUpdate(message._id, { run_once: false })
        if (!message?.autoStop) {
            try {
                let token = process.env.accessToken
                let phone_id = process.env.phone_id
                let url = `https://graph.facebook.com/v16.0/${phone_id}/messages`;
                let data = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": message.phone,
                    "type": "template",
                    "template": {
                        "name": "work_and_greetings",
                        "language": {
                            "code": "en_US"
                        },
                        "components": [
                            {
                                "type": "header",
                                "parameters": [
                                    {
                                        "type": "image",
                                        "image": { "link": message.message_image }
                                    }
                                ]
                            },
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": message.message_detail
                                    }
                                ]
                            }
                        ]
                    }
                }

                let config = {
                    url:url,
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    data:JSON.stringify(data)
                };

                let response: any = await axios.request(config)
                const { messages } = response.data
                if (messages.length > 0) {
                    await Message.findByIdAndUpdate(message._id, { message_id: messages[0].id })
                }
            }
            catch (err:any) {
                console.log(err.response)
            }
        }
        if (message && message.running_trigger) {
            await Message.findByIdAndUpdate(message._id, { next_run_date: cronParser.parseExpression(message.running_trigger.cronString).next().toDate() })
        }
    }

}
