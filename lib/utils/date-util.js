'use strict';

exports.__esModule = true;
exports.range = range;
exports.getI18nSettings = getI18nSettings;
exports.isDate = isDate;
exports.toDate = toDate;
exports.isDateObject = isDateObject;
exports.formatDate = formatDate;
exports.parseDate = parseDate;
exports.getDayCountOfMonth = getDayCountOfMonth;
exports.getDayCountOfYear = getDayCountOfYear;
exports.getFirstDayOfMonth = getFirstDayOfMonth;
exports.prevDate = prevDate;
exports.nextDate = nextDate;
exports.getStartDateOfMonth = getStartDateOfMonth;
exports.getWeekNumber = getWeekNumber;
exports.getRangeHours = getRangeHours;
exports.getPrevMonthLastDays = getPrevMonthLastDays;
exports.getMonthDays = getMonthDays;
exports.getRangeMinutes = getRangeMinutes;
exports.modifyDate = modifyDate;
exports.modifyTime = modifyTime;
exports.modifyWithTimeString = modifyWithTimeString;
exports.clearTime = clearTime;
exports.clearMilliseconds = clearMilliseconds;
exports.limitTimeRange = limitTimeRange;
exports.timeWithinRange = timeWithinRange;
exports.changeYearMonthAndClampDate = changeYearMonthAndClampDate;
exports.prevMonth = prevMonth;
exports.nextMonth = nextMonth;
exports.prevYear = prevYear;
exports.nextYear = nextYear;
exports.extractDateFormat = extractDateFormat;
exports.extractTimeFormat = extractTimeFormat;
exports.validateRangeInOneMonth = validateRangeInOneMonth;

var _date = require('element-ui/lib/utils/date');

var _date2 = _interopRequireDefault(_date);

var _locale = require('element-ui/lib/locale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var weeks = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** @param {number} n */
function range(n) {
  var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, n) {
    return n;
  };

  // see https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  return Array.apply(null, { length: n }).map(cb);
}

/**
 * @param {number} start
 * @param {number} end
 **/
function newArray(start, end) {
  return range(end - start + 1, function (_, n) {
    return start + n;
  });
}

/**
 * @param {any[]} arr
 * @param {number} start
 * @param {number} end
 **/
function setRangeData(arr, start, end, value) {
  for (var i = start; i < end; i++) {
    arr[i] = value;
  }
}

function getI18nSettings() {
  return {
    dayNamesShort: weeks.map(function (week) {
      return (0, _locale.t)('el.datepicker.weeks.' + week);
    }),
    dayNames: weeks.map(function (week) {
      return (0, _locale.t)('el.datepicker.weeks.' + week);
    }),
    monthNamesShort: months.map(function (month) {
      return (0, _locale.t)('el.datepicker.months.' + month);
    }),
    monthNames: months.map(function (month, index) {
      return (0, _locale.t)('el.datepicker.month' + (index + 1));
    }),
    amPm: ['am', 'pm']
  };
}

function isDate(date) {
  if (date == null) return false;
  if (isNaN(+new Date(date))) return false;
  if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
  return true;
}

function toDate(date) {
  var temp = new Date(date);
  return isNaN(+temp) ? null : temp;
}

function isDateObject(val) {
  return val instanceof Date;
}

function formatDate(date) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd';

  date = toDate(date);
  if (!date) return '';
  return _date2.default.format(date, format);
}

/** @param {string} string */
function parseDate(string) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd';

  return _date2.default.parse(string, format);
}

/**
 * @param {number} year
 * @param {number} month
 **/
function getDayCountOfMonth(year, month) {
  // 后一个月的前一天（它这个month是1开始的）
  return new Date(year, month + 1, 0).getDate();
}

/** @param {number} year */
function getDayCountOfYear(year) {
  var isLeapYear = year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
  return isLeapYear ? 366 : 365;
}

/** @param {Date} date */
function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

/** @param {Date} date */
function prevDate(date) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount);
}

/** @param {Date} date */
function nextDate(date) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/**
 * @param {number} year
 * @param {number} month
 **/
function getStartDateOfMonth(year, month) {
  var result = new Date(year, month, 1);
  var day = result.getDay();
  return prevDate(result, day === 0 ? 7 : day);
}

