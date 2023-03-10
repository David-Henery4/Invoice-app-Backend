const mongoose = require("mongoose");

// MIGHT NEED TO RE-ADD A ID PROPERTY/ or REFNUM

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: String,
    required: true,
  },
  paymentDue: {
    type: String,
    required: true,
  },
  paymentTerms: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  clientName: {
    type: String,
  },
  clientEmail: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  clientAddress: {
    type: Object,
    properties: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      postCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },
  },
  senderAddress: {
    type: Object,
    properties: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      postCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },
  },
  items: {
    type: Array,
    uniqueItems: true,
    items: {
      type: Object,
      properties: {
        refNumber: Number,
        name: String,
        quantity: Number,
        price: Number,
        total: Number,
      }
    }
  },
  total: {
    type: Number
  }
});

module.exports = mongoose.model("Invoice", invoiceSchema);