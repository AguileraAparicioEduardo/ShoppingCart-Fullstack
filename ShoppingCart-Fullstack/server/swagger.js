const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product Manager API",
      version: "1.0.0",
      description:
        "REST API for managing products and checking their availability. Built with Express, Sequelize, and PostgreSQL (PERN Stack).",
      contact: {
        name: "Product Manager Dev Team",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Serve Swagger UI
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve raw JSON spec
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`📚 Swagger docs available at http://localhost:${process.env.PORT || 4000}/api/docs`);
};

module.exports = { swaggerDocs };
