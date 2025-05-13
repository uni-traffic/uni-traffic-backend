import { v4 as uuid } from "uuid";

const uniTrafficId = (uniqueCode?: string) => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const yearLastTwoDigits = currentYear.toString().slice(-2);

  const currentMonth = currentDate.getMonth();
  const formattedMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;

  const currentDay = currentDate.getDate();
  const formattedDay = currentDay < 10 ? `0${currentDay}` : currentDay;

  const generatedUUID = uuid();
  const [timeLow, timeMid] = generatedUUID.split("-");

  const code = uniqueCode ? uniqueCode : "";

  return `UT${code}${yearLastTwoDigits}${formattedMonth}${formattedDay}${timeLow}${timeMid}`.toUpperCase();
};

export { uniTrafficId };
