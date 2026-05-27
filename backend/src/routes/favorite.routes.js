const express = require("express");
const Favorite = require("../models/Favorite");
const Cloth = require("../models/Cloth");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

const formatCloth = (cloth) => ({
  id: cloth._id.toString(),
  clothName: cloth.clothName,
  clothType: cloth.clothType,
  brand: cloth.brand,
  imageUrl: cloth.imageUrl,
  storeUrl: cloth.storeUrl || "",
  createdBy: cloth.createdBy?.toString?.() || cloth.createdBy,
  createdAt: cloth.createdAt,
  updatedAt: cloth.updatedAt,
});

router.get("/", authenticate, requireRole("user", "admin"), async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate("clothId")
      .sort({ createdAt: -1 });

    const clothes = favorites
      .filter((favorite) => favorite.clothId)
      .map((favorite) => formatCloth(favorite.clothId));

    return res.json(clothes);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

router.post("/:clothId", authenticate, requireRole("user", "admin"), async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.clothId);
    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    const existing = await Favorite.findOne({
      userId: req.user._id,
      clothId: cloth._id,
    });

    if (existing) {
      return res.status(200).json({ message: "Already favorited" });
    }

    await Favorite.create({
      userId: req.user._id,
      clothId: cloth._id,
    });

    return res.status(201).json({ message: "Favorite added" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add favorite" });
  }
});

router.delete("/:clothId", authenticate, requireRole("user", "admin"), async (req, res) => {
  try {
    const result = await Favorite.findOneAndDelete({
      userId: req.user._id,
      clothId: req.params.clothId,
    });

    if (!result) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.json({ message: "Favorite removed" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove favorite" });
  }
});

module.exports = router;
