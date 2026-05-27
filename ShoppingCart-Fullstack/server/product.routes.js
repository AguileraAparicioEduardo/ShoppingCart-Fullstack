const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateAvailability,
  deleteProduct,
} = require("./product.controller");

const {
  validateIdParam,
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchAvailability,
} = require("./expressValidator.middleware");

const { zodValidateBody, zodValidateParams } = require("./zodValidator.middleware");
const {
  createProductSchema,
  updateProductSchema,
  patchAvailabilitySchema,
  idParamSchema,
} = require("./product.zod");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and availability API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid ID
 */
router.get("/:id", validateIdParam, zodValidateParams(idParamSchema), getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "Wireless Headphones"
 *             price: 149.99
 *             availability: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", validateCreateProduct, zodValidateBody(createProductSchema), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product completely
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation errors
 */
router.put(
  "/:id",
  validateIdParam,
  validateUpdateProduct,
  zodValidateParams(idParamSchema),
  zodValidateBody(updateProductSchema),
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}/availability:
 *   patch:
 *     summary: Update product availability only
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - availability
 *             properties:
 *               availability:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Availability updated
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error
 */
router.patch(
  "/:id/availability",
  validateIdParam,
  validatePatchAvailability,
  zodValidateParams(idParamSchema),
  zodValidateBody(patchAvailabilitySchema),
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", validateIdParam, zodValidateParams(idParamSchema), deleteProduct);

module.exports = router;
