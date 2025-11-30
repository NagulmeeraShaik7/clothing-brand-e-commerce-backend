import Order from "../models/order.model.js";

class OrderRepository {
  async create(order) {
    const o = new Order(order);
    return o.save();
  }

  async listByUser(userId) {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return Order.findById(id).populate("items.product");
  }
}

export default OrderRepository;