/** @param {Date} src */
function getWeekNumber(src) {
  if (!isDate(src)) return null;
  var date = new Date(src.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
  // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

function getRangeHours() {
  var ranges = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var hours = [];
  var disabledHours = [];

  ranges.forEach(function (range) {
    var value = range.map(function (date) {
      return date.getHours();
    });

    disabledHours.push.apply(disabledHours, newArray(value[0], value[1]));
  });

  if (disabledHours.length) {
    for (var i = 0; i < 24; i++) {
      hours[i] = disabledHours.indexOf(i) === -1;
    }
  } else {
    for (var _i = 0; _i < 24; _i++) {
      hours[_i] = false;
    }
  }

  return hours;
}

/**
 * @param {Date} date
 * @param {number} amount
 **/
function getPrevMonthLastDays(date, amount) {
  if (amount <= 0) return [];
  var temp = new Date(+date);
  temp.setDate(0);
  var lastDay = temp.getDate();
  return range(amount, function (_, index) {
    return lastDay - (amount - index - 1);
  });
}

/** @param {Date} date */
function getMonthDays(date) {
  var temp = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return range(temp.getDate(), function (_, index) {
    return index + 1;
  });
}

function getRangeMinutes(ranges, hour) {
  var minutes = new Array(60);

  if (ranges.length > 0) {
    ranges.forEach(function (_ref) {
      var start = _ref[0],
          end = _ref[1];

      var startHour = start.getHours();
      var startMinute = start.getMinutes();
      var endHour = end.getHours();
      var endMinute = end.getMinutes();
      if (startHour === hour && endHour !== hour) {
        setRangeData(minutes, startMinute, 60, true);
      } else if (startHour === hour && endHour === hour) {
        setRangeData(minutes, startMinute, endMinute + 1, true);
      } else if (startHour !== hour && endHour === hour) {
        setRangeData(minutes, 0, endMinute + 1, true);
      } else if (startHour < hour && endHour > hour) {
        setRangeData(minutes, 0, 60, true);
      }
    });
  } else {
    setRangeData(minutes, 0, 60, true);
  }
  return minutes;
}

/**
 * @param {Date} date
 * @param {number} y
 * @param {number} m
 * @param {number} d
 **/
function modifyDate(date, y, m, d) {
  return new Date(y, m, d, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

/**
 * @param {Date} date
 * @param {number} h
 * @param {number} m
 * @param {number} s
 **/
function modifyTime(date, h, m, s) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s, date.getMilliseconds());
}

/**
 * @param {Date} date
 * @param {string} time
 **/
function modifyWithTimeString(date, time) {
  if (date == null || !time) {
    return date;
  }
  time = parseDate(time, 'HH:mm:ss');
  return modifyTime(date, time.getHours(), time.getMinutes(), time.getSeconds());
};

function clearTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/** @param {Date} date */
function clearMilliseconds(date) {
  var temp = new Date(+date);
  temp.setMilliseconds(0);
  return temp;
};

/**
 * @param {Date} date
 * @param {any[]} ranges
 **/
function limitTimeRange(date, ranges) {
  var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'HH:mm:ss';

  // TODO: refactory a more elegant solution
  if (ranges.length === 0) return date;
  var normalizeDate = function normalizeDate(date) {
    return parseDate(formatDate(date, format), format);
  };
  var ndate = normalizeDate(date);
  var nranges = ranges.map(function (range) {
    return range.map(normalizeDate);
  });
  if (nranges.some(function (nrange) {
    return ndate >= nrange[0] && ndate <= nrange[1];
  })) return date;

  var minDate = nranges[0][0];
  var maxDate = nranges[0][0];

  nranges.forEach(function (nrange) {
    minDate = new Date(Math.min(nrange[0], minDate));
    maxDate = new Date(Math.max(nrange[1], minDate));
  });

  var ret = ndate < minDate ? minDate : maxDate;
  // preserve Year/Month/Date
  return modifyDate(ret, date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * @param {Date} date
 * @param {any[]} ranges
 * @param {string} format
 **/
function timeWithinRange(date, selectableRange, format) {
  var limitedDate = limitTimeRange(date, selectableRange, format);
  return +limitedDate === +date;
}

/**
 * @param {Date} date
 * @param {number} year
 * @param {number} month
 **/
function changeYearMonthAndClampDate(date, year, month) {
  // clamp date to the number of days in `year`, `month`
  // eg: (2010-1-31, 2010, 2) => 2010-2-28
  var monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month));
  return modifyDate(date, year, month, monthDate);
}

/** @param {Date} date */
function prevMonth(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  return month === 0 ? changeYearMonthAndClampDate(date, year - 1, 11) : changeYearMonthAndClampDate(date, year, month - 1);
}

/** @param {Date} date */
function nextMonth(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  return month === 11 ? changeYearMonthAndClampDate(date, year + 1, 0) : changeYearMonthAndClampDate(date, year, month + 1);
}

/** @param {Date} date */
function prevYear(date) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var year = date.getFullYear();
  var month = date.getMonth();
  return changeYearMonthAndClampDate(date, year - amount, month);
}

/** @param {Date} date */
function nextYear(date) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var year = date.getFullYear();
  var month = date.getMonth();
  return changeYearMonthAndClampDate(date, year + amount, month);
}

/** @param {string} format */
function extractDateFormat(format) {
  return format.replace(/\W?m{1,2}|\W?ZZ/g, '').replace(/\W?h{1,2}|\W?s{1,3}|\W?a/gi, '').trim();
}

/** @param {string} format */
function extractTimeFormat(format) {
  return format.replace(/\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?y{2,4}/g, '').trim();
}

/**
 * @param {Date} start
 * @param {Date} end
 **/
function validateRangeInOneMonth(start, end) {
  return start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
}