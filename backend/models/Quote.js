const mongoose = require("mongoose");
const quoteSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    requirements: {
      productName: { type: String, required: true, trim: true },
      quantity: { type: Number, required: true, min: 1 },
      materialPreference: String,
      dimensions: String,
      notes: { type: String, trim: true, maxlength: 2000 },
    },
    status: {
      type: String,
      enum: ["requested", "quoted", "accepted", "rejected", "cancelled"],
      default: "requested",
    },
    quotedAmount: { type: Number, min: 0 },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    leadTimeDays: { type: Number, min: 0 },
    supplierMessage: { type: String, trim: true, maxlength: 2000 },
    validUntil: Date,
  },
  { timestamps: true },
);
quoteSchema.index({ customer: 1, createdAt: -1 });
quoteSchema.index({ supplier: 1, createdAt: -1 });
module.exports = mongoose.model("Quote", quoteSchema);
