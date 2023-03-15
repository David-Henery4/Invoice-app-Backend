const User = require("../models/User");
const Invoice = require("../models/Invoices");

const asyncHandler = require("express-async-handler");

// getAllInvoices
// get /invoices
// access: private
const getAllInvoices = asyncHandler(async (req, res) => {
  const {userId} = req.params
  const invoices = await Invoice.find({
    userId,
  }).lean();
  // const invoices = await Invoice.find().lean();
  // if (!invoices?.length) {
  //   return res.status(400).json({ message: "no invoices found" });
  // }
  res.json(invoices);
});

// might not need if we have all invoices already?
// getSingleInvoice
// get /invoices
// access: private

// createInvoice
// post /invoices
// access: private
const createNewInvoice = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // Need user ID (or something else) from user
  // The one created by mongo
  // const newInvoiceData = { ...req.body, userId: "6407c71f3d8f7d221cf16c03" };
  const newInvoiceData = { ...req.body };

  const duplicate = await Invoice.findOne({ id }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Invoice already exists" });
  }

  const newInvoice = await Invoice.create(newInvoiceData);
  if (newInvoice) {
    // created
    res.status(201).json({ message: `New invoice created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// editInvoice
// patch /invoices
// access: private
const editInvoice = asyncHandler(async (req, res) => {
  const { id } = req.body; // might add userID as well to search for invoice

  let invoice = await Invoice.findOne({ id }).exec();
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found" });
  }

  // update the invoice object with the new data
  invoice = { ...req.body };

  // save the updated invoice to the database
  const updatedInvoice = await Invoice.findOneAndUpdate({ id }, invoice, {
    new: true,
  });

  res.status(200).json(updatedInvoice);
});

// deleteInvoice
// delete /invoices
// access: private
const deleteInvoice = asyncHandler(async (req, res) => {
  const {id} = req.body
  if(!id){
    return res.status(400).json({message: "Need Invoice id"})
  }
  
  const invoice = await Invoice.findOne({id}).exec()
  if (!invoice) return res.status(400).json({message: "Invoice not found"})
  
  const result = await invoice.deleteOne()
  res.json({message: `Invoice ${result.id} deleted`})
});

module.exports = {
  getAllInvoices,
  createNewInvoice,
  editInvoice,
  deleteInvoice,
};
