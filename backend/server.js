require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const hpp = require("hpp");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { sanitizeRequest } = require("./middleware/securityMiddleware");

const authRoutes = require("./routes/authRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const messageRoutes = require("./routes/messageRoutes");
const configureSocket = require("./config/socket");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true } });
configureSocket(io);
app.set("io", io);
connectDB();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());
app.use(sanitizeRequest);
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) =>
  res.status(200).json({ success: true, message: "API is running" }),
);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/quotes", quoteRoutes);
app.use("/api/v1/quotes", messageRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
if (require.main === module)
  httpServer.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app;
