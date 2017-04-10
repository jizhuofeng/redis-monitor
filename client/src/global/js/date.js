/*
 * date.js 公共时间处理函数集
 * */

/*
 * Glo_setDateZero(number)
 * 小于10的数字前加0,返回字符串
 * */
export function Glo_setDateZero(number) {
  return number < 10 ? '0' + number : '' + number;
}

/*
 * Glo_getCurrentDate()
 * 获取当前日期(yyyy-mm-dd)
 * */
export function Glo_getCurrentDate() {
  let dateObj = new Date();
  return dateObj.getFullYear() + '-' + Glo_setDateZero(dateObj.getMonth() + 1) + '-' + Glo_setDateZero(dateObj.getDate());
}

/*
 * Glo_getCurrentMonth()
 * 获取当前年月(yyyy-mm)
 * */
export function Glo_getCurrentMonth() {
  let dateObj = new Date();
  return dateObj.getFullYear() + '-' + Glo_setDateZero(dateObj.getMonth() + 1);
}

/*
 * Glo_timeStampFormat(timeStamp)
 * 格式化时间戳(yyyy-mm-dd hh:mm:ss)
 * */
export function Glo_timeStampFormat(timeStamp) {
  var time = new Date(timeStamp);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + Glo_setDateZero(m) + '-' + Glo_setDateZero(d) + ' ' + Glo_setDateZero(h) + ':' + Glo_setDateZero(mm) + ':' + Glo_setDateZero(s);
}

/*
 * Glo_getPreDate(currentDate, daysNum)
 * 获取N天前的日期
 * */
export function Glo_getPreDate(currentDate, daysNum) {
  let currentDateArr = currentDate.split('-').map(data => {
    return Number(data);
  });

  if (currentDateArr[2] < daysNum) {
    if (currentDateArr[1] === 1) {
      currentDateArr[0]--;
      currentDateArr[1] = 12;
      currentDateArr[2] = 31 - (daysNum - currentDateArr[2]) + 1;
    } else if (currentDateArr[1] === 3) {
      currentDateArr[1] = '02';
      if (((currentDateArr[0] % 100 === 0) && (currentDateArr[0] % 400 === 0)) || (currentDateArr[0] % 100 !== 0 && currentDateArr[0] % 4 === 0)) {
        currentDateArr[2] = 29 - (daysNum - currentDateArr[2]) + 1;
      } else {
        currentDateArr[2] = 28 - (daysNum - currentDateArr[2]) + 1;
      }
    } else if (currentDateArr[1] === 5 || currentDateArr[1] === 7 || currentDateArr[1] === 8 || currentDateArr[1] === 10 || currentDateArr[1] === 12) {
      currentDateArr[1] = Glo_setDateZero(--currentDateArr[1]);
      currentDateArr[2] = 30 - (daysNum - currentDateArr[2]) + 1;
    } else {
      currentDateArr[1] = Glo_setDateZero(--currentDateArr[1]);
      currentDateArr[2] = 30 - (daysNum - currentDateArr[2]) + 1;
    }
  } else {
    currentDateArr[1] = Glo_setDateZero(currentDateArr[1]);
    currentDateArr[2] = Glo_setDateZero(currentDateArr[2] - daysNum + 1);
  }
  return currentDateArr.join('-');
}