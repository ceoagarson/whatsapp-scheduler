import { GreetingManager } from "../.."
import Greeting from "../../models/greetings/Greeting"
import { RefreshGreeting } from "./RefreshGreeting"
import { SendGreetingWhatsapp } from "./SendGreetingWhatsapp"

export async function RestartGreetingJobs() {
    let greetings = await Greeting.find().populate("running_trigger").populate('refresh_trigger')
    greetings.forEach(async (greeting) => {
        let running_trigger = greeting.running_trigger
        let refresh_trigger = greeting.refresh_trigger
        let runsring = running_trigger?.cronString
        let refstring = refresh_trigger?.cronString
        if (running_trigger && runsring) {
            GreetingManager.add(running_trigger.key, runsring, () => {
                SendGreetingWhatsapp(running_trigger.key)
            })
            GreetingManager.start(running_trigger.key)
        }
        if (refresh_trigger && refstring) {
            GreetingManager.add(refresh_trigger.key, refstring, () => {
                RefreshGreeting(refresh_trigger.key)
            })
            GreetingManager.start(refresh_trigger.key)
        }
    })
}