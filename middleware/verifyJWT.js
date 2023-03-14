const jwt = require("jsonwebtoken");

// WE USE THIS MIDDLEWARE ON THE ROUTES WE
// WANT TO PROTECT

const verifyJwt = (req, res, next) => {
  // good practice to check for both
  // console.log(req.headers)
  const authHeader =
    req.headers.authorization || req.headers.Authorization;

  
  // check for the token which as the worder "Bearer"
  // with a space
  if(!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({message: "Unauthorized"})
  }
  
  const token = authHeader.split(" ")[1]

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err,decoded) => {
      if (err) return res.status(403).json({message: "Forbidden"}),
      req.user = decoded.UserInfo.username
      next()
    }
  )

};

module.exports = verifyJwt;
