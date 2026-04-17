const { menuService } = require('../services/menu.service');
const { successResponse } = require('../utils/responseHelper');
const { MenuResponseDTO } = require('../dto/menu.dto');

const getAllMenus = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.categoryId && req.query.categoryId !== 'all') {
      filters.categoryId = req.query.categoryId;
    }
    if (req.query.search) {
      filters.keyword = req.query.search;
    }
    
    const menus = await menuService.getAllMenus(filters);
    const menusDTO = MenuResponseDTO.fromModel(menus);
    return successResponse(res, 200, 'Berhasil mengambil daftar menu', menusDTO);
  } catch (error) {
    next(error);
  }
};

const getMenuById = async (req, res, next) => {
  try {
    const menu = await menuService.getMenuById(req.params.id);
    const menuDTO = MenuResponseDTO.fromModel(menu);
    return successResponse(res, 200, 'Berhasil mengambil menu', menuDTO);
  } catch (error) {
    next(error);
  }
};

const createMenu = async (req, res, next) => {
  try {
    const menu = await menuService.createMenu(req.body);
    const menuDTO = MenuResponseDTO.fromModel(menu);
    return successResponse(res, 201, 'Menu berhasil dibuat', menuDTO);
  } catch (error) {
    next(error);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const menu = await menuService.updateMenu(req.params.id, req.body);
    const menuDTO = MenuResponseDTO.fromModel(menu);
    return successResponse(res, 200, 'Menu berhasil diupdate', menuDTO);
  } catch (error) {
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    await menuService.deleteMenu(req.params.id);
    return successResponse(res, 200, 'Menu berhasil dihapus');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
};
