export default function getNextDate () {
  const todayDate = new Date()
  todayDate.setUTCHours(todayDate.getUTCHours() - 5)

  const nextDate = new Date(todayDate.toString())
  const hour = nextDate.getUTCHours()
  const isValidHour = hour >= 15

  if (((nextDate.getDay() + 1) === 6) && isValidHour) {
    nextDate.setDate(nextDate.getDate() + 3)
  } else if ((nextDate.getDay() + 1) === 7) {
    nextDate.setDate(nextDate.getDate() + 2)
  } else if (((nextDate.getDay()) === 0)) {
    nextDate.setDate(nextDate.getDate() + 1)
  } else if (isValidHour) {
    nextDate.setDate(nextDate.getDate() + 1)
  }

  const year = nextDate.getFullYear()
  const month = nextDate.getMonth() + 1
  const day = nextDate.getDate()

  const nextFullDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`

  return { nextDate, nextFullDate }
}
