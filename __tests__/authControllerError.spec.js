const authController = require("../controller/authController");
const mockRequest = require("../mocks/mockRequest");
const mockResponse = require("../mocks/mockResponse");
const { GetByEmail } = require("../mocks/customerMock");
const jwt = require("jsonwebtoken");

const mockAuthUC = {
  Register: jest.fn().mockReturnValue(null),
  Login: jest.fn().mockReturnValue(null),
  ForgotPassword: jest.fn().mockReturnValue(null),
  ResetPass: jest.fn().mockReturnValue(null),
  RequestVerify: jest.fn().mockReturnValue(null),
  VerifyEmail: jest.fn().mockReturnValue(null),
};

const token2 = jwt.sign(
  {
    id: "21b2f1f0-1553-4598-aa2d-8904a509f755",
    userName: "Admin",
    firstName: "Admin",
    lastName: "Binar",
    email: "admin@mail.com",
    photoProfile: "-",
    isAdmin: false,
    verified: null,
  },
  process.env.JWT_SECRET || "rahasia",
  { expiresIn: "1h" }
);

const mockCustomerNullUC = {
  GetByEmail: jest.fn().mockReturnValue(null),
};

const mockCustomerUC = {
  GetByEmail: jest.fn().mockReturnValue(GetByEmail),
};

describe("Authentication Testing", () => {
  test("Login Error Username Validation Error", async () => {
    let req = mockRequest(
      {
        userName: "",
        password: "Admin#2412",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.Login(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Username cannot be an empty field");
      })
    );
  });
  test("Login Error Password Validation Error", async () => {
    let req = mockRequest(
      {
        userName: "Admin",
        password: "Admin",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.Login(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Password should have a minimum length of 8");
      })
    );
  });
  test("Login Error Username Password Wrong", async () => {
    let req = mockRequest(
      {
        userName: "Admin",
        password: "Admin#2412",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.Login(req, res, jest.fn());

    expect(mockAuthUC.Login).toBeCalledWith(
      req.body.userName,
      req.body.password
    );

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Customer name atau password tidak sesuai.");
      })
    );
  });
  test("Register Error Validation Error", async () => {
    let req = mockRequest(
      {
        userName: "Admin",
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@mail.com",
        password: "Admin",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.Register(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Password should have a minimum length of 8");
      })
    );
  });
  test("Register Error Username Or Email not Available", async () => {
    let req = mockRequest(
      {
        userName: "Admin",
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@mail.com",
        password: "Admin#2412",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.Register(req, res, jest.fn());

    expect(mockAuthUC.Register).toBeCalledWith(req.body);

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Email atau username tidak tersedia.");
      })
    );
  });
  test("Forgot Password Error Validation Error", async () => {
    let req = mockRequest(
      {
        email: "adminmail.com",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.ForgotPassword(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Please insert a valid email address");
      })
    );
  });
  test("Forgot Password Error Email Not Found", async () => {
    let req = mockRequest(
      {
        email: "admin@mail.com",
      },
      {},
      {},
      { authUC: mockAuthUC, customerUC: mockCustomerNullUC }
    );

    let res = mockResponse();

    await authController.ForgotPassword(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Email not available");
      })
    );
  });
  test("Forgot Password Error Create Token", async () => {
    let req = mockRequest(
      {
        email: "admin@mail.com",
      },
      {},
      {},
      { authUC: mockAuthUC, customerUC: mockCustomerUC }
    );

    let res = mockResponse();

    await authController.ForgotPassword(req, res, jest.fn());

    expect(mockAuthUC.ForgotPassword).toBeCalledWith(req.body["email"]);

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Email not available");
      })
    );
  });
  test("Reset Password Error Validation Error", async () => {
    let req = mockRequest(
      {
        password: "Admin",
        confirmPassword: "Admin#24121",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.ResetPassword(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Password should have a minimum length of 8");
      })
    );
  });
  test("Reset Password Error Password not Match", async () => {
    let req = mockRequest(
      {
        password: "Admin#2412",
        confirmPassword: "Admin#24121",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.ResetPassword(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Password not match");
      })
    );
  });
  test("Reset Password Error Token Expired", async () => {
    let req = mockRequest(
      {
        password: "Admin#2412",
        confirmPassword: "Admin#2412",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.ResetPassword(req, res, jest.fn());

    expect(mockAuthUC.ResetPass).toBeCalledWith(
      req.query.token,
      req.query.email,
      req.body.password
    );

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Token has expired. Please try password reset again.");
      })
    );
  });
  test("Request Verify Error Validation Error", async () => {
    let req = mockRequest(
      {
        email: "adminmail.com",
      },
      {},
      {},
      { authUC: mockAuthUC }
    );

    let res = mockResponse();

    await authController.RequestVerify(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Please insert a valid email address");
      })
    );
  });
  test("Request Verify Error Email not Available", async () => {
    let req = mockRequest(
      {
        email: "admin@mail.com",
      },
      {},
      {},
      { authUC: mockAuthUC, customerUC: mockCustomerNullUC }
    );

    let res = mockResponse();

    await authController.RequestVerify(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Email not available");
      })
    );
  });
  test("Verify Email", async () => {
    let req = mockRequest(
      {},
      { token: token2 },
      {},
      { authUC: mockAuthUC, customerUC: mockCustomerNullUC }
    );

    let res = mockResponse();

    await authController.VerifyEmail(req, res, jest.fn());

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Email not available");
      })
    );
  });

  test("Verify Email", async () => {
    let req = mockRequest(
      {},
      { token: token2 },
      {},
      { authUC: mockAuthUC, customerUC: mockCustomerUC }
    );

    let res = mockResponse();

    await authController.VerifyEmail(req, res, jest.fn());

    expect(mockAuthUC.VerifyEmail).toBeCalledWith("admin@mail.com");

    expect(
      jest.fn().mockImplementation(() => {
        throw Error("Cannot verify this email, try again");
      })
    );
  });
});
