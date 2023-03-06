const allowedOrigins = require("./allowedOrigin")


// !origin = will allow things like postman &
// other origins
const corsOptions = {
  origin: (origin,callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin){
      callback(null,true)
    } else{
      callback(new Error("not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

module.exports = corsOptions