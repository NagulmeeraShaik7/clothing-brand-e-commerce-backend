import { Router } from "express";
import OrderRepository from "../repositories/order.repository.js";
import OrderUsecase from "../usecases/order.usecase.js";
import OrderController from "../controllers/order.controller.js";
import { authenticate, requireAuth } from "../../../middlewares/auth.middleware.js";

const router = Router();

const orderRepo = new OrderRepository();
const orderUsecase = new OrderUsecase(orderRepo);
const orderController = new OrderController(orderUsecase);

router.use(authenticate);

router.post("/checkout", requireAuth, orderController.checkout);
router.get("/", requireAuth, orderController.list);

export default router;

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order and checkout operations
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     tags: [Orders]
 *     summary: Checkout and create an order (requires auth)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipping:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *     responses:
 *       201:
 *         description: Order created
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: List orders for the authenticated user
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Authentication required
 */
