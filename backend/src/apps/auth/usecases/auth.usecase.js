import jwt from "jsonwebtoken";

class AuthUsecase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async register({ name, email, password, role }) {
    const existing = await this.authRepository.findByEmail(email);
    if (existing) {
      const e = new Error("Email already registered");
      e.status = 400;
      throw e;
    }
    const user = await this.authRepository.createUser({ name, email, password, role });
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  }

  async login({ email, password }) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      const e = new Error("Invalid email or password");
      e.status = 400;
      throw e;
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      const e = new Error("Invalid email or password");
      e.status = 400;
      throw e;
    }
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  }
}

export default AuthUsecase;
