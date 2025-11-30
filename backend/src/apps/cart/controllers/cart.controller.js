/**
 * CartController - Handles shopping cart operations for authenticated and guest users.
 *
 * @class CartController
 * @param {CartUsecase} cartUsecase - Injected cart business logic
 */
class CartController {
  constructor(cartUsecase) {
    this.cartUsecase = cartUsecase;
  }

  /**
   * Get the current cart (guest or user cart).
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.user - Authenticated user (optional)
   * @param {string} req.cookies.cartToken - Guest cart token (optional)
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends { success: true, data: cart }
   */
  getCart = async (req, res, next) => {
    try {
      const cartToken = req.cookies?.cartToken || req.header("x-cart-token");
      console.log('[CartController] getCart incoming cartToken(cookie/header)=', cartToken);
      const cart = await this.cartUsecase.getCart({ user: req.user, cartToken });
      // ensure cartToken cookie for guest
      if (!req.user && !req.cookies?.cartToken) {
        // set cookie with lax sameSite so local dev/frontends can receive it
        res.cookie("cartToken", cart.cartToken, { maxAge: 30 * 24 * 3600 * 1000, httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        console.log('[CartController] set cartToken cookie=', cart.cartToken);
      }
      const cartObj = cart && typeof cart.toObject === 'function' ? cart.toObject() : cart;
      console.log('[CartController] returning cart.cartToken=', cartObj?.cartToken);
      res.json({ success: true, data: cartObj });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Add an item to cart.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.body - { productId, size, quantity }
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends { success: true, data: updatedCart }
   */
  addItem = async (req, res, next) => {
    try {
      const { productId, size, quantity } = req.body;
      const cartToken = req.cookies?.cartToken || req.header("x-cart-token");
      console.log('[CartController] addItem incoming cartToken(cookie/header)=', cartToken, 'productId=', productId);
      const cart = await this.cartUsecase.addItem({
        user: req.user,
        cartToken,
        productId,
        size,
        quantity
      });
      if (!req.user && !req.cookies?.cartToken) {
        res.cookie("cartToken", cart.cartToken, { maxAge: 30 * 24 * 3600 * 1000, httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        console.log('[CartController] set cartToken cookie after addItem=', cart.cartToken);
      }
      const cartObj = cart && typeof cart.toObject === 'function' ? cart.toObject() : cart;
      res.status(200).json({ success: true, data: cartObj });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update item quantity in cart.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.body - { itemId, quantity }
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends { success: true, data: updatedCart }
   */
  updateItem = async (req, res, next) => {
    try {
      const { itemId, quantity } = req.body;
      const cartToken = req.cookies?.cartToken || req.header("x-cart-token");
      const cart = await this.cartUsecase.updateItem({ user: req.user, cartToken, itemId, quantity });
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Remove item from cart.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.body - { itemId }
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends { success: true, data: updatedCart }
   */
  removeItem = async (req, res, next) => {
    try {
      const { itemId } = req.body;
      const cartToken = req.cookies?.cartToken || req.header("x-cart-token");
      const cart = await this.cartUsecase.removeItem({ user: req.user, cartToken, itemId });
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Clear all items from cart.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends { success: true, data: emptyCart }
   */
  clear = async (req, res, next) => {
    try {
      const cartToken = req.cookies?.cartToken || req.header("x-cart-token");
      const cart = await this.cartUsecase.clearCart({ user: req.user, cartToken });
      res.json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };
}

export default CartController;
