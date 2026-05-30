const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyToken, verifyAdmin } = require("./auth.middleware");
const {
  getAllProductsAdmin,
  createProduct,
  updateAvailability,
  deleteProduct,
} = require("./admin.controller");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

// Todas las rutas requieren token + rol admin
router.use(verifyToken, verifyAdmin);

router.get("/products", getAllProductsAdmin);

// Upload imagen + crear producto en un solo request
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, availability } = req.body;
    const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

    let imageObj = null;
    if (req.file) {
      const url = `${BASE_URL}/images/${req.file.filename}`;
      imageObj = { thumbnail: url, mobile: url, tablet: url, desktop: url };
    }

    const Product = require("./product.model");
    const product = await Product.create({
      name,
      category,
      price: parseFloat(price),
      availability: availability === "true" || availability === true,
      image: imageObj,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al crear producto" });
  }
});

router.patch("/products/:id/availability", updateAvailability);
router.delete("/products/:id", deleteProduct);

module.exports = router;