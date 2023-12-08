export const convertUTCDate = (value) => {
  
  const parseDate = new Date(value)
  const newDate = new Date(
    parseDate.getTime() + parseDate.getTimezoneOffset() * 60 * 1000
  )

  const offset = parseDate.getTimezoneOffset() / 60
  const hours = parseDate.getHours()

  newDate.setHours(hours - offset)

  return newDate
}