const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const invoicesController = require("../controllers/invoicesController");

router.route("/")
  .get(invoicesController.getAllInvoices)
  .post(invoicesController.createNewInvoice)
  .patch(invoicesController.editInvoice)
  .delete(invoicesController.deleteInvoice)



//*********//
module.exports = router;
