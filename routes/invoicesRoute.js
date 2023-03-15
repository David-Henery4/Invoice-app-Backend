const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const invoicesController = require("../controllers/invoicesController");
const verifyJWT = require("../middleware/verifyJWT");

//Applies it to all the routes below
router.use(verifyJWT);

router.route("/:userId").get(invoicesController.getAllInvoices);

router.route("/")
  // .get(invoicesController.getAllInvoices)
  .post(invoicesController.createNewInvoice)
  .patch(invoicesController.editInvoice)
  .delete(invoicesController.deleteInvoice)



//*********//
module.exports = router;
