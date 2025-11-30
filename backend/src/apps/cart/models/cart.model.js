import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String, enum: ["S", "M", "L", "XL"], required: true },
  quantity: { type: Number, default: 1, min: 1 }
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    cartToken: { type: String, default: null, index: true }, // for guests
    items: [CartItemSchema]
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 });
cartSchema.index({ cartToken: 1 });

export default mongoose.model("Cart", cartSchema);
