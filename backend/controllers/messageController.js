const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const Quote = require("../models/Quote");
const Supplier = require("../models/Supplier");
const AppError = require("../utils/AppError");

const getAccessibleQuote = async (quoteId, user) => {
  const quote = await Quote.findById(quoteId);
  if (!quote) throw new AppError("Quote not found.", 404);
  if (user.role === "admin" || quote.customer.equals(user._id)) return quote;
  if (user.role === "supplier") {
    const supplier = await Supplier.findOne({ user: user._id });
    if (supplier && quote.supplier.equals(supplier._id)) return quote;
  }
  throw new AppError("You are not authorized to access this conversation.", 403);
};

exports.getMessages = asyncHandler(async (req, res) => {
  await getAccessibleQuote(req.params.quoteId, req.user);
  const messages = await Message.find({ quote: req.params.quoteId }).populate("sender", "name role companyName").sort({ createdAt: 1 });
  res.json({ success: true, messages });
});

exports.createMessage = asyncHandler(async (req, res) => {
  await getAccessibleQuote(req.params.quoteId, req.user);
  const message = await Message.create({ quote: req.params.quoteId, sender: req.user._id, body: req.body.body });
  await message.populate("sender", "name role companyName");
  req.app.get("io")?.to(`quote:${req.params.quoteId}`).emit("message:new", message);
  res.status(201).json({ success: true, message });
});
