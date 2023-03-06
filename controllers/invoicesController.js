const User = require("../models/User");
const Invoice = require("../models/Invoices");

const asyncHandler = require("express-async-handler");

// getAllInvoices
// get /invoices
// access: private
const getAllInvoices = asyncHandler(async (req, res) => {
  // Might need id to get specific invoices for a user
  // might do this though a query string!
  const invoices = await Invoice.find({
    user: "6405081b7cf3b3bb590a87bb",
  }).lean();
  
  if (!invoices?.length) {
    return res.status(400).json({ message: "no invoices found" });
  }
  
  res.json(invoices);
});

// might not need if we have all invoices already?
// getSingleInvoice
// get /invoices
// access: private


// createInvoice
// post /invoices
// access: private
const createNewInvoice = asyncHandler(async (req,res) => {
  const {id} = req.body
  const newInvoiceData = req.body
  
  const duplicate = await Invoice.findOne({id}).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: "Username already exists" });
  }
  
  const newInvoice = Invoice.create(newInvoiceData)
    if (newInvoice) {
      // created
      res.status(201).json({ message: `New invoice created` });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
})

// editInvoice
// patch /invoices
// access: private
const editInvoice = asyncHandler(async (req,res) => {
  
})

// deleteInvoice
// post /invoices
// access: private
const deleteInvoice = asyncHandler(async (req, res) => {});

module.exports = {
  getAllInvoices,
  createNewInvoice,
};
