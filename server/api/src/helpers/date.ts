const DateHelper = {
  dateAdd: (date, interval, units): Date | undefined => {
    if (!(date instanceof Date)) return undefined;
    let ret;
    ret = new Date(date);
    const checkRollover = function (): void {
      if (ret.getDate() != date.getDate()) ret.setDate(0);
    };
    switch (String(interval).toLowerCase()) {
      case "year":
        ret.setFullYear(ret.getFullYear() + units);
        checkRollover();
        break;
      case "quarter":
        ret.setMonth(ret.getMonth() + 3 * units);
        checkRollover();
        break;
      case "month":
        ret.setMonth(ret.getMonth() + units);
        checkRollover();
        break;
      case "week":
        ret.setDate(ret.getDate() + 7 * units);
        break;
      case "day":
        ret.setDate(ret.getDate() + units);
        break;
      case "hour":
        ret.setTime(ret.getTime() + units * 3600000);
        break;
      case "minute":
        ret.setTime(ret.getTime() + units * 60000);
        break;
      case "second":
        ret.setTime(ret.getTime() + units * 1000);
        break;
      default:
        ret = undefined;
        break;
    }
    return ret;
  },
};

export default DateHelper;
