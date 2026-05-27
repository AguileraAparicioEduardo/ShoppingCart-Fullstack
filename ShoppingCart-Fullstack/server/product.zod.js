const { z } = require("zod");

// Schema for creating a product
const createProductSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),

  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),

  availability: z.boolean().optional().default(true),
});

// Schema for updating a product (all fields optional)
const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim()
    .optional(),

  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places")
    .optional(),

  availability: z.boolean().optional(),
});

// Schema for PATCH availability only
const patchAvailabilitySchema = z.object({
  availability: z.boolean({ required_error: "availability must be a boolean" }),
});

// Schema for ID param validation
const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "ID must be a number" })
    .int("ID must be an integer")
    .positive("ID must be a positive integer"),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  patchAvailabilitySchema,
  idParamSchema,
};
