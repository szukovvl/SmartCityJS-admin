//
function parseTimeHHMM (stringTime) {
  return stringTime.split(':').map(Number)
}

function setTime (date, hours = 0, minutes = 0, seconds = 0, ms = 0) {
  date.setHours(hours, minutes, seconds, ms)
}

function addMinutes (date, minutes = 30) {
  date.setMinutes(date.getMinutes() + minutes)
}

export function nextTimePoint (time, addmin = 30) {
  const [hours, minutes] = parseTimeHHMM(time)
  const timeDate = new Date()
  setTime(timeDate, hours, minutes)
  // добавляем n минут
  addMinutes(timeDate, addmin)
  return ('0' + timeDate.getHours()).slice(-2) + ':' + ('0' + timeDate.getMinutes()).slice(-2)
}
