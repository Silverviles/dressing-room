const mongoose = require("mongoose");

const clothSchema = new mongoose.Schema(
  {
    clothName: {
      type: String,
      required: true,
      trim: true,
    },
    clothType: {
      type: String,
      required: true,
      enum: ["shirt", "pants", "shoes", "flock"],
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    storeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cloth", clothSchema);
