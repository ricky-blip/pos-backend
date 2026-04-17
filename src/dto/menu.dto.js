const { body } = require('express-validator');

/**
 * MenuRequestDTO - Rules for validating menu input
 */
const menuRequestValidators = {
  create: [
    body('name')
      .notEmpty().withMessage('Nama menu wajib diisi')
      .isLength({ min: 3 }).withMessage('Nama menu minimal 3 karakter'),
    body('price')
      .notEmpty().withMessage('Harga wajib diisi')
      .isNumeric().withMessage('Harga harus berupa angka')
      .custom(value => value >= 0).withMessage('Harga tidak boleh negatif'),
    body('categoryId')
      .notEmpty().withMessage('Kategori ID wajib diisi')
      .isNumeric().withMessage('Kategori ID harus berupa angka'),
    body('unit')
      .notEmpty().withMessage('Unit (satuan) wajib diisi'),
  ],
  update: [
    body('name').optional().isLength({ min: 3 }).withMessage('Nama menu minimal 3 karakter'),
    body('price').optional().isNumeric().withMessage('Harga harus berupa angka'),
    body('categoryId').optional().isNumeric().withMessage('Kategori ID harus berupa angka'),
  ]
};

/**
 * MenuResponseDTO - Formats the menu data for the client
 */
class MenuResponseDTO {
  constructor(menu) {
    this.id = menu.id;
    this.name = menu.name;
    this.description = menu.description;
    this.price = Number(menu.price);
    this.unit = menu.unit;
    this.image = menu.image;
    
    if (menu.category) {
      this.category = {
        id: menu.category.id,
        name: menu.category.name,
        slug: menu.category.slug
      };
    } else {
      this.categoryId = menu.categoryId;
    }
  }

  static fromModel(menu) {
    if (Array.isArray(menu)) {
      return menu.map(m => new MenuResponseDTO(m));
    }
    return new MenuResponseDTO(menu);
  }
}

module.exports = {
  menuRequestValidators,
  MenuResponseDTO
};
