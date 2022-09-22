const errorHandler = require("../helper/error-handler");
const { categoryValidation } = require("../validation");

module.exports = {
  allCategories: async (req, res, next) => {
    try {
      /**
        #swagger.tags = ['Category']
        #swagger.summary = 'Category product list'
        #swagger.description = 'Category product list'
        #swagger.responses[200] = {
          description: 'Category product successfully.',
          schema: [{ $ref: '#/definitions/Category' }]
        }
       */
      const { filters } = req.query;

      let category = await req.uC.categoryUC.allCategories(filters);

      if (category == null) {
        category = [];
      }

      res.status(200).json({
        success: true,
        status: 200,
        total: category.total || 0,
        category: category.category,
      });
    } catch (error) {
      return next(new errorHandler(error.message, 500));
    }
  },

  getByID: async (req, res, next) => {
    /**
        #swagger.tags = ['Category']
        #swagger.summary = 'Category product by ID'
        #swagger.description = 'Category product by ID'
        #swagger.responses[200] = {
          description: 'Category product successfully.',
          schema: { $ref: '#/definitions/Category' }
        }
        #swagger.responses[404] = {
          description: 'Category product not found.',
          schema: {
            success: false,
            status: 404,
            message: "Category not found"
          }
        }
       */
    try {
      const { category_id } = req.params;

      const category = await req.uC.categoryUC.getByID(category_id);

      if (!category) return next(new errorHandler("Category not found", 404));

      res.status(200).json({
        success: true,
        status: 200,
        category,
      });
    } catch (error) {
      return next(new errorHandler(error.message, 500));
    }
  },

  createCategory: async (req, res, next) => {
    try {
      /**
        #swagger.tags = ['Category']
        #swagger.summary = 'Create category product'
        #swagger.description = 'Create category product'
        #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Add new category',
                required: true,
                schema: {
                    $ref: '#/definitions/CreateCategory'
                }
            }
        #swagger.responses[201] = {
          description: 'Successfully added new category.',
          schema: { $ref: '#/definitions/Category' }
        }
        #swagger.responses[400] = {
          description: 'Validation error',
          schema: {
            success: false,
            status: 400,
            message: "____"
          }
        }
        #swagger.responses[500] = {
          description: 'Server error',
          schema: {
            success: false,
            status: 500,
            message: "____"
          }
        }
        
       */

      const { error } = categoryValidation({
        name: req.body["name"],
      });

      if (error)
        return next(new errorHandler(error["details"][0].message, 400));

      const category = await req.uC.categoryUC.createCategory(req.body);

      res.status(201).json({
        success: true,
        status: 201,
        category,
      });
    } catch (error) {
      return next(new errorHandler(error.message, 500));
    }
  },

  updateCategory: async (req, res, next) => {
    try {
      /**
        #swagger.tags = ['Category']
        #swagger.summary = 'Update category product by ID'
        #swagger.description = 'Update category product by ID'
        #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Update category',
                required: true,
                schema: {
                    $ref: '#/definitions/CreateCategory'
                }
            }
        #swagger.responses[200] = {
          description: 'Successfully updated category.',
          schema: { $ref: '#/definitions/Category' }
        }
        #swagger.responses[400] = {
          description: 'Validation error',
          schema: {
            success: false,
            status: 400,
            message: "____"
          }
        }
        #swagger.responses[500] = {
          description: 'Server error',
          schema: {
            success: false,
            status: 500,
            message: "____"
          }
        }
        
       */
      const { category_id } = req.params;

      const categoryCheck = await req.uC.categoryUC.getByID(category_id);

      if (!categoryCheck)
        return next(new errorHandler("Category not found", 404));

      const { error } = categoryValidation({
        name: req.body["name"],
      });

      if (error)
        return next(new errorHandler(error["details"][0].message, 400));

      const category = await req.uC.categoryUC.updateCategory(
        categoryCheck,
        req.body
      );

      res.status(200).json({
        success: true,
        status: 200,
        category,
      });
    } catch (error) {
      return next(new errorHandler(error.message, 500));
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      /**
        #swagger.tags = ['Category']
        #swagger.summary = 'Delete category product by ID'
        #swagger.description = 'Delete category product by ID'
        #swagger.responses[200] = {
          description: 'Successfully deleted category.',
          schema: { $ref: '#/definitions/Category' }
        }
        #swagger.responses[404] = {
          description: 'Category not found,
          schema: {
            success: false,
            status: 404,
            message: "Category not found"
          }
        }
        
        
       */
      const { category_id } = req.params;

      const categoryCheck = await req.uC.categoryUC.getByID(category_id);

      if (!categoryCheck)
        return next(new errorHandler("Category not found", 404));

      await req.uC.categoryUC.deleteCategory(categoryCheck);

      res.status(200).json({
        success: true,
        status: 200,
        message: "Successfully delete category",
      });
    } catch (error) {
      return next(new errorHandler(error.message, 500));
    }
  },
};