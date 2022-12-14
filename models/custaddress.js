"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CustAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "cust_id",
      });
    }
  }
  CustAddress.init(
    {
      cust_id: DataTypes.INTEGER,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      line: DataTypes.STRING,
      zip_code: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CustAddress",
      tableName: "cust_address",
    }
  );

  CustAddress.addHook("beforeCreate", async (custaddress, options) => {
    custaddress["id"] = uuidv4();
  });
  return CustAddress;
};
