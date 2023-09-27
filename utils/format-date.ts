import { MonthNames } from "@/app/constants/month-names"

export function formatDate(date: Date) {
  const convertedDate = new Date(date)

  // Get the day, month, and year components from the Date object
  const day = convertedDate.getDate()
  const month = convertedDate.getMonth() // Note: Months are zero-based (0-11)
  const year = convertedDate.getFullYear()

  // Format the date
  const formattedDate = `${day} ${MonthNames[month]} ${year}`

  return formattedDate
}
