const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/AppError");
exports.updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "companyName", "phone"];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, user });
});
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
});
exports.setUserActive = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true },
  );
  if (!user) throw new AppError("User not found.", 404);
  res.json({ success: true, user });
});
