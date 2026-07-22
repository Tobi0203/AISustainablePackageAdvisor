const generateToken = require("./generateToken");

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const days = Number(process.env.COOKIE_EXPIRES_DAYS || 7);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: days * 24 * 60 * 60 * 1000,
  });
  res.status(statusCode).json({ success: true, user: user.toJSON() });
};
module.exports = sendTokenResponse;
