const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const usersController = require("../controllers/usersController")
const verifyJWT = require("../middleware/verifyJWT");

//Applies it to all the routes below
// router.use(verifyJWT);

// "/" = matches the userRoutes path in the server
// can chain the different methods we want to handle
router.route("/")
  .get( verifyJWT ,usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

module.exports = router
