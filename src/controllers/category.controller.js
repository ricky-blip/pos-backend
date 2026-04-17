const { categoryService } = require('../services/category.service');
const { successResponse } = require('../utils/responseHelper');
const { CategoryResponseDTO } = require('../dto/category.dto');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    const categoriesDTO = CategoryResponseDTO.fromModel(categories);
    return successResponse(res, 200, 'Berhasil mengambil daftar kategori', categoriesDTO);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    const categoryDTO = CategoryResponseDTO.fromModel(category);
    return successResponse(res, 200, 'Berhasil mengambil kategori', categoryDTO);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    const categoryDTO = CategoryResponseDTO.fromModel(category);
    return successResponse(res, 201, 'Kategori berhasil dibuat', categoryDTO);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    const categoryDTO = CategoryResponseDTO.fromModel(category);
    return successResponse(res, 200, 'Kategori berhasil diupdate', categoryDTO);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return successResponse(res, 200, 'Kategori berhasil dihapus');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
