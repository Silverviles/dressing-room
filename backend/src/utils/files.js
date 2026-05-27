const fs = require("fs");
const path = require("path");

const uploadsRoot = path.join(__dirname, "../../uploads");

const deleteUploadedFile = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) {
    return;
  }

  const relativePath = imageUrl.replace("/uploads/", "");
  const filePath = path.join(uploadsRoot, relativePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { deleteUploadedFile };
