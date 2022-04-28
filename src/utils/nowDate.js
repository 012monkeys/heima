function formatDate(time) {
  if (!time) {
    time = new Date().getTime()
  }
  //  得到时间戳  毫秒
  //  将时间戳转换为  Thu Dec 26 2019 11:22:22 GMT+0800 (中国标准时间)
  const timer = new Date(time)
  //  格式化为年月日等等格式的时间
  function dataFormat(time) {
    // 2021-06-16 09 : 51 : 28
    // return `${time.getFullYear()}-${time.getMonth() + 1 >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}-${time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()} ${time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()}:${time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()}:${time.getSeconds() >= 10 ? time.getSeconds() : '0' + time.getSeconds()}`
    // 一下去掉秒
    return `${time.getFullYear()}-${time.getMonth() + 1 >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}-${time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()} ${time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()}:${time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()}`
  }
  return dataFormat(timer)
}
export {
  formatDate
}
