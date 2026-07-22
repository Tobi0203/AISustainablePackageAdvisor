const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) token = auth.split(" ")[1];
  if (!token) token = req.cookies.token;
  if (!token) throw new AppError("Authentication is required.", 401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user || !req.user.isActive)
      throw new AppError("User account is unavailable.", 401);
    next();
  } catch (error) {
    if (error.isOperational) throw error;
    throw new AppError("Invalid or expired authentication token.", 401);
  }
});

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You are not authorized for this action.", 403));
    next();
  };
module.exports = { protect, authorize };
