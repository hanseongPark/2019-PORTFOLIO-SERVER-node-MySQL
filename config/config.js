require('dotenv').config();
 //config.js 는 sequelize의 설정을 담고 있습니다. dotenv를 사용하여
 //데이터베이스 사용자의 이름과 비밀번호를 암호화하였습니다. cross-env를 통해
 //설정된 process.env.NODE_ENV가 development인가 production인가에 따라
 //각각의 설정을 적용하게 됩니다.
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