export default function getNextDate () {
  const todayDate = new Date()
  todayDate.setUTCHours(todayDate.getUTCHours() - 5)

  const nextDate = new Date(todayDate.toString())
  const hour = nextDate.getUTCHours()
  const isValidHour = hour >= 15
  const isValidHourToReserve = (hour >= 14 || hour < 11) || nextDate.getDay() === 6 || nextDate.getDay() === 0
  const isValidHourToDelivery = (hour >= 11 && hour < 17) && nextDate.getDay() !== 6 && nextDate.getDay() !== 0
  const isValidHourToDeliveryStats = (hour >= 14 && hour < 17) && nextDate.getDay() !== 6 && nextDate.getDay() !== 0

  if (isValidHour) {
    if (nextDate.getDay() === 5) {
      nextDate.setDate(nextDate.getDate() + 3)
    } else if (nextDate.getDay() === 6) {
      nextDate.setDate(nextDate.getDate() + 2)
    } else {
      nextDate.setDate(nextDate.getDate() + 1)
    }
  }

  const year = nextDate.getFullYear()
  const month = nextDate.getMonth() + 1
  const day = nextDate.getDate()

  const nextFullDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`

  return { nextDate, nextFullDate, isValidHourToReserve, isValidHourToDelivery, isValidHourToDeliveryStats }
}
