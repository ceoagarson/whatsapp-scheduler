import { IFrequency } from "../types/task.type"

export const GetRunningDateCronString = (frequency: IFrequency, start_date: Date) => {
    let date = new Date(start_date)
    let ftype=frequency.frequencyType
    let freq=frequency.frequency
    let cronString = undefined
    if (ftype === "minutes" && freq && Number(freq) > 0) {
        cronString = "30 " + "0-59" + `/${freq}` + " * * * *"
    }
    if (ftype === "hours" && freq && Number(freq) > 0) {
        cronString = "30 " + `${date.getMinutes()}` + " 0/" + `${freq}` + " * * *"
    }
    if (ftype === "days" && freq && Number(freq) > 0) {
        cronString = "30 " + `${date.getMinutes()} ` + `${date.getHours()} ` + "1/" + `${freq}` + " *" + " *"
    }

    if (ftype === "months" && freq && Number(freq) > 0) {
        cronString = "30 " +  `${date.getMinutes()} ` + `${date.getHours()} ` + `${date.getDate()} ` + `${Number(freq) === 12 ? date.getMonth() : `1/${Number(freq)}`}` + " *"
    }

    if (ftype === "weekdays" && freq && freq.length > 0) {
        cronString = "30 " + `${date.getMinutes()} ` + `${date.getHours()} ` + " *" + " * " + freq
    }

    if (ftype === "monthdays" && freq && freq.length > 0) {
        cronString = "30 " + `${date.getMinutes()} ` + `${date.getHours()} ` + freq
            + " * " + "*"
    }

    return cronString
}
