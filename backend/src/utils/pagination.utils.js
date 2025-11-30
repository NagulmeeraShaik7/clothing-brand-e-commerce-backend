export function getPagination(query = {}) {
  const page = Math.max(1, parseInt(query.page || 1));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return { total, page, limit, totalPages };
}
