const child_process = require('child_process')

module.exports = {
exec}

function exec (cmd, printCmd = true , printTime = false) {
  printCmd && Editor.log(cmd)

  let timeStart = new Date().getTime()
  let result = ''
  try {
    result = child_process.execSync(cmd).toString()
  } catch (err) {
    Editor.log(err.message)
    result = "error!"
  }
  let timeFinish = new Date().getTime()

  printTime && Editor.log(`命令完成，共耗时 ${(timeFinish - timeStart) / 1000} 秒`)
  return result
}
