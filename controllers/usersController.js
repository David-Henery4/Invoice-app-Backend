const User = require("../models/User");
const jwt = require("jsonwebtoken");

// no next, controllers are end of the line,
// where we proccess final data & send response back

// bcrypt = hash password before saving
const bcrypt = require("bcrypt");

// asyncHandler = helps to stop using a lot
// of try/catches and still catch errors
const asyncHandler = require("express-async-handler");

// * desc: create new user
// * route: post /users
// * access: Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // **-CUSTOM-ERROR-HANDLING**
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicates
  // if passing something in & using async/await,
  // need to use "exec()"
  // "409" = conflict
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // hash password
  const hashedPwd = await bcrypt.hash(password, 10); // # of salt rounds
  //
  const userObject = { username, password: hashedPwd };

  // Create & Store New User
  const user = await User.create(userObject);

  //**TOKEN-LOGIC**//
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: user.username,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // 15mins in prod
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  // automatic send with every request
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "none", // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry set to match refresh tokken (here is 7days)
  });

  if (user) {
    // created
    res.status(201).json({
      _id: user.id,
      username: user.username,
      accessToken,
    });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

module.exports = {
  createNewUser,
}