/**
 * CategoryResponseDTO - Formats the category data for the client
 */
class CategoryResponseDTO {
  constructor(category) {
    this.id = category.id;
    this.name = category.label || category.name;
    this.slug = category.slug;
  }

  static fromModel(category) {
    if (Array.isArray(category)) {
      return category.map(c => new CategoryResponseDTO(c));
    }
    return new CategoryResponseDTO(category);
  }
}

module.exports = {
  CategoryResponseDTO
};
