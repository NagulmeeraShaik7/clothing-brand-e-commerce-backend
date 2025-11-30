export function buildTextSearch(query, fields = []) {
  if (!query || !query.search) return {};
  const regex = new RegExp(query.search.trim(), "i");
  return { $or: fields.map((f) => ({ [f]: regex })) };
}
