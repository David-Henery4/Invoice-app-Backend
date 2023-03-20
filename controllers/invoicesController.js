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
  res.json(invoices);
});

// createInvoice
// post /invoices
// access: private
const createNewInvoice = asyncHandler(async (req, res) => {
  const { invoiceId, userId } = req.body;

  const newInvoiceData = { ...req.body };

  const duplicate = await Invoice.findOne({ invoiceId }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Invoice already exists" });
  }

  const newInvoice = await Invoice.create(newInvoiceData);
  const allInvoices = await Invoice.find({userId}).lean();
  if (newInvoice) {
    // created
    res.status(201).json({ message: `New invoice created`, invoices: allInvoices });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// editInvoice
// patch /invoices
// access: private
const editInvoice = asyncHandler(async (req, res) => {
  const { _id } = req.body; 
  
  let invoice = await Invoice.findOne({ _id }).exec();
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found" });
  }

  // update the invoice object with the new data
  invoice = { ...req.body };

  // save the updated invoice to the database
  const updatedInvoice = await Invoice.findOneAndUpdate({ _id }, invoice, {
    new: true,
  });

  res.status(200).json(updatedInvoice);
});

// deleteInvoice
// delete /invoices
// access: private
const deleteInvoice = asyncHandler(async (req, res) => {
  const {_id, userId} = req.body
  if(!_id){
    return res.status(400).json({message: "Need Invoice id"})
  }
  
  const invoice = await Invoice.findOne({_id}).exec()
  if (!invoice) return res.status(400).json({message: "Invoice not found"})

  const result = await invoice.deleteOne()

  // NEW INVOICE LIST TO RETURN
  const allInvoices = await Invoice.find({ userId }).lean();
  
  res.json({message: `Invoice deleted`, invoices: allInvoices})
});

module.exports = {
  getAllInvoices,
  createNewInvoice,
  editInvoice,
  deleteInvoice,
};
