/**
 * ProductController - Handles product listing and retrieval.
 *
 * @class ProductController
 * @param {ProductUsecase} productUsecase - Injected product business logic
 */
class ProductController {
  constructor(productUsecase) {
    this.productUsecase = productUsecase;
  }

  /**
   * List products with optional filters, search, and pagination.
   *
   * @async
   * @param {Object} req - Express request
   * @param {Object} req.query - { page, limit, search, category, size, minPrice, maxPrice }
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends { success: true, data: { products, meta } }
   */
  list = async (req, res, next) => {
    try {
      const result = await this.productUsecase.list(req.query);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get a single product by ID.
   *
   * @async
   * @param {Object} req - Express request
   * @param {string} req.params.id - Product ID
   * @param {Object} res - Express response
   * @param {Function} next - Express next middleware
   * @returns {void} - Sends { success: true, data: product }
   */
  get = async (req, res, next) => {
    try {
      const product = await this.productUsecase.getById(req.params.id);
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  };
}

export default ProductController;
