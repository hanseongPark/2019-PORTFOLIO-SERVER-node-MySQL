require('dotenv').config();

module.exports = {
    development: {
        username: process.env.SEQUELIZE_ID,
        password: process.env.SEQUELIZE_PASSWORD,
        database: "portfoliodb",
        host: "127.0.0.1",
        dialect: "mysql"
      },
      production: {
        username: process.env.SEQUELIZE_ID,
        password: process.env.SEQUELIZE_PASSWORD,
        database: "database_production",
        host: "127.0.0.1",
        dialect: "mysql"
      }
}