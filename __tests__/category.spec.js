const categoryController = require("../controller/category");

let mockCategoryUC = {
  allCategories: jest.fn().mockReturnValue({
    category: [
      {
        id: "6d6c816d-56ad-47ce-9eca-61a1b1dfebe1",
        name: "Computer and Laptop",
      },
    ],
    total: 1,
  }),
  getByID: jest.fn().mockReturnValue({
    id: "6d6c816d-56ad-47ce-9eca-61a1b1dfebe1",
    name: "Computer and Laptop",
  }),
  createCategory: jest.fn().mockReturnValue({
    id: "83641605-ba8d-4223-8365-55bb92398d9f",
    name: "Computer and Laptop",
  }),
  updateCategory: jest.fn().mockReturnValue({
    id: "6d6c816d-56ad-47ce-9eca-61a1b1dfebe1",
    name: "Electronik",
  }),
  deleteCategory: jest.fn().mockReturnValue(1),
};

const mockRequest = (body = {}, query = {}, params = {}, useCases = {}) => {
  return {
    body,
    query,
    params,
    ...useCases,
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

describe("Testing category controller", () => {
  test("Get All Category", async () => {
    let req = mockRequest({}, {}, {}, { categoryUC: mockCategoryUC });

    let res = mockResponse();

    await categoryController.allCategories(req, res, jest.fn());

    expect(mockCategoryUC.allCategories).toBeCalledWith(req.query["filters"]);
    expect(res.json).toBeCalledWith({
      success: true,
      total: 1,
      category: [
        {
          id: "6d6c816d-56ad-47ce-9eca-61a1b1dfebe1",
          name: "Computer and Laptop",
        },
      ],
    });
  });
  test("Category By ID", async () => {
    let req = mockRequest(
      {},
      {},
      { category_id: "6d6c816d-56ad-47ce-9eca-61a1b1dfebe1" },
      { categoryUC: mockCategoryUC }
    );

    let res = mockResponse();

    await categoryController.getByID(req, res, jest.fn());

    expect(mockCategoryUC.getByID).toBeCalledWith(req.params["category_id"]);
    expect(res.json).toBeCalledWith({
      success: true,
      category: {
        id: "6d6c816d-56ad-47ce-9eca-61a1b1dfebe1",
        name: "Computer and Laptop",
      },
    });
  });
  test("Create Category", async () => {
    let req = mockRequest(
      {
        name: "Computer and Laptop",
      },
      {},
      {},
      { categoryUC: mockCategoryUC }
    );

    let res = mockResponse();

    await categoryController.createCategory(req, res, jest.fn());

    expect(mockCategoryUC.createCategory).toBeCalledWith(req.body);
    expect(res.json).toBeCalledWith({
      success: true,
      category: {
        id: "83641605-ba8d-4223-8365-55bb92398d9f",
        name: "Computer and Laptop",
      },
    });
  });
  test("Update Category", async () => {
    let req = mockRequest(
      {
        name: "Electronik",
      },
      {},
      { category_id: "6d6c816d-56ad-47ce-9eca-61a1b1dfebe1" },
      { categoryUC: mockCategoryUC }
    );

    let res = mockResponse();

    await categoryController.updateCategory(req, res, jest.fn());

    expect(mockCategoryUC.updateCategory).toBeCalledWith(
      req.params["category_id"],
      req.body
    );
    expect(res.json).toBeCalledWith({
      success: true,
      message: "Successfully updated category",
    });
  });
  test("Delete Category", async () => {
    let req = mockRequest(
      {},
      {},
      { category_id: "6d6c816d-56ad-47ce-9eca-61a1b1dfebe1" },
      { categoryUC: mockCategoryUC }
    );

    let res = mockResponse();

    await categoryController.deleteCategory(req, res, jest.fn());

    expect(mockCategoryUC.deleteCategory).toBeCalledWith(
      req.params["category_id"]
    );
    expect(res.json).toBeCalledWith({
      success: true,
      message: "Successfully deleted category",
    });
  });
});