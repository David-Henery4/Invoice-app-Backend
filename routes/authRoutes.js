const express = require("express")
const router = express.Router()
const authContoller = require("../controllers/authController")
const loginLimiter = require("../middleware/loginLimiter")


router.route("/")
  .post(loginLimiter, authContoller.login)


router.route("/refresh")
  .get(authContoller.refresh)


router.route("/logout")
  .post(authContoller.logout)


module.exports = router

