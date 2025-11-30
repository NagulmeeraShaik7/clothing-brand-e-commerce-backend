import jwt from "jsonwebtoken";
import AuthRepository from "../apps/auth/repositories/auth.repository.js";

const authRepo = new AuthRepository();

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.cookies?.token;
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    if (!token) return next();

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authRepo.findById(payload.id);
    if (!user) return next();

    req.user = user;
    next();
  } catch (err) {
    // invalid token => continue as guest by not setting req.user
    req.user = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    const e = new Error("Authentication required");
    e.status = 401;
    return next(e);
  }
  next();
}

export function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      const e = new Error("Authentication required");
      e.status = 401;
      return next(e);
    }
    if (roles.length && !roles.includes(req.user.role)) {
      const e = new Error("Forbidden");
      e.status = 403;
      return next(e);
    }
    next();
  };
}
