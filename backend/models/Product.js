const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    category: {
      type: String,
      required: true,
      enum: [
        "boxes",
        "mailers",
        "bags",
        "bottles",
        "containers",
        "wraps",
        "labels",
        "protective",
        "other",
      ],
    },
    material: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    minimumOrderQuantity: { type: Number, required: true, min: 1 },
    leadTimeDays: { type: Number, min: 0 },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, enum: ["mm", "cm", "in"], default: "cm" },
    },
    sustainability: {
      recyclable: { type: Boolean, default: false },
      compostable: { type: Boolean, default: false },
      reusable: { type: Boolean, default: false },
      recycledContentPercent: { type: Number, min: 0, max: 100, default: 0 },
      score: { type: Number, min: 0, max: 100 },
    },
    certifications: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
productSchema.index({
  name: "text",
  description: "text",
  material: "text",
  category: "text",
});
module.exports = mongoose.model("Product", productSchema);
