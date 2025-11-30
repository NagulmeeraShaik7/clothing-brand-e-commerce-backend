import { Router } from "express";
import CartRepository from "../repositories/cart.repository.js";
import CartUsecase from "../usecases/cart.usecase.js";
import CartController from "../controllers/cart.controller.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";

const router = Router();

const cartRepo = new CartRepository();
const cartUsecase = new CartUsecase(cartRepo);
const cartController = new CartController(cartUsecase);

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/add", cartController.addItem);
router.put("/update", cartController.updateItem);
router.post("/remove", cartController.removeItem);
router.post("/clear", cartController.clear);

export default router;

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations (guest and authenticated)
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current cart for user or guest
 *     parameters:
 *       - in: header
 *         name: x-cart-token
 *         schema:
 *           type: string
 *         description: Guest cart token
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Bearer token for authenticated user
 *     responses:
 *       200:
 *         description: Cart object
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               size:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated cart
 */

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item quantity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated cart
 */

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated cart
 */

/**
 * @swagger
 * /api/cart/clear:
 *   post:
 *     tags: [Cart]
 *     summary: Clear the current cart
 *     responses:
 *       200:
 *         description: Empty cart
 */
