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
  // The cookie is the primary session. The response token is a fallback for
  // deployed browsers that block third-party cookies between Vercel and Render.
  res.status(statusCode).json({ success: true, token, user: user.toJSON() });
};
module.exports = sendTokenResponse;
