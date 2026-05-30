const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyToken, verifyAdmin } = require("./auth.middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

router.post("/", verifyToken, verifyAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No se subio ninguna imagen" });
  }
  const url = `${process.env.BASE_URL || "http://localhost:4000"}/images/${req.file.filename}`;
  res.json({ success: true, url });
});

module.exports = router;