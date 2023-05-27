import { IFrequency } from "../types/task.type"

export const GetRefreshDateCronString = (frequency: IFrequency, start_date:Date) => {
    let date=new Date(start_date)
    let mf =frequency?.minutes
    let hf =frequency?.hours
    let df =frequency?.days
    let monthf =frequency?.months
    let weekdays =frequency?.weekdays
    let monthdays =frequency?.monthdays
  
    let cronString =undefined
    if (mf&&mf > 0) {
        cronString =  `0-59/${mf}` + " * * * *"
    }
    if (hf&&hf > 0) {
        cronString = `${date.getMinutes()}` + " 0/" + `${hf}` + " * * *"
    }
    if (df&&df > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + "1/" + `${df}` + " *" + " *"
    }
    
    if (monthf&&monthf > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + `${date.getDate()}` + " 1/" + `${monthf}` + " *"
    }

    if (weekdays&&weekdays.length > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + " *" + " * " + weekdays.split(",")[0]
    }

    if (monthdays && monthdays.length > 0) {
        cronString = `${date.getMinutes()} ` + `${date.getHours()} ` + monthdays.split(",")[0]
            + " * " + "*"
    }
    
    return cronString
}
