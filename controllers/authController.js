const User = require("../models/User");
const Invoice = require("../models/Invoices")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// description: Login
// route: (POST) /auth
// access: public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //**TOKEN-LOGIC**//
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5s" } // 15mins in prod
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "none", // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry set to match refresh tokken (here is 7days)
  });

  // GET USERS INVOICE DATA TO DISPLAY READY ON LOGIN.
  const invoices = await Invoice.find().lean();

  // send accessToken containing Username
  // (Might add an ID?) Although that might be in the user route
  // res.json({ accessToken });
  res.json({
    user: {
      _id: foundUser.id,
      username: foundUser.username,
      accessToken,
    },
    invoices
  });
  // client recieves the access token
  // the server sets the cookie
  // client application with react never handles the
  // refresh token, inside the above cookie.
  // when the client/react sends a request to the refresh end
  // point, the cookie is sent along with it.
});

// description: Refresh
// route: (GET) /auth/refresh
// access: public - because access token has expired
const refresh = (req, res) => {
  // expect cookie with request
  console.log(req.cookies)
  const cookies = req.cookies;
  
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({ username: decoded.username });

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5s" } // 15mins in prod
      );
      res.json({ accessToken });
    })
  );
};

// description: Logout
// route: (POST) /auth/logout
// access: public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  logout,
  refresh,
};
