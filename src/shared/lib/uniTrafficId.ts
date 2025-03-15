import { v4 as uuid } from "uuid";

export const uniTrafficId = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const quarter = Math.floor(currentMonth / 3) + 1;

  const yearLastTwoDigits = currentYear.toString().slice(-2);
  const uuidPart = uuid().slice(0, 8);

  return `UT${yearLastTwoDigits}${quarter}${uuidPart}`.toUpperCase();
};
