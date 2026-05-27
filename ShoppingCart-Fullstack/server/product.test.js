const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/database");
const Product = require("../src/models/product.model");

// ──────────────────────────────────────────────
// INTEGRATION TESTS — run against a real test DB
// These tests use supertest to send HTTP requests to the Express app
// and Jest as the test framework/assertion library.
//
// SETUP: Set DB_NAME to a test database in .env.test, or these
//        tests will run against your dev DB.
// ──────────────────────────────────────────────

let testProduct;

beforeAll(async () => {
  // Connect and sync the test database
  await db.authenticate();
  await db.sync({ force: true }); // Fresh tables for tests
});

afterAll(async () => {
  await db.close();
});

afterEach(async () => {
  // Clean up between tests
  await Product.destroy({ where: {}, truncate: true });
});

// Helper to create a product directly via the model
const createTestProduct = async (overrides = {}) => {
  return Product.create({
    name: "Test Product",
    price: 99.99,
    availability: true,
    ...overrides,
  });
};

// ─── GET /api/products ───────────────────────
describe("GET /api/products", () => {
  it("should return an empty array when no products exist", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  it("should return all products", async () => {
    await createTestProduct({ name: "Product A", price: 10 });
    await createTestProduct({ name: "Product B", price: 20 });

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.count).toBe(2);
  });
});

// ─── GET /api/products/:id ───────────────────
describe("GET /api/products/:id", () => {
  it("should return a product by ID", async () => {
    const product = await createTestProduct();

    const res = await request(app).get(`/api/products/${product.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(product.id);
    expect(res.body.data.name).toBe("Test Product");
  });

  it("should return 404 if product not found", async () => {
    const res = await request(app).get("/api/products/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if ID is not a valid integer", async () => {
    const res = await request(app).get("/api/products/abc");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── POST /api/products ──────────────────────
describe("POST /api/products", () => {
  it("should create a new product successfully", async () => {
    const payload = { name: "New Laptop", price: 1299.99, availability: true };

    const res = await request(app).post("/api/products").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("New Laptop");
    expect(parseFloat(res.body.data.price)).toBe(1299.99);
    expect(res.body.data.availability).toBe(true);
  });

  it("should default availability to true if not provided", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Keyboard", price: 49.99 });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.availability).toBe(true);
  });

  it("should return 400 if name is missing", async () => {
    const res = await request(app).post("/api/products").send({ price: 99.99 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 if price is missing", async () => {
    const res = await request(app).post("/api/products").send({ name: "Monitor" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if price is negative", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Monitor", price: -10 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if name is too short", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "A", price: 10 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── PUT /api/products/:id ───────────────────
describe("PUT /api/products/:id", () => {
  it("should update a product fully", async () => {
    const product = await createTestProduct();

    const res = await request(app)
      .put(`/api/products/${product.id}`)
      .send({ name: "Updated Product", price: 199.99, availability: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Product");
    expect(res.body.data.availability).toBe(false);
  });

  it("should return 404 if product not found on update", async () => {
    const res = await request(app)
      .put("/api/products/999999")
      .send({ name: "Ghost", price: 1 });

    expect(res.statusCode).toBe(404);
  });

  it("should return 400 on invalid ID", async () => {
    const res = await request(app)
      .put("/api/products/not-an-id")
      .send({ name: "Test", price: 10 });

    expect(res.statusCode).toBe(400);
  });
});

// ─── PATCH /api/products/:id/availability ────
describe("PATCH /api/products/:id/availability", () => {
  it("should update only availability", async () => {
    const product = await createTestProduct({ availability: true });

    const res = await request(app)
      .patch(`/api/products/${product.id}/availability`)
      .send({ availability: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.availability).toBe(false);
    // Name should remain unchanged
    expect(res.body.data.name).toBe("Test Product");
  });

  it("should return 400 if availability is not boolean", async () => {
    const product = await createTestProduct();

    const res = await request(app)
      .patch(`/api/products/${product.id}/availability`)
      .send({ availability: "yes" });

    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if product not found", async () => {
    const res = await request(app)
      .patch("/api/products/999999/availability")
      .send({ availability: false });

    expect(res.statusCode).toBe(404);
  });
});

// ─── DELETE /api/products/:id ────────────────
describe("DELETE /api/products/:id", () => {
  it("should delete a product", async () => {
    const product = await createTestProduct();

    const res = await request(app).delete(`/api/products/${product.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it's gone
    const deleted = await Product.findByPk(product.id);
    expect(deleted).toBeNull();
  });

  it("should return 404 if product not found", async () => {
    const res = await request(app).delete("/api/products/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─── Health check ─────────────────────────────
describe("GET /api/health", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/api/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("running");
  });
});

// ─── 404 for unknown routes ───────────────────
describe("Unknown routes", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/unknown");

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
