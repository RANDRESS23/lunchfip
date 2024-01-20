export default function getNextDate () {
  const todayDate = new Date()
  todayDate.setUTCHours(todayDate.getUTCHours() - 5)

  const nextDate = new Date(todayDate.toString())

  if ((nextDate.getDay() + 1) === 6) {
    nextDate.setDate(nextDate.getDate() + 3)
  } else if ((nextDate.getDay() + 1) === 7) {
    nextDate.setDate(nextDate.getDate() + 2)
  } else {
    nextDate.setDate(nextDate.getDate() + 1)
  }

  const year = nextDate.getFullYear()
  const month = nextDate.getMonth() + 1
  const day = nextDate.getDate()

  const nextFullDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`

  return { nextDate, nextFullDate }
}
