require("dotenv").config();
const app = require("./app");
const db = require("./database");

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Test database connection
    await db.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    // Sync models — creates tables if they don't exist
    // Use { force: true } to drop & recreate tables (dev only!)
    // Use { alter: true } to update table schema without dropping data
    await db.sync({ alter: true });
    console.log("✅ Database models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Docs:    http://localhost:${PORT}/api/docs`);
      console.log(`🏥 Health:      http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
