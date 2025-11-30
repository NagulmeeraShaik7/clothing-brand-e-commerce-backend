import { v4 as uuidv4 } from "uuid";
import ProductRepository from "../../products/repositories/product.repository.js";

class CartUsecase {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
    this.productRepo = new ProductRepository();
  }

  // returns cartToken always (for guests)
  async getCart({ user, cartToken }) {
    if (user) {
      let cart = await this.cartRepository.findByUser(user._id);
      if (!cart) cart = await this.cartRepository.createCart({ user: user._id, items: [] });
      return cart;
    } else {
      if (!cartToken) cartToken = uuidv4();
      let cart = await this.cartRepository.findByToken(cartToken);
      if (!cart) cart = await this.cartRepository.createCart({ cartToken, items: [] });
      return cart;
    }
  }

  /**
   * Add item: productId, size, quantity
   */
  async addItem({ user, cartToken, productId, size, quantity = 1 }) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      const e = new Error("Product not found");
      e.status = 404;
      throw e;
    }

    let cart;
    if (user) {
      cart = await this.cartRepository.findByUser(user._id);
      if (!cart) cart = await this.cartRepository.createCart({ user: user._id, items: [] });
    } else {
      if (!cartToken) cartToken = uuidv4();
      cart = await this.cartRepository.findByToken(cartToken);
      if (!cart) cart = await this.cartRepository.createCart({ cartToken, items: [] });
    }

    const existing = cart.items.find(
      (it) => it.product.toString() === productId.toString() && it.size === size
    );
    if (existing) {
      existing.quantity = existing.quantity + quantity;
    } else {
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
    return cart;
  }

  async updateItem({ user, cartToken, itemId, quantity }) {
    let cart;
    if (user) cart = await this.cartRepository.findByUser(user._id);
    else cart = await this.cartRepository.findByToken(cartToken);

    if (!cart) {
      const e = new Error("Cart not found");
      e.status = 404;
      throw e;
    }

    const item = cart.items.id(itemId);
    if (!item) {
      const err = new Error("Cart item not found");
      err.status = 404;
      throw err;
    }
    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  async removeItem({ user, cartToken, itemId }) {
    let cart;
    if (user) cart = await this.cartRepository.findByUser(user._id);
    else cart = await this.cartRepository.findByToken(cartToken);

    if (!cart) {
      const e = new Error("Cart not found");
      e.status = 404;
      throw e;
    }

    // Use a safe removal approach that works whether items are mongoose subdocs or plain objects
    const beforeCount = cart.items.length;
    cart.items = cart.items.filter((it) => it._id.toString() !== itemId.toString());
    if (cart.items.length === beforeCount) {
      const err = new Error("Cart item not found");
      err.status = 404;
      throw err;
    }

    await cart.save();
    return cart;
  }

  async clearCart({ user, cartToken }) {
    if (user) {
      return this.cartRepository.upsertByUser(user._id, { items: [] });
    } else {
      return this.cartRepository.upsertByToken(cartToken, { items: [] });
    }
  }
}

export default CartUsecase;
