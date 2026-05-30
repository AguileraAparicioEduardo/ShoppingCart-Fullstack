const Product = require("./product.model");

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener productos" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, price, availability, image } = req.body;
    const product = await Product.create({ name, category, price, availability, image });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear producto" });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    await product.update({ availability: req.body.availability });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    await product.destroy();
    res.json({ success: true, message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar" });
  }
};

module.exports = { getAllProductsAdmin, createProduct, updateAvailability, deleteProduct };