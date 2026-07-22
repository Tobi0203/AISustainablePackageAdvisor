const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Supplier = require("../models/Supplier");
const AppError = require("../utils/AppError");
const sendTokenResponse = require("../utils/sendTokenResponse");

exports.register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role = "customer",
    companyName,
    phone,
  } = req.body;
  if (role === "admin")
    throw new AppError(
      "Administrator accounts cannot be self-registered.",
      403,
    );
  if (await User.findOne({ email }))
    throw new AppError("An account with this email already exists.", 409);
  const user = await User.create({
    name,
    email,
    password,
    role,
    companyName,
    phone,
  });
  if (role === "supplier")
    await Supplier.create({
      user: user._id,
      companyName: companyName || name,
      phone,
    });
  sendTokenResponse(user, 201, res);
});
exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password",
  );
  if (!user || !(await user.matchPassword(req.body.password)))
    throw new AppError("Invalid email or password.", 401);
  if (!user.isActive)
    throw new AppError("This account has been deactivated.", 403);
  sendTokenResponse(user, 200, res);
});
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ success: true, message: "Logged out successfully." });
};
exports.me = asyncHandler(async (req, res) => {
  const supplier =
    req.user.role === "supplier"
      ? await Supplier.findOne({ user: req.user._id })
      : null;
  res.json({ success: true, user: req.user, supplier });
});
