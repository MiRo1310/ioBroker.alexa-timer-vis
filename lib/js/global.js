// ANCHOR Gesamt-Sekunden in Stunden Minuten und Sekunden teilen

/**
 *
 * @param {number} valSec Eingabe Sekunden um sie zu Stunden Minuten und Sekunden aufzuteilen
 * @param {boolean} doubleInt Sollen die Werte immer zweistellig sein? 1 > 01
 * @return Returns Hours, Minutes, Seconds, String mit den Werten und Einheiten
 */
const secToHourMinSec = (valSec, doubleInt, unitHour1, unitHour2, unitMinute1, unitMinute2, unitSecond1, unitSecond2) => {
  let hour;
  let minutes;
  let seconds;

  // Wieviel Stunden sind enthalten
  hour = valSec / (60 * 60);
  hour = Math.floor(hour);
  const hourInSec = hour * 60 * 60;

  // Wieviele Minuten, timeLeft - Stunden in Millisekunden, Rest in Minuten
  minutes = (valSec - hourInSec) / 60;
  minutes = Math.floor(minutes);
  const minutesInSec = minutes * 60;

  // Sekunden
  seconds = valSec - hourInSec - minutesInSec;
  seconds = Math.round(seconds);

  // Stunden, Minuten und Sekunden umwandeln so das sie immer zweistellig sind bei > 10 ( 1 => 01 usw.)
  if (doubleInt) {
    hour = ("0" + hour).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);
  }
  let hourUnit = "";
  // ANCHOR Einheiten lengthTimer
  if (hour && typeof hour == "string") {
    if (parseInt(hour) > 1) {
      hourUnit = unitHour2;
    } else {
      hourUnit = unitHour1;
    }
  } else {
    hour = "";
  }
  let minuteUnit = "";
  if (minutes && typeof minutes == "string") {
    if (parseInt(minutes) > 1) {
      minuteUnit = unitMinute2;
    } else {
      minuteUnit = unitMinute1;
    }
  } else {
    minutes = "";
  }

  let secUnit = "";
  if (seconds && typeof seconds == "string") {
    if (parseInt(seconds) > 1) {
      secUnit = unitSecond2;
    } else {
      secUnit = unitSecond1;
    }
  } else {
    seconds = "";
  }

  let string = `${hour} ${hourUnit} ${minutes} ${minuteUnit} ${seconds} ${secUnit}`;
  string = string.trim();
  return [hour, minutes, seconds, string];
};
// ANCHOR firstLetterToUpperCase
/**
 * Ersetzt den ersten Buchstaben des eingegebenen Wortes durch den selbigen Großbuchstaben
 * @param {string} name "w"ort wo der erste Buchstabe groß geschrieben werden soll
 * @return {string} Rückgabewert mit "W"ort
 */
function firstLetterToUpperCase(name) {
  return name.slice(0, 1).toUpperCase() + name.slice(1); // Erster Buchstabe in Groß + ReststartTimer
}

// ANCHOR Time
//----------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * // Aus millisekunden nur die Zeit als String zurück geben lassen
 * @param {number} milliseconds // Time in milliseconds
 * @return {string} Zeit
 */
function time(milliseconds) {
  // Zeit zu String
  const date_string = new Date(milliseconds).toString();
  // String zu Array, zeit herausschneiden und zurück zu String
  const time = date_string.split(" ").slice(4, 5).toString();
  return time;
}
module.exports = { secToHourMinSec, firstLetterToUpperCase, time };
