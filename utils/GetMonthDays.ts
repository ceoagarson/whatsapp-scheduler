export function GetMonthDays(year: number, month: number) {
    let febDays = 28
    if (year % 4 === 0) {
        febDays = 29
    }
    let day31 = [1, 3, 5, 7, 8, 10, 12]
    let day30 = [4, 6, 9, 11]
    if (day31.includes(month))
        return 31
    if (day30.includes(month))
        return 30
    return febDays
}
