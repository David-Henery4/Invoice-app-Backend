const User = require("../models/User");
const Invoice = require("../models/Invoices");
const jwt = require("jsonwebtoken");


// bcrypt = hash password before saving
const bcrypt = require("bcrypt");

// asyncHandler = helps to stop using a lot
// of try/catches and still catch errors
const asyncHandler = require("express-async-handler");

// no next, controllers are end of the line,
// where we proccess final data & send response back


// **IF any other errors inside these functions,
// async error handler will handle it,
// then it will go to the error handling middleware.
// Although if we know we might get a specific response,
// we can handle errors, like we've done below,
// to send back to the frontend to show/help the user.**

// Always check every response that you expect to get
// Also check the error handling.



// * desc: get all users
// * route: get /users
// * access: Private
const getAllUsers = asyncHandler(async (req, res) => {
  // .select("-password") = don't return password with user data
  // NEVER a reason to send password back to client
  // .lean() = if we don't have this mongoose returns full-
  // document with a load of methods (E.G-save())
  // .lean() = give data, like JSON, without extra Methods
  const users = await User.find().select("-password").lean();
  if (!users?.length){
    // **-CUSTOM-ERROR-HANDLING**
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users)
});


 

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
    { expiresIn: "1m" } // 15mins in prod
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
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




// * desc: update user
// * route: patch /users
// * access: Private
const updateUser = asyncHandler(async (req, res) => {
  const {id,username,password} = req.body
  
  if (!id || !username){
    return res.status(400).json({ message: "All fields are required" });
  }
  
  // REMINDER: need ".exec()" because
  // we're passing in a value & do need the promise
  // no "lean()" because we need the document from mongoose,
  // with methods like "save()" & etc
  const user = await User.findById(id).exec()
  if (!user){
    return res.status(400).json({message: "User not found"})
  }
  
  // check for duplicate
  const duplicate = await User.findOne({username}).lean().exec()
  
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id){
    return res.status(409).json({message: "Duplicate Username"})
  }
  
  // Mongoose will reject if property is not
  // already created in the model.
  user.username = username
  
  // Don't want someone to always
  // require a password update,
  // when they update something else
  if (password){
    // hash password
    user.password = await bcrypt.hash(password, 10)
  }
  
  // get "save()" because we didn't use "lean()",
  // if there is a problem, it'll be caught be the
  // "asynchandler", even without "try/catch"
  const updatedUser = await user.save()
  
  res.json({message: `${updatedUser.username} updated`})
});




// * desc: delete user
// * route: delete /users
// * access: Private
const deleteUser = asyncHandler(async (req, res) => {
  const {id} = req.body
  if (!id){
    return res.status(400).json({message: "User ID required"})
  }
  
  // Delete Invoices assigned to that user?
  
  // find user
  const user = await User.findById(id).exec()
  
  if (!user){
    return res.status(400).json({message: "User not found"})
  }
  
  // result carries info on deleted user
  const result = await user.deleteOne()
  
  const reply = `Username ${result.username} with ID ${result._id} deleted`
  res.json(reply) // may need {}?
});




module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}