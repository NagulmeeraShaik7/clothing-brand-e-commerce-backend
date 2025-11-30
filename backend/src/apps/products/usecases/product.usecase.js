import { getPagination, getMeta } from "../../../utils/pagination.utils.js";

class ProductUsecase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async list(query) {
    const { page, limit } = getPagination(query);
    const result = await this.productRepository.list({ ...query, page, limit });
    return { products: result.products, meta: getMeta(result.total, page, limit) };
  }

  async getById(id) {
    const p = await this.productRepository.findById(id);
    if (!p) {
      const e = new Error("Product not found");
      e.status = 404;
      throw e;
    }
    return p;
  }
}

export default ProductUsecase;
