import OrderRepository from "../repositories/order.repository.js";
import CartRepository from "../../cart/repositories/cart.repository.js";
import ProductRepository from "../../products/repositories/product.repository.js";
import nodemailer from "nodemailer";

class OrderUsecase {
  constructor(orderRepo) {
    this.orderRepo = orderRepo;
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
    // simple nodemailer transport
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    // Log transporter setup (do not print sensitive values)
    try {
      const usingSmtp = Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
      console.log(`[OrderUsecase] Nodemailer transporter created. usingSmtp=${usingSmtp} host=${process.env.EMAIL_HOST || 'none'} port=${process.env.EMAIL_PORT || 'default'}`);
    } catch (e) {
      console.log('[OrderUsecase] Nodemailer transporter created (details unavailable)');
    }
  }

  async checkout({ user, cartToken, shipping = {} }) {
    if (!user) {
      const e = new Error("Login required for checkout");
      e.status = 401;
      throw e;
    }

    // get user cart
    const cart = await this.cartRepo.findByUser(user._id);
    if (!cart || !cart.items.length) {
      const e = new Error("Cart is empty");
      e.status = 400;
      throw e;
    }

    // build order items
    const items = [];
    let total = 0;
    for (const it of cart.items) {
      const product = await this.productRepo.findById(it.product);
      if (!product) continue;
      const price = product.price;
      items.push({ product: product._id, name: product.name, price, size: it.size, quantity: it.quantity });
      total += price * it.quantity;
    }

    // create order
    const order = await this.orderRepo.create({ user: user._id, items, total, status: "Completed" });

    // clear cart
    await this.cartRepo.upsertByUser(user._id, { items: [] });

    // send email
    try {
      await this.sendOrderConfirmationEmail(user.email, { order, items, total });
    } catch (err) {
      console.error("Failed to send order email:", err);
    }

    return order;
  }

  async sendOrderConfirmationEmail(email, { order, items, total }) {
    const orderDate = order.createdAt.toISOString();
    const orderId = order._id.toString();
    const itemsHtml = items
      .map((i) => `<li>${i.name} - Size: ${i.size} - Qty: ${i.quantity} - Price: ${i.price}</li>`)
      .join("");

    const html = `
      <h3>Order Confirmation</h3>
      <p>Order ID: ${orderId}</p>
      <p>Order Date: ${orderDate}</p>
      <ul>${itemsHtml}</ul>
      <p>Total: ${total}</p>
      <p>Thank you for shopping with us!</p>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Order Confirmation - ${orderId}`,
      html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[OrderUsecase] Order confirmation email sent. orderId=${orderId} to=${email} messageId=${info.messageId || info.messageId}`);
      // If using Ethereal or transport that supports preview URLs, print it
      try {
        const preview = nodemailer.getTestMessageUrl(info);
        if (preview) console.log(`[OrderUsecase] Preview URL: ${preview}`);
      } catch (e) {
        // ignore if getTestMessageUrl unavailable
      }
      return info;
    } catch (err) {
      console.error(`[OrderUsecase] Failed to send order email for orderId=${orderId}:`, err && err.message ? err.message : err);
      throw err;
    }
  }

  async listByUser(user) {
    return this.orderRepo.listByUser(user._id);
  }
}

export default OrderUsecase;
