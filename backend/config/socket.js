const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Quote = require("../models/Quote");
const Supplier = require("../models/Supplier");

const readCookie = (header = "", name) => header.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1);

const canAccessQuote = async (quoteId, user) => {
  const quote = await Quote.findById(quoteId);
  if (!quote) return false;
  if (user.role === "admin" || quote.customer.equals(user._id)) return true;
  if (user.role !== "supplier") return false;
  const supplier = await Supplier.findOne({ user: user._id });
  return Boolean(supplier && quote.supplier.equals(supplier._id));
};

const configureSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = readCookie(socket.handshake.headers.cookie, "token");
      if (!token) return next(new Error("Authentication required."));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) return next(new Error("User account is unavailable."));
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid authentication token."));
    }
  });

  io.on("connection", (socket) => {
    socket.on("quote:join", async (quoteId) => {
      if (await canAccessQuote(quoteId, socket.user)) socket.join(`quote:${quoteId}`);
    });
    socket.on("quote:leave", (quoteId) => socket.leave(`quote:${quoteId}`));
  });
};

module.exports = configureSocket;
