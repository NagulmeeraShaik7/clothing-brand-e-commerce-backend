import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "./products.seed.js";
import Product from "../apps/products/models/product.model.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "clothing_ecom" });
  console.log("Connected to DB for seeding");

  // clear products and insert
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Inserted products:", products.length);

  await mongoose.disconnect();
  console.log("Disconnected");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
