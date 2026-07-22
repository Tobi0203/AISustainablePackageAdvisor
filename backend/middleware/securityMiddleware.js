const sanitize = (value) => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== "object") return value;
  return Object.entries(value).reduce((safe, [key, child]) => {
    if (!key.startsWith("$") && !key.includes(".")) safe[key] = sanitize(child);
    return safe;
  }, {});
};

const sanitizeRequest = (req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
};

module.exports = { sanitizeRequest };
