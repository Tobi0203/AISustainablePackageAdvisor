const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    quote: { type: mongoose.Schema.Types.ObjectId, ref: "Quote", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

messageSchema.index({ quote: 1, createdAt: 1 });
module.exports = mongoose.model("Message", messageSchema);
