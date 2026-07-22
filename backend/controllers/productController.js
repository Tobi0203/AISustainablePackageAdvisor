const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const AppError = require("../utils/AppError");
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    material,
    minScore,
    page = 1,
    limit = 12,
  } = req.query;
  const filter = { isActive: true };
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (material) filter.material = new RegExp(material, "i");
  if (minScore) filter["sustainability.score"] = { $gte: Number(minScore) };
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate({
        path: "supplier",
        select: "companyName isVerified address ratingAverage",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, total, page: Number(page), products });
});
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "supplier",
    populate: { path: "user", select: "name email" },
  });
  if (!product || !product.isActive)
    throw new AppError("Product not found.", 404);
  res.json({ success: true, product });
});
exports.getMyProducts = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOne({ user: req.user._id });
  if (!supplier) throw new AppError("Supplier profile not found.", 404);
  const products = await Product.find({ supplier: supplier._id }).sort({ createdAt: -1 });
  res.json({ success: true, products });
});
exports.createProduct = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOne({ user: req.user._id });
  if (!supplier) throw new AppError("Supplier profile not found.", 404);
  const product = await Product.create({ ...req.body, supplier: supplier._id });
  res.status(201).json({ success: true, product });
});
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found.", 404);
  const supplier = await Supplier.findOne({ user: req.user._id });
  if (
    req.user.role !== "admin" &&
    (!supplier || !product.supplier.equals(supplier._id))
  )
    throw new AppError("You do not own this product.", 403);
  Object.assign(product, req.body);
  await product.save();
  res.json({ success: true, product });
});
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found.", 404);
  const supplier = await Supplier.findOne({ user: req.user._id });
  if (
    req.user.role !== "admin" &&
    (!supplier || !product.supplier.equals(supplier._id))
  )
    throw new AppError("You do not own this product.", 403);
  await product.deleteOne();
  res.json({ success: true, message: "Product deleted." });
});
