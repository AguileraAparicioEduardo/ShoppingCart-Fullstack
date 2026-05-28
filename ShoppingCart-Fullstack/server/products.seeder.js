"use strict";
const { Sequelize } = require("sequelize");
require("dotenv").config();
const db = require("./database");
const Product = require("./product.model");

const products = [
  {
    name: "Chocolate Lava Cake",
    category: "Cake",
    price: 7.50,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-lava-cake-mobile.jpg",
      mobile: "/assets/images/image-lava-cake-mobile.jpg",
      tablet: "/assets/images/image-lava-cake-mobile.jpg",
      desktop: "/assets/images/image-lava-cake-mobile.jpg"
    }
  },
  {
    name: "Strawberry Cheesecake",
    category: "Cheesecake",
    price: 6.50,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-cheesecake-mobile.jpg",
      mobile: "/assets/images/image-cheesecake-mobile.jpg",
      tablet: "/assets/images/image-cheesecake-mobile.jpg",
      desktop: "/assets/images/image-cheesecake-mobile.jpg"
    }
  },
  {
    name: "Mango Panna Cotta",
    category: "Panna Cotta",
    price: 5.50,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-mango-panna-cotta-mobile.jpg",
      mobile: "/assets/images/image-mango-panna-cotta-mobile.jpg",
      tablet: "/assets/images/image-mango-panna-cotta-mobile.jpg",
      desktop: "/assets/images/image-mango-panna-cotta-mobile.jpg"
    }
  },
  {
    name: "Churros con Chocolate",
    category: "Churros",
    price: 4.00,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-churros-mobile.jpg",
      mobile: "/assets/images/image-churros-mobile.jpg",
      tablet: "/assets/images/image-churros-mobile.jpg",
      desktop: "/assets/images/image-churros-mobile.jpg"
    }
  },
  {
    name: "Tres Leches Cake",
    category: "Cake",
    price: 5.00,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-tres-leches-mobile.jpg",
      mobile: "/assets/images/image-tres-leches-mobile.jpg",
      tablet: "/assets/images/image-tres-leches-mobile.jpg",
      desktop: "/assets/images/image-tres-leches-mobile.jpg"
    }
  },
  {
    name: "Banana Foster",
    category: "Dessert",
    price: 6.00,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-banana-foster-mobile.jpg",
      mobile: "/assets/images/image-banana-foster-mobile.jpg",
      tablet: "/assets/images/image-banana-foster-mobile.jpg",
      desktop: "/assets/images/image-banana-foster-mobile.jpg"
    }
  },
  {
    name: "Coconut Macaroons",
    category: "Macaroon",
    price: 4.50,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-coconut-macaroon-mobile.jpg",
      mobile: "/assets/images/image-coconut-macaroon-mobile.jpg",
      tablet: "/assets/images/image-coconut-macaroon-mobile.jpg",
      desktop: "/assets/images/image-coconut-macaroon-mobile.jpg"
    }
  },
  {
    name: "Crème Caramel",
    category: "Flan",
    price: 5.00,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-creme-caramel-mobile.jpg",
      mobile: "/assets/images/image-creme-caramel-mobile.jpg",
      tablet: "/assets/images/image-creme-caramel-mobile.jpg",
      desktop: "/assets/images/image-creme-caramel-mobile.jpg"
    }
  },
  {
    name: "Berry Pavlova",
    category: "Pavlova",
    price: 8.00,
    availability: true,
    image: {
      thumbnail: "/assets/images/image-berry-pavlova-mobile.jpg",
      mobile: "/assets/images/image-berry-pavlova-mobile.jpg",
      tablet: "/assets/images/image-berry-pavlova-mobile.jpg",
      desktop: "/assets/images/image-berry-pavlova-mobile.jpg"
    }
  }
];

const seed = async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected");

    await db.sync({ alter: true });
    console.log("✅ Tables synchronized");

    await Product.truncate();
    console.log("🗑️  Existing products cleared");

    const created = await Product.bulkCreate(products);
    console.log(`🌱 Seeded ${created.length} products:`);
    created.forEach(p => console.log(`   - [${p.id}] ${p.name}`));

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();