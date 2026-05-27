const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clothId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cloth",
      required: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, clothId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
