/**
 * AuthController - Handles authentication requests (register, login).
 *
 * @class AuthController
 * @param {AuthUsecase} authUsecase - Injected authentication business logic
 */
class AuthController {
  constructor(authUsecase) {
    this.authUsecase = authUsecase;
  }

  /**
   * Register a new user.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.body - { name, email, password, role }
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends 201 with { success: true, data: user }
   */
  register = async (req, res, next) => {
    try {
      const data = req.body;
      const result = await this.authUsecase.register(data);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Login user and issue JWT token.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.body - { email, password }
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sets httpOnly cookie and sends { success: true, data: { token, user } }
   */
  login = async (req, res, next) => {
    try {
      const result = await this.authUsecase.login(req.body);
      // send token as cookie and response
      res.cookie("token", result.token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;
