const asyncHandler = require("express-async-handler");
const Quote = require("../models/Quote");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
exports.createQuote = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.body.supplier);
    if (!supplier) throw new AppError("Supplier not found.", 404);
    if (req.body.product) {
        const product = await Product.findOne({
            _id: req.body.product,
            supplier: supplier._id,
            isActive: true,
        });
        if (!product)
            throw new AppError(
                "Product does not belong to the selected supplier.",
                400,
            );
    }
    const quote = await Quote.create({ ...req.body, customer: req.user._id });
    res.status(201).json({ success: true, quote });
});
exports.getQuotes = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.user.role === "customer") filter.customer = req.user._id;
    else if (req.user.role === "supplier") {
        const supplier = await Supplier.findOne({ user: req.user._id });
        if (!supplier) throw new AppError("Supplier profile not found.", 404);
        filter.supplier = supplier._id;
    }
    if (req.query.status) filter.status = req.query.status;
    const quotes = await Quote.find(filter)
        .populate("customer", "name email companyName")
        .populate("supplier", "companyName")
        .populate("product", "name material")
        .sort({ createdAt: -1 });
    res.json({ success: true, quotes });
});
exports.updateQuote = asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id);
    if (!quote) throw new AppError("Quote not found.", 404);
    const isCustomer = quote.customer.equals(req.user._id);
    const supplier =
        req.user.role === "supplier"
            ? await Supplier.findOne({ user: req.user._id })
            : null;
    const isSupplier = supplier && quote.supplier.equals(supplier._id);
    if (req.user.role !== "admin" && !isCustomer && !isSupplier)
        throw new AppError("You are not authorized to update this quote.", 403);
    if (isSupplier) {
        const allowed = [
            "quotedAmount",
            "currency",
            "leadTimeDays",
            "supplierMessage",
            "validUntil",
            "status",
        ];
        Object.keys(req.body).forEach((key) => {
            if (allowed.includes(key)) quote[key] = req.body[key];
        });
        if (req.body.status && !["quoted", "rejected"].includes(req.body.status))
            throw new AppError(
                "Supplier may only set quoted or rejected status.",
                400,
            );
    } else if (isCustomer) {
        if (!["accepted", "rejected", "cancelled"].includes(req.body.status))
            throw new AppError("Invalid customer quote status.", 400);
        quote.status = req.body.status;
    } else Object.assign(quote, req.body);
    await quote.save();
    res.json({ success: true, quote });
});
