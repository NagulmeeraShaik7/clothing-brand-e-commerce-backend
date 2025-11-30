import Cart from "../models/cart.model.js";

class CartRepository {
  async findByUser(userId) {
    return Cart.findOne({ user: userId }).populate("items.product");
  }

  async findByToken(token) {
    return Cart.findOne({ cartToken: token }).populate("items.product");
  }

  async createCart(payload) {
    const c = new Cart(payload);
    return c.save();
  }

  async upsertByUser(userId, payload) {
    return Cart.findOneAndUpdate({ user: userId }, { $set: payload }, { upsert: true, new: true }).populate(
      "items.product"
    );
  }

  async upsertByToken(token, payload) {
    return Cart.findOneAndUpdate({ cartToken: token }, { $set: payload }, { upsert: true, new: true }).populate(
      "items.product"
    );
  }

  async deleteById(id) {
    return Cart.findByIdAndDelete(id);
  }

  async save(cart) {
    return cart.save();
  }
}

export default CartRepository;
