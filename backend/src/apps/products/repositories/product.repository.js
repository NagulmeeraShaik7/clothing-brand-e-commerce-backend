import Product from "../models/product.model.js";
import mongoose from "mongoose";

class ProductRepository {
  async createMany(products) {
    return Product.insertMany(products);
  }

  async findById(id) {
    return Product.findById(id);
  }

  /**
   * list with aggregation pipeline supporting combined filters/search/pagination
   * query: { page, limit, category, size, minPrice, maxPrice, search }
   */
  async list(query) {
    const page = Math.max(1, parseInt(query.page || 1));
    const limit = Math.max(1, parseInt(query.limit || 10));
    const skip = (page - 1) * limit;

    const match = {};

    if (query.category) match.category = query.category;
    if (query.size) match.sizes = query.size;
    if (query.minPrice) match.price = { ...(match.price || {}), $gte: parseFloat(query.minPrice) };
    if (query.maxPrice) match.price = { ...(match.price || {}), $lte: parseFloat(query.maxPrice) };

    const pipeline = [{ $match: match }];

    if (query.search) {
      pipeline.push({
        $match: {
          $text: { $search: query.search }
        }
      });
      // score sort if search present
      pipeline.push({ $addFields: { score: { $meta: "textScore" } } });
      pipeline.push({ $sort: { score: -1, createdAt: -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
      {
        $facet: {
          meta: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      },
      {
        $unwind: {
          path: "$meta",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          products: "$data",
          total: { $ifNull: ["$meta.total", 0] }
        }
      }
    );

    const res = await Product.aggregate(pipeline);
    return res[0] || { products: [], total: 0 };
  }
}

export default ProductRepository;
