/**
 * OrderController - Handles order checkout and retrieval.
 *
 * @class OrderController
 * @param {OrderUsecase} orderUsecase - Injected order business logic
 */
class OrderController {
  constructor(orderUsecase) {
    this.orderUsecase = orderUsecase;
  }

  /**
   * Checkout: create order from user cart and send confirmation email.
   * Requires authentication.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.user - Authenticated user (required)
   * @param {Object} req.body - { shipping }
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends 201 with { success: true, data: order }
   */
  checkout = async (req, res, next) => {
    try {
      const order = await this.orderUsecase.checkout({ user: req.user, cartToken: req.cookies?.cartToken });
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  };

  /**
   * List orders for the authenticated user.
   * Requires authentication.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.user - Authenticated user (required)
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends { success: true, data: orders }
   */
  list = async (req, res, next) => {
    try {
      const orders = await this.orderUsecase.listByUser(req.user);
      res.json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  };
}

export default OrderController;
