const asyncHandler = require("express-async-handler");
const Supplier = require("../models/Supplier");
const AppError = require("../utils/AppError");
exports.getSuppliers = asyncHandler(async (req, res) => {
  const { search, material, verified, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (search) filter.$text = { $search: search };
  if (material) filter.materials = new RegExp(material, "i");
  if (verified !== undefined) filter.isVerified = verified === "true";
  const [suppliers, total] = await Promise.all([
    Supplier.find(filter)
      .populate("user", "name email companyName")
      .sort({ isVerified: -1, ratingAverage: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Supplier.countDocuments(filter),
  ]);
  res.json({ success: true, total, page: Number(page), suppliers });
});
exports.getSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id).populate(
    "user",
    "name email companyName",
  );
  if (!supplier) throw new AppError("Supplier not found.", 404);
  res.json({ success: true, supplier });
});
exports.getMySupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOne({ user: req.user._id });
  if (!supplier) throw new AppError("Supplier profile not found.", 404);
  res.json({ success: true, supplier });
});
exports.updateMySupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOneAndUpdate(
    { user: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!supplier) throw new AppError("Supplier profile not found.", 404);
  res.json({ success: true, supplier });
});
exports.verifySupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(
    req.params.id,
    {
      isVerified: req.body.isVerified,
      verificationNotes: req.body.verificationNotes,
    },
    { new: true, runValidators: true },
  );
  if (!supplier) throw new AppError("Supplier not found.", 404);
  res.json({ success: true, supplier });
});
