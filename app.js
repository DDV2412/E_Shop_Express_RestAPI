require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");


app.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 * Import middleware
 */

const error = require("./middleware/error-middleware");

/**
 * Import logs
 */

const loggerWinston = require("./helper/logs-winston");

/**
 * Swagger
 */
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/docs.json");

/**
 * Import router
 */

const router = require("./routes");
const routerOrders = require("./routes/orderRoutes");

app.use('/api/order', routerOrders);


/**
 * Import DB Model
 */
const { sequelize } = require("./models");

const app = express();

/**
 * Import Use Case and Repository
 */

const productUseCase = require("./use_case/productUseCase");
const categoryUseCase = require("./use_case/categoryUseCase");
const subCategoryUseCase = require("./use_case/subCategoryUseCase");
const productRepo = require("./repository/productRepo");
const categotyRepo = require("./repository/categotyRepo");
const subCategoryRepo = require("./repository/subCategoryRepo");

/**
 * Init Use Case and Repository
 */

const productUC = new productUseCase(new productRepo());
const categoryUC = new categoryUseCase(new categotyRepo());
const subCategoryUC = new subCategoryUseCase(new subCategoryRepo());

/**
 * Checking connection to database
 */

sequelize
  .authenticate()
  .then(() => {
    loggerWinston.info("Connection has been established successfully.");
  })
  .catch((err) => {
    loggerWinston.error("Unable to connect to the database:", err);
  });

/**
 * Middleware
 */
app.use(helmet());
app.use(morgan("combined", { stream: loggerWinston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Inject Use Case
 */

app.use((req, res, next) => {
  req.uC = [];

  req.uC.productUC = productUC;
  req.uC.categoryUC = categoryUC;
  req.uC.subCategoryUC = subCategoryUC;
  next();
});

/**
 * Init router
 */

app.use("/api", router);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  /**
   * #swagger.ignore = true
   */

  res.status(200).json({
    message: "Welcome to my API",
  });
});

app.use(express.static(path.join(__dirname + "/public/images")));
app.use(error);


module.exports = app;
