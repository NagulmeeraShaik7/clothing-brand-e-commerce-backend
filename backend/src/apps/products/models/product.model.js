import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    image: { type: String, required: false },
    category: { type: String, required: true, enum: ["Men", "Women", "Kids"], index: true },
    sizes: [{ type: String, enum: ["S", "M", "L", "XL"] }],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
