const express = require("express");
const Cloth = require("../models/Cloth");
const Favorite = require("../models/Favorite");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const upload = require("../middleware/upload");
const { deleteUploadedFile } = require("../utils/files");

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

router.get("/", authenticate, async (_req, res) => {
  try {
    const clothes = await Cloth.find().sort({ createdAt: -1 });
    return res.json(clothes.map(formatCloth));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch clothes" });
  }
});

router.post(
  "/",
  authenticate,
  requireRole("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { clothName, clothType, brand, storeUrl } = req.body;

      if (!clothName || !clothType || !brand) {
        return res.status(400).json({ message: "clothName, clothType, and brand are required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const cloth = await Cloth.create({
        clothName,
        clothType,
        brand,
        storeUrl: storeUrl || "",
        imageUrl: `/uploads/cloths/${req.file.filename}`,
        createdBy: req.user._id,
      });

      return res.status(201).json(formatCloth(cloth));
    } catch (error) {
      if (req.file) {
        deleteUploadedFile(`/uploads/cloths/${req.file.filename}`);
      }
      return res.status(500).json({ message: "Failed to create cloth" });
    }
  }
);

router.patch(
  "/:id",
  authenticate,
  requireRole("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const cloth = await Cloth.findById(req.params.id);
      if (!cloth) {
        return res.status(404).json({ message: "Cloth not found" });
      }

      const { clothName, clothType, brand, storeUrl } = req.body;
      const previousImageUrl = cloth.imageUrl;

      if (clothName !== undefined) cloth.clothName = clothName;
      if (clothType !== undefined) cloth.clothType = clothType;
      if (brand !== undefined) cloth.brand = brand;
      if (storeUrl !== undefined) cloth.storeUrl = storeUrl;

      if (req.file) {
        cloth.imageUrl = `/uploads/cloths/${req.file.filename}`;
      }

      await cloth.save();

      if (req.file && previousImageUrl) {
        deleteUploadedFile(previousImageUrl);
      }

      return res.json(formatCloth(cloth));
    } catch (error) {
      if (req.file) {
        deleteUploadedFile(`/uploads/cloths/${req.file.filename}`);
      }
      return res.status(500).json({ message: "Failed to update cloth" });
    }
  }
);

router.delete("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id);
    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    await Favorite.deleteMany({ clothId: cloth._id });
    deleteUploadedFile(cloth.imageUrl);
    await cloth.deleteOne();

    return res.json({ message: "Cloth deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete cloth" });
  }
});

module.exports = router;
