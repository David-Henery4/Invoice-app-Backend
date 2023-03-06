const {format} = require("date-fns")
const {v4:uuid} = require("uuid")
const fs = require("fs")
const fsPomises = require("fs").promises
const path = require("path")

const logEvents = async(message, logFileName) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss")
  const logItem = `${dateTime}\t${uuid()}\t${message}`
  try {
    if (!fs.existsSync(path.join(__dirname, "..","logs"))) {
      await fs.promises.mkdir(path.join(__dirname, ".." ,"logs"))
    }
    await fs.promises.appendFile(path.join(__dirname, ".." ,"logs", logFileName), logItem)
  } catch (error) {
    console.log(error)
  }
}

// "reqLog.log" = convention for righting logs
// logs every request that comes in,
// will have to handle this with conditionals
// otherwise logs will pile up!
const logger = (req,res,next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.log")
  console.log(`${req.method} ${req.path}`)
  next()
}

module.exports = {logEvents, logger}