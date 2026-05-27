const {
  createProductSchema,
  updateProductSchema,
  patchAvailabilitySchema,
  idParamSchema,
} = require("../src/validators/product.zod");

describe("createProductSchema", () => {
  it("should pass with valid data", () => {
    const result = createProductSchema.safeParse({
      name: "Laptop",
      price: 999.99,
      availability: true,
    });
    expect(result.success).toBe(true);
  });

  it("should default availability to true", () => {
    const result = createProductSchema.safeParse({ name: "Mouse", price: 25 });
    expect(result.success).toBe(true);
    expect(result.data.availability).toBe(true);
  });

  it("should fail if name is missing", () => {
    const result = createProductSchema.safeParse({ price: 10 });
    expect(result.success).toBe(false);
  });

  it("should fail if name is too short", () => {
    const result = createProductSchema.safeParse({ name: "X", price: 10 });
    expect(result.success).toBe(false);
  });

  it("should fail if price is missing", () => {
    const result = createProductSchema.safeParse({ name: "Keyboard" });
    expect(result.success).toBe(false);
  });

  it("should fail if price is zero", () => {
    const result = createProductSchema.safeParse({ name: "Keyboard", price: 0 });
    expect(result.success).toBe(false);
  });

  it("should fail if price is negative", () => {
    const result = createProductSchema.safeParse({ name: "Keyboard", price: -5 });
    expect(result.success).toBe(false);
  });

  it("should trim whitespace from name", () => {
    const result = createProductSchema.safeParse({ name: "  Monitor  ", price: 300 });
    expect(result.success).toBe(true);
    expect(result.data.name).toBe("Monitor");
  });
});

describe("updateProductSchema", () => {
  it("should pass with all fields optional", () => {
    const result = updateProductSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should pass with partial data", () => {
    const result = updateProductSchema.safeParse({ price: 49.99 });
    expect(result.success).toBe(true);
  });

  it("should fail if name is too long", () => {
    const result = updateProductSchema.safeParse({ name: "A".repeat(101) });
    expect(result.success).toBe(false);
  });
});

describe("patchAvailabilitySchema", () => {
  it("should pass with true", () => {
    const result = patchAvailabilitySchema.safeParse({ availability: true });
    expect(result.success).toBe(true);
  });

  it("should pass with false", () => {
    const result = patchAvailabilitySchema.safeParse({ availability: false });
    expect(result.success).toBe(true);
  });

  it("should fail if availability is a string", () => {
    const result = patchAvailabilitySchema.safeParse({ availability: "yes" });
    expect(result.success).toBe(false);
  });

  it("should fail if availability is missing", () => {
    const result = patchAvailabilitySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("idParamSchema", () => {
  it("should coerce string '5' to number 5", () => {
    const result = idParamSchema.safeParse({ id: "5" });
    expect(result.success).toBe(true);
    expect(result.data.id).toBe(5);
  });

  it("should fail if id is 0", () => {
    const result = idParamSchema.safeParse({ id: "0" });
    expect(result.success).toBe(false);
  });

  it("should fail if id is alphabetic", () => {
    const result = idParamSchema.safeParse({ id: "abc" });
    expect(result.success).toBe(false);
  });
});
