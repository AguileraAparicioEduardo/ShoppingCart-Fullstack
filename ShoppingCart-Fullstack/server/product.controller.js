const Product = require("./product.model");

// GET /api/products - Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

// GET /api/products/:id - Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};

// POST /api/products - Create new product
const createProduct = async (req, res) => {
  try {
    const { name, price, availability } = req.body;

    const product = await Product.create({ name, price, availability });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Sequelize validation error
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating product",
    });
  }
};

// PUT /api/products/:id - Full update of a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, availability } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`,
      });
    }

    await product.update({ name, price, availability });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};

// PATCH /api/products/:id/availability - Toggle/update availability only
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`,
      });
    }

    await product.update({ availability });

    res.status(200).json({
      success: true,
      message: `Product availability updated to ${availability}`,
      data: product,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product availability",
    });
  }
};

// DELETE /api/products/:id - Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`,
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: `Product with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateAvailability,
  deleteProduct,
};
