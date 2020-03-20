import moment from "moment";

function isDate(_date: string) {
  const _regExp = new RegExp(
    "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$"
  );
  return _regExp.test(_date);
}

export default function convertDate(object: any) {
  Object.keys(object).forEach(key => {
    if (object[key] && typeof object[key] === "object") {
      convertDate(object[key]);
    } else {
      if (isDate(object[key])) {
        object[key] = new Date(object[key]);
      }
    }
  });
}

export function dateToString(date?: Date) {
  date = date || new Date();
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, "0");
  const day = date
    .getDate()
    .toString()
    .padStart(2, "0");

  return month + "/" + day + "/" + year;
}

export function closerDay(hours: number, minutes: number) {
  let day = moment()
    .hours(hours)
    .minutes(minutes)
    .toDate();
  const today = moment().day();
  const currentDay = new Date();
  if (day < currentDay) {
    day = moment()
      .day(today + 1)
      .hours(hours)
      .minutes(minutes)
      .toDate();
  }
  return day;
}

export function closerWeekDay(day: number, hours: number, minutes: number) {
  const todayDay = new Date();
  let closerDay = moment()
    .day(day)
    .hours(hours)
    .minutes(minutes)
    .toDate();
  if (closerDay < todayDay) {
    closerDay = moment()
      .day(7 + day)
      .hours(hours)
      .minutes(minutes)
      .toDate();
  }
  return closerDay;
}

export function closerMonthDay(
  day: number,
  hours: number,
  minutes: number
): Date {
  let daysInMonth = moment().daysInMonth();
  let validDay = day <= daysInMonth;

  let closerDay = moment()
    .date(validDay ? day : daysInMonth)
    .hours(hours)
    .minutes(minutes)
    .toDate();
  const currentDay = new Date();
  if (closerDay < currentDay) {
    let year = moment().year();
    let month = moment().month() + 1;
    if (month > 12) {
      month = 1;
      year++;
    }
    daysInMonth = moment()
      .year(year)
      .month(month)
      .daysInMonth();
    validDay = day <= daysInMonth;

    closerDay = moment()
      .year(year)
      .month(month)
      .date(validDay ? day : daysInMonth)
      .hours(hours)
      .minutes(minutes)
      .toDate();
  }
  return closerDay;
}
