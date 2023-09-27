export function formatDate(date: Date) {
  const convertedDate = new Date(date)
  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Get the day, month, and year components from the Date object
  const day = convertedDate.getDate()
  const month = convertedDate.getMonth() // Note: Months are zero-based (0-11)
  const year = convertedDate.getFullYear()

  // Format the date
  const formattedDate = `${day} ${monthNames[month]} ${year}`

  return formattedDate
}
