const parseOrigins = () => [
  ...(process.env.CLIENT_URL || "").split(","),
  ...(process.env.ADDITIONAL_CLIENT_URLS || "").split(","),
]
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = parseOrigins();
    const normalizedOrigin = origin?.replace(/\/$/, "");

    // Non-browser requests (health checks, curl, Render probes) do not send Origin.
    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) return callback(null, true);

    return callback(new Error(`CORS origin not allowed: ${normalizedOrigin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
