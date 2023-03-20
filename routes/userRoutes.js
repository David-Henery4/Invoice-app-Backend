const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController")


// Would apply it to all the routes below
// router.use(verifyJWT);

// "/" = matches the userRoutes path in the server
// can chain the different methods
router.route("/")
  .post(usersController.createNewUser)

module.exports = router
