const { DataTypes } = require("sequelize");
const db = require("./database");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         thumbnail:
 *           type: string
 *           example: "./assets/images/image-waffle-thumbnail.jpg"
 *         mobile:
 *           type: string
 *           example: "./assets/images/image-waffle-mobile.jpg"
 *         tablet:
 *           type: string
 *           example: "./assets/images/image-waffle-tablet.jpg"
 *         desktop:
 *           type: string
 *           example: "./assets/images/image-waffle-desktop.jpg"
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
 *           example: "Waffle with Berries"
 *         category:
 *           type: string
 *           description: Product category
 *           example: "Waffle"
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product in USD
 *           example: 6.50
 *         availability:
 *           type: boolean
 *           description: Whether the product is available in stock
 *           example: true
 *         image:
 *           $ref: '#/components/schemas/ProductImage'
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
 *           example: "Waffle with Berries"
 *         category:
 *           type: string
 *           example: "Waffle"
 *         price:
 *           type: number
 *           format: float
 *           example: 6.50
 *         availability:
 *           type: boolean
 *           example: true
 *         image:
 *           $ref: '#/components/schemas/ProductImage'
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
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
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
  // Stored as JSON — Sequelize handles serialization automatically with JSONB (Postgres)
  image: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = Product;
