import { Router } from "express";
import AuthRepository from "../repositories/auth.repository.js";
import AuthUsecase from "../usecases/auth.usecase.js";
import AuthController from "../controllers/auth.controller.js";

const router = Router();

const authRepo = new AuthRepository();
const authUsecase = new AuthUsecase(authRepo);
const authController = new AuthController(authUsecase);

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user and return JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid credentials
 */
