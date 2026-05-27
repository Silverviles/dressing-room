const express = require("express");
const PDFDocument = require("pdfkit");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const Cloth = require("../models/Cloth");
const Favorite = require("../models/Favorite");

const router = express.Router();

const sendPdf = (res, filename, buildPdf) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {
    const buffer = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  });

  buildPdf(doc);
  doc.end();
};

router.get("/cloths", authenticate, requireRole("admin"), async (_req, res) => {
  try {
    const clothes = await Cloth.find().sort({ createdAt: -1 });

    sendPdf(res, "cloth-inventory-report.pdf", (doc) => {
      doc.fontSize(18).text("Cloth Inventory Report", { align: "center" });
      doc.moveDown();
      doc.fontSize(10).text(`Generated at: ${new Date().toLocaleString()}`);
      doc.moveDown();

      clothes.forEach((cloth, index) => {
        doc
          .fontSize(12)
          .text(`${index + 1}. ${cloth.clothName} (${cloth.clothType})`, {
            underline: true,
          });
        doc.fontSize(10).text(`Brand: ${cloth.brand}`);
        doc.fontSize(10).text(`Store URL: ${cloth.storeUrl || "N/A"}`);
        doc.fontSize(10).text(`Added on: ${new Date(cloth.createdAt).toLocaleString()}`);
        doc.moveDown(0.8);
      });
    });
  } catch (_error) {
    res.status(500).json({ message: "Failed to generate cloth report" });
  }
});

router.get("/tryouts", authenticate, async (_req, res) => {
  try {
    const [favoriteStats, totalFavorites, totalClothes] = await Promise.all([
      Favorite.aggregate([
        { $group: { _id: "$clothId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Favorite.countDocuments(),
      Cloth.countDocuments(),
    ]);

    const clothIds = favoriteStats.map((item) => item._id);
    const cloths = await Cloth.find({ _id: { $in: clothIds } });
    const clothById = new Map(cloths.map((cloth) => [cloth._id.toString(), cloth]));

    sendPdf(res, "cloth-tryout-summary-report.pdf", (doc) => {
      doc.fontSize(18).text("Cloth Tryout Summary Report", { align: "center" });
      doc.moveDown();
      doc.fontSize(10).text(`Generated at: ${new Date().toLocaleString()}`);
      doc.fontSize(10).text(`Total clothes: ${totalClothes}`);
      doc.fontSize(10).text(`Total favorites: ${totalFavorites}`);
      doc.moveDown();

      if (favoriteStats.length === 0) {
        doc.fontSize(12).text("No tryout/favorite activity yet.");
        return;
      }

      favoriteStats.forEach((item, index) => {
        const cloth = clothById.get(item._id.toString());
        doc
          .fontSize(12)
          .text(`${index + 1}. ${cloth?.clothName || "Unknown cloth"} - ${item.count} favorites`);
        doc.fontSize(10).text(`Type: ${cloth?.clothType || "N/A"} | Brand: ${cloth?.brand || "N/A"}`);
        doc.moveDown(0.6);
      });
    });
  } catch (_error) {
    res.status(500).json({ message: "Failed to generate tryout report" });
  }
});

router.post("/recommendations", authenticate, async (req, res) => {
  try {
    const { items = [], filters = {} } = req.body || {};
    sendPdf(res, "outfit-recommendations-report.pdf", (doc) => {
      doc.fontSize(18).text("Outfit Recommendation Report", { align: "center" });
      doc.moveDown();
      doc.fontSize(10).text(`Generated at: ${new Date().toLocaleString()}`);
      doc.fontSize(10).text(
        `Filters: gender=${filters.gender || "Any"}, occasion=${filters.occasion || "Any"}, culture=${filters.culture || "Any"}`
      );
      doc.moveDown();

      if (!Array.isArray(items) || items.length === 0) {
        doc.fontSize(12).text("No matching recommendation items.");
        return;
      }

      items.forEach((item, index) => {
        doc.fontSize(12).text(`${index + 1}. ${item.name || "Unknown"}`);
        doc
          .fontSize(10)
          .text(`Gender: ${item.gender || "N/A"} | Occasion: ${item.occasion || "N/A"} | Culture: ${item.culture || "N/A"}`);
        doc.fontSize(10).text(`Image URL: ${item.imageUrl || "N/A"}`);
        doc.moveDown(0.6);
      });
    });
  } catch (_error) {
    res.status(500).json({ message: "Failed to generate recommendation report" });
  }
});

module.exports = router;
