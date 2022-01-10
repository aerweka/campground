const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
  },
  customer_phone: {
    type: Number,
    required: true,
  },
  ordered_camps: {
    type: Array,
    required: true,
  },
  rent_start: {
    type: Date,
    required: true,
  },
  rent_end: {
    type: Date,
    required: true
  },
  payment: {
    type: Array,
    required: true
  },
  order_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
