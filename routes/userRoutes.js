const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const usersController = require("../controllers/usersController")

// "/" = matches the userRoutes path in the server
// can chain the different methods we want to handle
router.route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

module.exports = router
