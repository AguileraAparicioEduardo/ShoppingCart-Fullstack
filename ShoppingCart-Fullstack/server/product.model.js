const { DataTypes } = require("sequelize");
const db = require("./database");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: "Laptop Pro 15"
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product in USD
 *           example: 999.99
 *         availability:
 *           type: boolean
 *           description: Whether the product is available in stock
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: "Laptop Pro 15"
 *         price:
 *           type: number
 *           format: float
 *           example: 999.99
 *         availability:
 *           type: boolean
 *           example: true
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */

const Product = db.define("products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Product name cannot be empty" },
      len: {
        args: [2, 100],
        msg: "Product name must be between 2 and 100 characters",
      },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "Price must be a valid number" },
      min: { args: [0], msg: "Price cannot be negative" },
    },
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Product;
