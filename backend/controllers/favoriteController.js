const asyncHandler = require("express-async-handler");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
exports.getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ customer: req.user._id })
    .populate({
      path: "product",
      populate: { path: "supplier", select: "companyName isVerified" },
    })
    .sort({ createdAt: -1 });
  res.json({ success: true, favorites });
});
exports.addFavorite = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.body.product,
    isActive: true,
  });
  if (!product) throw new AppError("Product not found.", 404);
  const favorite = await Favorite.findOneAndUpdate(
    { customer: req.user._id, product: product._id },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  res.status(201).json({ success: true, favorite });
});
exports.removeFavorite = asyncHandler(async (req, res) => {
  const deleted = await Favorite.findOneAndDelete({
    customer: req.user._id,
    product: req.params.productId,
  });
  if (!deleted) throw new AppError("Favorite not found.", 404);
  res.json({ success: true, message: "Favorite removed." });
});
