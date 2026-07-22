const mongoose = require("mongoose");
const supplierSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 2000 },
    website: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: {
      country: String,
      state: String,
      city: String,
      postalCode: String,
    },
    certifications: [
      {
        name: { type: String, required: true },
        certificateNumber: String,
        expiryDate: Date,
        documentUrl: String,
      },
    ],
    materials: [{ type: String, trim: true }],
    minimumOrderQuantity: { type: Number, min: 1 },
    leadTimeDays: { type: Number, min: 0 },
    isVerified: { type: Boolean, default: false },
    verificationNotes: { type: String, trim: true },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);
supplierSchema.index({
  companyName: "text",
  description: "text",
  materials: "text",
});
module.exports = mongoose.model("Supplier", supplierSchema);
