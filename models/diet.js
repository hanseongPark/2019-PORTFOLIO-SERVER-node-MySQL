//diet.js는 사용자의 식단관리 데이터베이스입니다. 날짜를 바탕으로 음식의 이름
//음식의 양, 칼로리, 탄, 단, 지 등의 영양성분을 컬럼값으로 정의합니다. timestamp와
//paranoid 설정을 통해 데이터의 생성, 수정, 삭제 시간을 알 수 있습니다.

module.exports = (sequelize, DataTypes) => (
    sequelize.define('diet', {
      food: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      gram: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      calorie: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      carb: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      protein: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      fat: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
      },
      date: {
          type: DataTypes.STRING(20),
          allowNull: true,
      }
    }, {
      timestamps: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })
  );