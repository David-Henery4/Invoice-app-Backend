const rateLimit = require("express-rate-limit")
const {logEvents} = require("../middleware/logger")

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // limit each Ip to 5 login requests per "window" per minute
  message: 
  {message: "Too many login attempts from this IP, please try again after a 60 second pause"},
  handler: (req, res, next, options) => {
    logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.orgins}`, "error.log")
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = loginLimiter
